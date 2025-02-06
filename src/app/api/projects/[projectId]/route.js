import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.projectId,
        userId: user.id,
      },
      include: {
        diagrams: true,
      },
    });

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const mainDiagram = project.diagrams[0];
    return NextResponse.json({
      ...project,
      excalidraw: mainDiagram.content,
      markdown: mainDiagram.content.markdown || '',
    });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.projectId,
        userId: user.id,
      },
      include: {
        diagrams: true,
      },
    });

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const body = await request.json();
    const mainDiagram = project.diagrams[0];

    await prisma.diagram.update({
      where: { id: mainDiagram.id },
      data: {
        content: {
          ...mainDiagram.content,
          ...body,
        },
      },
    });

    return new NextResponse('OK');
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
