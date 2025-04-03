import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// DELETE /api/projects/[projectId]/tags/[tagId]
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, tagId } = params;

    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Remove tag from project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        projectTags: {
          disconnect: { id: tagId }
        }
      },
      include: {
        projectTags: {
          select: {
            id: true,
            name: true,
            emoji: true,
            color: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, tags: updatedProject.projectTags });
  } catch (error) {
    console.error('Error removing tag from project:', error);
    return NextResponse.json({ error: 'Failed to remove tag from project' }, { status: 500 });
  }
}
