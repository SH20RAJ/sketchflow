import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    // Get current project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Toggle visibility
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { shared: !project.shared }
    });

    return NextResponse.json({
      success: true,
      shared: updatedProject.shared
    });
  } catch (error) {
    console.error('Toggle project visibility error:', error);
    return NextResponse.json(
      { error: "Failed to toggle project visibility" },
      { status: 500 }
    );
  }
} 