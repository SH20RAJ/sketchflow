import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserFromEmail } from "./lib/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
  },
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (!profile?.email) {
          throw new Error("Email is required");
        }

        let baseUsername = profile.name?.replace(/\s+/g, "").toLowerCase() || 
                          profile.email.split('@')[0];
        let username = baseUsername;
        let counter = 1;

        while (true) {
          const existingUser = await prisma.user.findFirst({
            where: { username },
          });

          if (!existingUser) break;
          username = `${baseUsername}${counter}`;
          counter++;
        }

        await prisma.user.upsert({
          where: { email: profile.email },
          create: {
            email: profile.email,
            name: profile.name || username,
            username,
            image: profile.picture || null,
          },
          update: {
            name: profile.name,
            image: profile.picture || null,
          },
        });

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user?.email) {
          const user = await getUserFromEmail(session.user.email);
          session.user.id = user.id;
          session.user.username = user.username;
        }
        return session;
      } catch (error) {
        console.error('Session error:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.username = user.username;
        }
        return token;
      } catch (error) {
        console.error('JWT error:', error);
        return token;
      }
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : '/projects';
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
