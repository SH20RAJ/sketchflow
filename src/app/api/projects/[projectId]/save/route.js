import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { excalidraw, markdown, name } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
      include: {
        diagrams: true,
        markdowns: true,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    let existingDiagram = project.diagrams[0];

    existingDiagram.content.appState.collaborators = [];
    console.log(
      existingDiagram,
      "ff",
      existingDiagram.content.appState.collaborators
    );
    

    let existingMarkdown = project.markdowns[0];

    try {
      const diagram = await prisma.diagram.upsert({
        where: {
          id: existingDiagram?.id ?? "new",
        },
        create: {
          content: excalidraw,
          projectId: params.projectId,
          name: name,
        },
        update: {
          content: excalidraw,
          name: name,
        },
      });

      const markdown_doc = await prisma.markdown.upsert({
        where: {
          id: existingMarkdown?.id ?? "new",
        },
        create: {
          content: markdown,
          projectId: params.projectId,
          name: "Notes",
        },
        update: {
          content: markdown,
          name: "Notes",
        },
      });

      const updatedProject = await prisma.project.update({
        where: { id: params.projectId },
        data: { name },
      });

      return NextResponse.json({
        success: true,
        project: updatedProject,
        diagram,
        markdown: markdown_doc,
      });
    } catch (err) {
      console.error("Database operation failed:", err);
      return new NextResponse(err.message || "Failed to save project", {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Save error:", error);
    return new NextResponse(error.message || "Internal Server Error", {
      status: 500,
    });
  }
}
