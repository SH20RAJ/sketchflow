import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    // Delete project and all related data
    await prisma.$transaction([
      // Delete diagrams
      prisma.diagram.deleteMany({
        where: { projectId }
      }),
      // Delete markdowns
      prisma.markdown.deleteMany({
        where: { projectId }
      }),
      // Delete the project itself
      prisma.project.delete({
        where: { id: projectId }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
} 