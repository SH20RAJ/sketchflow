import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { username } = params;

    // Get user and their public projects
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { name: username }
        ]
      },
      include: {
        subscription: {
          include: {
            plan: true
          }
        },
        projects: {
          where: {
            shared: true
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const stats = {
      totalProjects: await prisma.project.count({
        where: {
          userId: user.id,
          shared: true
        }
      }),
      sharedProjects: user.projects.length,
      clones: await prisma.project.count({
        where: {
          originalProjectId: {
            in: user.projects.map(p => p.id)
          }
        }
      }),
      collaborators: await prisma.projectCollaborator.count({
        where: {
          project: {
            userId: user.id
          }
        },
        distinct: ['userId']
      })
    };

    // Transform the response
    const response = {
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio || null,
        website: user.website || null,
        isPro: user.subscription?.plan?.name === 'Pro' && user.subscription?.status === 'ACTIVE'
      },
      stats,
      projects: user.projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        updatedAt: project.updatedAt,
        clones: project.cloneCount || 0
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Space API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch space data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 