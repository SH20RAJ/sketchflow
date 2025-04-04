import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Helper function to check if user is admin
const isAdminUser = (email) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'sh20raj@gmail.com';
  return email === adminEmail;
};

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Login to view the content" }, { status: 401 });
    }

    const { projectId } = params;

    // Get current project with user details
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
        },
        diagrams: true,
        markdowns: true
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin = isAdminUser(session.user.email);
    const isOwner = project.userId === session.user.id;

    // Check if user is a collaborator
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: session.user.id
        }
      },
      select: {
        role: true,
        inviteStatus: true
      }
    });

    const isCollaborator = collaborator && collaborator.inviteStatus === "ACCEPTED";
    const collaboratorRole = isCollaborator ? collaborator.role : null;

    // Allow access if user is owner, project is shared, user is admin, or user is a collaborator
    if (!isOwner && !project.shared && !isAdmin && !isCollaborator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If admin is viewing someone else's project, log it
    if (isAdmin && !isOwner) {
      await prisma.adminLog.create({
        data: {
          action: 'VIEW_PROJECT',
          details: JSON.stringify({
            projectId,
            projectName: project.name,
            ownerId: project.userId
          }),
          userId: session.user.id
        }
      });
    }

    // Get the main diagram and markdown
    let mainDiagram = project.diagrams[0];
    let mainMarkdown = project.markdowns[0];

    if (mainDiagram?.content?.appState) {
      mainDiagram.content.appState.collaborators = [];
    }

    const response = {
      ...project,
      markdown: mainMarkdown,
      diagram: mainDiagram,
      isOwner,
      isCollaborator,
      collaboratorRole
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin = isAdminUser(session.user.email);
    const isOwner = project.userId === session.user.id;

    // Only allow deletion if user is owner or admin
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete project and related data
    await prisma.$transaction([
      prisma.diagram.deleteMany({ where: { projectId } }),
      prisma.markdown.deleteMany({ where: { projectId } }),
      prisma.project.delete({ where: { id: projectId } })
    ]);

    // If admin is deleting someone else's project, log it
    if (isAdmin && !isOwner) {
      await prisma.adminLog.create({
        data: {
          action: 'DELETE_PROJECT',
          details: JSON.stringify({
            projectId,
            projectName: project.name,
            ownerId: project.userId
          }),
          userId: session.user.id
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project delete error:', error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const data = await request.json();

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin = isAdminUser(session.user.email);
    const isOwner = project.userId === session.user.id;

    // Only allow update if user is owner or admin
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle content and diagram updates
    let updatedProject;

    if (data.content || data.diagram) {
      // Update project name and description
      updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          name: data.name,
          description: data.description
        },
        include: {
          diagrams: true,
          markdowns: true
        }
      });

      // Update markdown content if provided
      if (data.content) {
        if (updatedProject.markdowns.length > 0) {
          // Update existing markdown
          await prisma.markdown.update({
            where: { id: updatedProject.markdowns[0].id },
            data: { content: data.content }
          });
        } else {
          // Create new markdown
          await prisma.markdown.create({
            data: {
              content: data.content,
              projectId
            }
          });
        }
      }

      // Update diagram content if provided
      if (data.diagram) {
        if (updatedProject.diagrams.length > 0) {
          // Update existing diagram
          await prisma.diagram.update({
            where: { id: updatedProject.diagrams[0].id },
            data: { content: data.diagram }
          });
        } else {
          // Create new diagram
          await prisma.diagram.create({
            data: {
              content: data.diagram,
              projectId
            }
          });
        }
      }

      // Fetch the updated project with all related data
      updatedProject = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          diagrams: true,
          markdowns: true
        }
      });
    } else {
      // Simple update without content changes
      updatedProject = await prisma.project.update({
        where: { id: projectId },
        data
      });
    }

    // If admin is updating someone else's project, log it
    if (isAdmin && !isOwner) {
      await prisma.adminLog.create({
        data: {
          action: 'UPDATE_PROJECT',
          details: JSON.stringify({
            projectId,
            projectName: project.name,
            ownerId: project.userId,
            changes: data
          }),
          userId: session.user.id
        }
      });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        diagrams: true
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin = isAdminUser(session.user.email);
    const isOwner = project.userId === session.user.id;

    // Only allow updates if user is owner or admin
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const mainDiagram = project.diagrams[0];

    const updatedDiagram = await prisma.diagram.update({
      where: { id: mainDiagram.id },
      data: {
        content: {
          ...mainDiagram.content,
          ...body
        }
      }
    });

    // If admin is updating someone else's project, log it
    if (isAdmin && !isOwner) {
      await prisma.adminLog.create({
        data: {
          action: 'UPDATE_PROJECT_DIAGRAM',
          details: JSON.stringify({
            projectId,
            projectName: project.name,
            ownerId: project.userId,
            diagramId: mainDiagram.id
          }),
          userId: session.user.id
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
