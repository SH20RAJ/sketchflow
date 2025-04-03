import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/projects/tags/counts
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all tags for the user
    const tags = await prisma.projectTag.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        _count: {
          select: {
            projects: true
          }
        }
      }
    });

    // Transform the data into a more convenient format
    const counts = {};
    tags.forEach(tag => {
      counts[tag.id] = tag._count.projects;
    });

    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Error fetching tag project counts:', error);
    return NextResponse.json({ error: 'Failed to fetch tag project counts' }, { status: 500 });
  }
}
