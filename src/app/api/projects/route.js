import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      userId: session.user.id,
      ...(tagId && tagId !== 'all' && {
        projectTags: {
          some: { id: tagId }
        }
      }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      })
    };

    // Get total count for pagination
    const totalCount = await prisma.project.count({ where });

    // Get projects with only necessary data
    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        [sortBy]: order
      },
      include: {
        projectTags: {
          select: {
            id: true,
            name: true,
            emoji: true,
            color: true
          }
        }
      },
      skip,
      take: limit
    });

    return NextResponse.json({
      projects,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const projectCount = await prisma.project.count({
      where: { userId: user.id },
    });

    // Check project limit for free users
    if (projectCount >= 100 && !user.subscription) {
      return NextResponse.json({ error: "Project limit reached" }, { status: 403 });
    }

    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        name: body.name || "Untitled Project",
        description: body.description,
        emoji: body.emoji,
        color: body.color,
        userId: user.id,
        projectTags: body.tagIds ? {
          connect: body.tagIds.map(id => ({ id }))
        } : undefined,
        diagrams: {
          create: {
            name: "Main",
            content: { elements: [], appState: {} },
          },
        },
      },
      include: {
        diagrams: true,
        projectTags: true
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
