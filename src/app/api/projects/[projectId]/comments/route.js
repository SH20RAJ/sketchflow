import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get all comments for a project
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
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

    // Get all comments
    const comments = await prisma.projectComment.findMany({
      where: {
        projectId,
        parentId: null // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        replies: {
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
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// Create a new comment
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const { content, elementId, position, parentId } = await request.json();

    // Check if user has access to the project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is owner or collaborator with at least COMMENTER role
    const isOwner = project.userId === session.user.id;
    const collaborator = await prisma.projectCollaborator.findFirst({
      where: {
        projectId,
        userId: session.user.id,
        inviteStatus: "ACCEPTED",
        role: { in: ["EDITOR", "COMMENTER"] }
      }
    });

    if (!isOwner && !collaborator) {
      return NextResponse.json({ error: "Unauthorized to add comments" }, { status: 403 });
    }

    // Create the comment
    const comment = await prisma.projectComment.create({
      data: {
        projectId,
        userId: session.user.id,
        content,
        elementId,
        position,
        parentId
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

    // Log the activity
    await prisma.collaborationActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: "added_comment",
        details: {
          commentId: comment.id,
          comment: content.substring(0, 100),
          elementId,
          parentId
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
