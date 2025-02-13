import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the original project
    const originalProject = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      include: {
        diagrams: true,
        markdowns: true,
      },
    });

    if (!originalProject) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Check if project is shared or owned by the user
    if (!originalProject.shared && originalProject.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create new project with cloned data
    const clonedProject = await prisma.project.create({
      data: {
        name: `${originalProject.name} (Clone)`,
        description: originalProject.description,
        userId: session.user.id,
        diagrams: {
          create: originalProject.diagrams.map(diagram => ({
            name: diagram.name,
            content: diagram.content
          }))
        },
        markdowns: {
          create: originalProject.markdowns.map(markdown => ({
            name: markdown.name,
            content: markdown.content
          }))
        }
      },
      include: {
        diagrams: true,
        markdowns: true,
      }
    });

    return NextResponse.json(clonedProject);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 