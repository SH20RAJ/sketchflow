import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    console.log('Project fetch - Session:', { 
      userId: session?.user?.id,
      email: session?.user?.email 
    });
    console.log('Project fetch - Project ID:', params.projectId);

    // First find the project
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      include: {
        diagrams: true,
        markdowns: true,
      },
    });

    console.log('Project fetch - Project found:', { 
      id: project?.id, 
      userId: project?.userId,
      shared: project?.shared 
    });

    if (!project) {
      console.log('Project fetch - Project not found');
      return new NextResponse("Project not found", { status: 404 });
    }

    // Check access
    const isOwner = session?.user?.id === project.userId;
    const hasAccess = isOwner || project.shared;

    console.log('Project fetch - Access check:', { isOwner, hasAccess });

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the main diagram and markdown
    let mainDiagram = project.diagrams[0];
    let mainMarkdown = project.markdowns[0];

    if (mainDiagram?.content?.appState) {
      mainDiagram.content.appState.collaborators = [];
    }

    const response = {
      ...project,
      markdown: mainMarkdown,
      diagram: mainDiagram,
      isOwner,
    };

    console.log('Project fetch - Success');
    return NextResponse.json(response);
  } catch (error) {
    console.error("Project fetch error:", {
      error: error.message,
      stack: error.stack,
      projectId: params.projectId
    });
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
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
    console.error("Project delete error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
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
    console.error("Project update error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
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
    console.error("Project save error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
