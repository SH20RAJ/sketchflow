import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Update a collaborator's role
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, userId } = params;
    const { role } = await request.json();

    // Check if user is the project owner
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or you're not the owner" }, { status: 404 });
    }

    // Update the collaborator's role
    const updatedCollaborator = await prisma.projectCollaborator.update({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Log the activity
    await prisma.collaborationActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: "updated_collaborator_role",
        details: {
          collaboratorId: userId,
          collaboratorName: updatedCollaborator.user.name,
          newRole: role
        }
      }
    });

    return NextResponse.json(updatedCollaborator);
  } catch (error) {
    console.error("Error updating collaborator:", error);
    return NextResponse.json({ error: "Failed to update collaborator" }, { status: 500 });
  }
}

// Remove a collaborator
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, userId } = params;

    // Check if user is the project owner or the collaborator themselves
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.userId === session.user.id;
    const isSelf = userId === session.user.id;

    if (!isOwner && !isSelf) {
      return NextResponse.json({ error: "Unauthorized to remove this collaborator" }, { status: 403 });
    }

    // Get collaborator info before deletion for activity log
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!collaborator) {
      return NextResponse.json({ error: "Collaborator not found" }, { status: 404 });
    }

    // Remove the collaborator
    await prisma.projectCollaborator.delete({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });

    // Log the activity
    await prisma.collaborationActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: isSelf ? "left_project" : "removed_collaborator",
        details: {
          collaboratorId: userId,
          collaboratorName: collaborator.user.name
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json({ error: "Failed to remove collaborator" }, { status: 500 });
  }
}
