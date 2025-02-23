import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all projects with user details
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        diagrams: true,
        markdowns: true
      }
    });

    // Transform the data
    const transformedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      shared: project.shared,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      user: project.user,
      cloneCount: project._count?.clones || 0,
      diagramCount: project.diagrams.length,
      markdownCount: project.markdowns.length
    }));

    return NextResponse.json({
      projects: transformedProjects,
      count: transformedProjects.length
    });
  } catch (error) {
    console.error('Admin projects fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
} 