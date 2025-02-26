import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await prisma.projectTag.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, emoji, color } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    // Check if tag already exists for this user
    const existingTag = await prisma.projectTag.findFirst({
      where: {
        name: name.trim(),
        userId: session.user.id
      }
    });

    if (existingTag) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 400 });
    }

    const tag = await prisma.projectTag.create({
      data: {
        name: name.trim(),
        emoji,
        color,
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
} 