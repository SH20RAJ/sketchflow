import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    console.log('Access check - Session:', { 
      userId: session?.user?.id,
      email: session?.user?.email 
    });
    console.log('Access check - Project ID:', params.projectId);
    
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      select: {
        id: true,
        userId: true,
        shared: true,
      },
    });

    console.log('Access check - Project found:', project);

    if (!project) {
      console.log('Access check - Project not found');
      return NextResponse.json({ 
        hasAccess: false, 
        isShared: false,
        error: "Project not found" 
      }, { status: 404 });
    }

    // Check if user has access
    const hasAccess = session?.user?.id === project.userId;
    const isShared = project.shared;

    console.log('Access check - Result:', { hasAccess, isShared });

    return NextResponse.json({
      hasAccess,
      isShared,
      projectId: project.id,
      userId: project.userId,
      sessionUserId: session?.user?.id
    });
  } catch (error) {
    console.error("Access check error:", {
      error: error.message,
      stack: error.stack,
      projectId: params.projectId,
      userId: session?.user?.id
    });
    return NextResponse.json({ 
      hasAccess: false, 
      isShared: false,
      error: "Failed to check access",
      details: error.message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 