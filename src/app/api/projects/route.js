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

    // Build where clause for filtering
    const where = {
      userId: session.user.id,
      ...(tagId && tagId !== 'all' && {
        projectTags: {
          some: { id: tagId }
        }
      })
    };

    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        [sortBy]: order
      },
      include: {
        diagrams: true,
        markdowns: true,
        projectTags: true
      }
    });

    return NextResponse.json({
      projects,
      count: projects.length,
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
