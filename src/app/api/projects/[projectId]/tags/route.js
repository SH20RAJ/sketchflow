import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST /api/projects/[projectId]/tags
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = params;
    const { tagId } = await request.json();

    if (!tagId) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

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

    // Add tag to project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        projectTags: {
          connect: { id: tagId }
        }
      },
      include: {
        projectTags: true
      }
    });

    return NextResponse.json(updatedProject.projectTags);
  } catch (error) {
    console.error('Error adding tag to project:', error);
    return NextResponse.json({ error: 'Failed to add tag to project' }, { status: 500 });
  }
}

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
        projectTags: true
      }
    });

    return NextResponse.json(updatedProject.projectTags);
  } catch (error) {
    console.error('Error removing tag from project:', error);
    return NextResponse.json({ error: 'Failed to remove tag from project' }, { status: 500 });
  }
}