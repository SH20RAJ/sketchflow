import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

// Get a specific tag
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tagId } = params;

    const tag = await prisma.projectTag.findFirst({
      where: {
        id: tagId,
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        projects: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 });
  }
}

// Update a tag
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tagId } = params;
    const body = await request.json();
    const { name, emoji, color } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    // Check if tag exists and belongs to user
    const existingTag = await prisma.projectTag.findFirst({
      where: {
        id: tagId,
        userId: session.user.id
      }
    });

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Check if another tag with the same name exists for this user
    const duplicateTag = await prisma.projectTag.findFirst({
      where: {
        name: name.trim(),
        userId: session.user.id,
        id: { not: tagId } // Exclude the current tag
      }
    });

    if (duplicateTag) {
      return NextResponse.json({ error: "Another tag with this name already exists" }, { status: 400 });
    }

    // Update the tag
    const updatedTag = await prisma.projectTag.update({
      where: {
        id: tagId
      },
      data: {
        name: name.trim(),
        emoji,
        color
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true
      }
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

// Delete a tag
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tagId } = params;

    // Check if tag exists and belongs to user
    const existingTag = await prisma.projectTag.findFirst({
      where: {
        id: tagId,
        userId: session.user.id
      }
    });

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Delete the tag
    await prisma.projectTag.delete({
      where: {
        id: tagId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}