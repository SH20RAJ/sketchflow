import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Get all activities for a project
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

    // Get all activities
    const activities = await prisma.collaborationActivity.findMany({
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
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to most recent 50 activities
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

// Create a new activity
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const { action, details } = await request.json();

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

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // Create the activity
    const activity = await prisma.collaborationActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action,
        details
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

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
