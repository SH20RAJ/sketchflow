


export async function getUserFromEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  })
}






