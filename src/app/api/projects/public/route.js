import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

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

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10); // Default 9 items per page
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const order = searchParams.get('order') || 'desc';

    // Build the where clause
    const whereClause = {
      AND: [
        { shared: true },
        // Exclude user's own projects if requested
        ...(searchParams.get('excludeOwn') === 'true' ? [{ userId: { not: session.user.id } }] : []),
      ],
    };

    // Add search filter if provided
    if (search) {
      whereClause.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // Get total count for pagination
    const totalCount = await prisma.project.count({
      where: whereClause,
    });

    // Determine sort order
    const orderByClause = {};
    orderByClause[sortBy] = order;

    // Get paginated projects with optimized data fetching
    const publicProjects = await prisma.project.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        emoji: true,
        shared: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        projectTags: {
          select: {
            id: true,
            name: true,
            color: true,
            emoji: true,
          },
          take: 3, // Only get the first 3 tags for display
        },
        _count: {
          select: {
            collaborators: true,
          }
        }
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    });

    // Transform the response to match the expected format
    const transformedProjects = publicProjects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      emoji: project.emoji,
      shared: project.shared,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      owner: project.user,
      projectTags: project.projectTags,
      collaboratorCount: project._count.collaborators,
      isOwner: project.user.id === session.user.id
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching public projects:", {
      error: error.message,
      stack: error.stack,
      userId: session?.user?.id || 'not authenticated'
    });
    return NextResponse.json(
      { error: "Failed to fetch public projects", details: error.message },
      { status: 500 }
    );
  }
}
