import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";
import { sendEmail } from "@/lib/email";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get all collaborators for a project
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is owner or collaborator
    const isOwner = project.userId === session.user.id;
    const isCollaborator = await prisma.projectCollaborator.findFirst({
      where: {
        projectId,
        userId: session.user.id,
        inviteStatus: "ACCEPTED"
      }
    });

    if (!isOwner && !isCollaborator && !project.shared) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // Get all collaborators
    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      include: {
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

    // Add owner to the list
    const allCollaborators = [
      {
        user: project.user,
        role: "OWNER",
        inviteStatus: "ACCEPTED",
        isOwner: true
      },
      ...collaborators.map(collab => ({
        ...collab,
        isOwner: false
      }))
    ];

    return NextResponse.json({
      collaborators: allCollaborators,
      isOwner
    });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json({ error: "Failed to fetch collaborators" }, { status: 500 });
  }
}

// Add a collaborator to a project
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const { email, role = "VIEWER" } = await request.json();

    // Check if user is the project owner
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        userId: true
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or you're not the owner" }, { status: 404 });
    }

    // Find the user to invite
    const userToInvite = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!userToInvite) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already a collaborator
    const existingCollaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userToInvite.id
        }
      }
    });

    if (existingCollaborator) {
      return NextResponse.json({ error: "User is already a collaborator" }, { status: 400 });
    }

    // Create the collaboration
    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        userId: userToInvite.id,
        role,
        invitedBy: session.user.id
      },
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

    // Send email notification if email module is available
    if (typeof sendEmail === 'function') {
      try {
        await sendEmail({
          to: userToInvite.email,
          subject: `You've been invited to collaborate on ${project.name}`,
          text: `${session.user.name || 'Someone'} has invited you to collaborate on the project "${project.name}" on SketchFlow. Log in to view the project.`,
          html: `
            <h1>Collaboration Invitation</h1>
            <p>${session.user.name || 'Someone'} has invited you to collaborate on the project "${project.name}" on SketchFlow.</p>
            <p>Your role: ${role.toLowerCase()}</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/project/${projectId}">Click here to view the project</a></p>
          `
        });
      } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
        // Continue even if email fails
      }
    } else {
      console.log("Email module not available, skipping invitation email");
    }

    // Log the activity
    await prisma.collaborationActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: "invited_collaborator",
        details: {
          collaboratorId: userToInvite.id,
          collaboratorName: userToInvite.name,
          collaboratorEmail: userToInvite.email,
          role
        }
      }
    });

    return NextResponse.json(collaborator);
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return NextResponse.json({ error: "Failed to add collaborator" }, { status: 500 });
  }
}
