import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Respond to an invitation (accept or reject)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const { status } = await request.json();

    if (status !== "ACCEPTED" && status !== "REJECTED") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find the invitation
    const invitation = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: session.user.id
        }
      },
      include: {
        project: {
          select: {
            name: true,
            userId: true
          }
        }
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.inviteStatus !== "PENDING") {
      return NextResponse.json({ error: "Invitation has already been processed" }, { status: 400 });
    }

    // Update the invitation status
    const updatedInvitation = await prisma.projectCollaborator.update({
      where: {
        projectId_userId: {
          projectId,
          userId: session.user.id
        }
      },
      data: {
        inviteStatus: status,
        acceptedAt: status === "ACCEPTED" ? new Date() : null
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Log the activity
    await prisma.collaborationActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: status === "ACCEPTED" ? "accepted_invitation" : "rejected_invitation",
        details: {
          projectName: invitation.project.name
        }
      }
    });

    return NextResponse.json({
      success: true,
      invitation: updatedInvitation,
      message: status === "ACCEPTED"
        ? `You are now collaborating on ${invitation.project.name}`
        : `You have declined the invitation to ${invitation.project.name}`
    });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return NextResponse.json({ error: "Failed to process invitation" }, { status: 500 });
  }
}
