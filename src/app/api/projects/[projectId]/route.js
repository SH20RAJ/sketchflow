import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
      include: {
        diagrams: true,
        markdowns: true,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Get the main diagram and markdown
    const mainDiagram = project.diagrams[0];
    const mainMarkdown = project.markdowns[0];

    return NextResponse.json({
      ...project,
      diagram: mainDiagram,
      markdown: mainMarkdown,
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedProject = await prisma.project.deleteMany({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
    });

    if (deletedProject.count === 0) {
      return new NextResponse("Project not found or unauthorized", {
        status: 404,
      });
    }

    return new NextResponse("Project deleted", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const updatedProject = await prisma.project.updateMany({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    if (updatedProject.count === 0) {
      return new NextResponse("Project not found or unauthorized", {
        status: 404,
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
      include: {
        diagrams: true,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const body = await request.json();
    const mainDiagram = project.diagrams[0];

    await prisma.diagram.update({
      where: { id: mainDiagram.id },
      data: {
        content: {
          ...mainDiagram.content,
          ...body,
        },
      },
    });

    return new NextResponse("OK");
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
