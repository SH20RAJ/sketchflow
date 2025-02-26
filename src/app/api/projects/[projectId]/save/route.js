import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { excalidraw, markdown, name, description } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let existingDiagram = project.diagrams[0];

    existingDiagram.content.appState.collaborators = [];
    // console.log(
    //   existingDiagram,
    //   "ff",
    //   existingDiagram.content.appState.collaborators
    // );
    

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
        data: { name , description },
      });

      return NextResponse.json({
        success: true,
        project: updatedProject,
        diagram,
        markdown: markdown_doc,
      });
    } catch (err) {
      console.error("Database operation failed:", err);
      return NextResponse.json(
        { error: err.message || "Failed to save project" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
