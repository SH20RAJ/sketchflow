import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tagId } = params;

    // Check if tag exists and belongs to user
    const tag = await prisma.projectTag.findFirst({
      where: {
        id: tagId,
        userId: session.user.id
      }
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Get projects associated with this tag
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        projectTags: {
          some: {
            id: tagId
          }
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
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching tag projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
