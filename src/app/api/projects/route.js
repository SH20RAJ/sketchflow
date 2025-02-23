import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // console.log("Session ", session);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: {
          orderBy: { updatedAt: "desc" },
          include: {
            diagrams: true,
            markdowns: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      projects: user.projects,
      count: user.projects.length,
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const projectCount = await prisma.project.count({
      where: { userId: user.id },
    });

    // Check project limit for free users
    if (projectCount >= 100 && !user.subscription) {
      return new NextResponse("Project limit reached", { status: 403 });
    }

    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        name: body.name || "Untitled Project",
        userId: user.id,
        diagrams: {
          create: {
            name: "Main",
            content: { elements: [], appState: {} },
          },
        },
      },
      include: {
        diagrams: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return new NextResponse(error.message || "Internal Server Error", {
      status: 500,
    });
  }
}
