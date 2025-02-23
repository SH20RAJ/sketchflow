import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET(request) {
  let session = null;
  
  try {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all projects shared with the user
    const sharedProjects = await prisma.project.findMany({
      where: {
        AND: [
          { shared: true },
          // { userId: { not: session.user.id } }, // Exclude user's own projects
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform the response to match the expected format
    const transformedProjects = sharedProjects.map(project => ({
      ...project,
      owner: project.user, // Map user to owner for frontend consistency
      user: undefined, // Remove the user field to avoid duplication
    }));

    return NextResponse.json({
      projects: transformedProjects,
      count: transformedProjects.length,
    });
  } catch (error) {
    console.error("Error fetching shared projects:", {
      error: error.message,
      stack: error.stack,
      userId: session?.user?.id || 'not authenticated'
    });
    return NextResponse.json(
      { error: "Failed to fetch shared projects", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 