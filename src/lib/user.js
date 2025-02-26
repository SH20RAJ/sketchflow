import { prisma } from '../prisma';

export async function getUserFromEmail(email) {
  if (!email) throw new Error("Email is required");
  
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
    },
  });

  if (!user) throw new Error("User not found");
  return user;
}
