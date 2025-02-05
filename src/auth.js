import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserFromEmail } from "./lib/user";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [ 
    // Github,
     Google],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("account", account);
      console.log("profile", profile);
      if (!profile?.email) {
        throw new Error("No profile");
      }

      let baseUsername = profile.name.replace(/\s+/g, "").toLowerCase();
      let username = baseUsername;
      let usernameExists = true;
      let counter = 1;

      while (usernameExists) {
        const existingUser = await prisma.user.findFirst({
          where: { username },
        });

        if (!existingUser) {
          usernameExists = false;
        } else {
          username = `${baseUsername}${counter}`;
          counter++;
        }
      }

      const password = Math.random().toString(36).slice(-8);

      let user = await prisma.user.upsert({
        where: { email: profile.email },
        create: {
          email: profile.email,
          name: profile.name,
          username,
          password,
          image: profile.avatar_url || profile.picture,
        },
        update: {
          // name: profile.name,
          image: profile.avatar_url || profile.picture,
        },
      });

      // console.log("session",session);
      return true;
    },
    async redirect() {
      return "/";
    },
    async session({session, token}) {
      session.user.userId = token.id;
      session.user.username = token.username
      return session;
    },
    async jwt({ token, user }) {
    // console.log("Ddsvdvs",/*  */token,user);
      if (user) {
        console.log("some user",user);
        let cs = await getUserFromEmail(token.email);
        console.log("cs",cs);
        token.id = user.id;
        token.username = cs.username
        token.id = cs.id
      }
      // console.log("user", user);
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
