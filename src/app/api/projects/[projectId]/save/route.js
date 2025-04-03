import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

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

    // First check if user is the project owner
    let project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: user.id,
      },
      include: {
        diagrams: true,
        markdowns: true,
      },
    });

    // If not the owner, check if user is a collaborator with EDITOR role
    if (!project) {
      // Check if project exists
      const projectExists = await prisma.project.findUnique({
        where: {
          id: params.projectId,
        },
        include: {
          diagrams: true,
          markdowns: true,
        },
      });

      if (!projectExists) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      // Check if user is a collaborator with EDITOR role
      const collaborator = await prisma.projectCollaborator.findUnique({
        where: {
          projectId_userId: {
            projectId: params.projectId,
            userId: user.id
          }
        },
        select: {
          role: true,
          inviteStatus: true
        }
      });

      const isEditor = collaborator &&
                      collaborator.inviteStatus === "ACCEPTED" &&
                      collaborator.role === "EDITOR";

      if (!isEditor) {
        return NextResponse.json({ error: "You don't have permission to edit this project" }, { status: 403 });
      }

      // If user is a collaborator with EDITOR role, use the project
      project = projectExists;
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
