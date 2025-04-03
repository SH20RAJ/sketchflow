import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get all invitations for the current user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pending invitations
    const pendingInvitations = await prisma.projectCollaborator.findMany({
      where: {
        userId: session.user.id,
        inviteStatus: "PENDING"
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            emoji: true,
            color: true,
            updatedAt: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { invitedAt: 'desc' }
    });

    return NextResponse.json({ invitations: pendingInvitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }
}
