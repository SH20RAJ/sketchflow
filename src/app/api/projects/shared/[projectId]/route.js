import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      include: {
        diagrams: true,
        markdowns: true,
      },
    });

    if(!project.shared) {
      return new NextResponse("Project not found", { status: 404 });
    }

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Get the main diagram and markdown
    let mainDiagram = project.diagrams[0];
    let mainMarkdown = project.markdowns[0];

    mainDiagram.content.appState.collaborators = [];

    return NextResponse.json({
      markdown: mainMarkdown,
      diagram: mainDiagram,
      ...project,
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

