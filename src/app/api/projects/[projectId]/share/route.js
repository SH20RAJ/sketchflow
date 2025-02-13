import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { shared } = body;

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return new NextResponse("Project not found or unauthorized", { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.projectId },
      data: { shared },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 