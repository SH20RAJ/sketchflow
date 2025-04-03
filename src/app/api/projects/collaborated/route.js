import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      // Find projects where the user is a collaborator with ACCEPTED status
      collaborators: {
        some: {
          userId: session.user.id,
          inviteStatus: "ACCEPTED"
        }
      },
      // Exclude projects owned by the user
      userId: { not: session.user.id },
      // Add search filter if provided
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Get total count for pagination
    const totalCount = await prisma.project.count({ where });

    // Get collaborated projects
    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        [sortBy]: order
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
        projectTags: {
          select: {
            id: true,
            name: true,
            emoji: true,
            color: true
          }
        },
        collaborators: {
          where: {
            userId: session.user.id
          },
          select: {
            role: true,
            inviteStatus: true,
            acceptedAt: true
          }
        }
      },
      skip,
      take: limit
    });

    // Transform the response to include role information
    const transformedProjects = projects.map(project => {
      const collaboratorInfo = project.collaborators[0] || {};
      return {
        ...project,
        owner: project.user,
        role: collaboratorInfo.role || "VIEWER",
        collaborationAcceptedAt: collaboratorInfo.acceptedAt,
        // Remove redundant data
        user: undefined,
        collaborators: undefined
      };
    });

    return NextResponse.json({
      projects: transformedProjects,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching collaborated projects:", error);
    return NextResponse.json({ error: "Failed to fetch collaborated projects" }, { status: 500 });
  }
}
