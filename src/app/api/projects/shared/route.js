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

    // Build the where clause
    const whereClause = {
      AND: [
        { shared: true },
        // { userId: { not: session.user.id } }, // Exclude user's own projects
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

    // Get paginated projects
    const sharedProjects = await prisma.project.findMany({
      where: whereClause,
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
      skip,
      take: limit,
    });

    // Transform the response to match the expected format
    const transformedProjects = sharedProjects.map(project => ({
      ...project,
      owner: project.user, // Map user to owner for frontend consistency
      user: undefined, // Remove the user field to avoid duplication
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
    console.error("Error fetching shared projects:", {
      error: error.message,
      stack: error.stack,
      userId: session?.user?.id || 'not authenticated'
    });
    return NextResponse.json(
      { error: "Failed to fetch shared projects", details: error.message },
      { status: 500 }
    );
  }
}