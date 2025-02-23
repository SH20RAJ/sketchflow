import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

// Helper function to check if user is admin
const isAdminUser = (email) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'sh20raj@gmail.com';
  return email === adminEmail;
};

export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    // Get current project
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

    if (!project) {
      return NextResponse.json({ 
        hasAccess: false, 
        isShared: false,
        error: "Project not found" 
      }, { status: 404 });
    }

    // Check if user has access
    const isAdmin = session?.user?.email ? isAdminUser(session.user.email) : false;
    const isOwner = session?.user?.id === project.userId;
    const hasAccess = isOwner || project.shared || isAdmin;

    return NextResponse.json({
      hasAccess,
      isShared: project.shared,
      isOwner,
      isAdmin,
      projectId: project.id,
      userId: project.userId,
      sessionUserId: session?.user?.id
    });
  } catch (error) {
    console.error("Access check error:", {
      error: error.message,
      stack: error.stack,
      projectId: params.projectId
    });
    return NextResponse.json({ 
      hasAccess: false, 
      isShared: false,
      error: "Failed to check access",
      details: error.message
    }, { status: 500 });
  }
} 