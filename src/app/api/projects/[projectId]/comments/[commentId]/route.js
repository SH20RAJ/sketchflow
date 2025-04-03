import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Update a comment
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, commentId } = params;
    const { content, resolved } = await request.json();

    // Check if comment exists and belongs to the user
    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      include: { project: true }
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.projectId !== projectId) {
      return NextResponse.json({ error: "Comment does not belong to this project" }, { status: 400 });
    }

    // Check if user is the comment owner or project owner
    const isCommentOwner = comment.userId === session.user.id;
    const isProjectOwner = comment.project.userId === session.user.id;

    // For resolving comments, also allow project collaborators with editor role
    let canResolve = isCommentOwner || isProjectOwner;

    if (resolved !== undefined && !canResolve) {
      const collaborator = await prisma.projectCollaborator.findFirst({
        where: {
          projectId,
          userId: session.user.id,
          inviteStatus: "ACCEPTED",
          role: "EDITOR"
        }
      });
      canResolve = !!collaborator;
    }

    // For editing content, only allow the comment owner
    if (content !== undefined && !isCommentOwner) {
      return NextResponse.json({ error: "Only the comment author can edit the content" }, { status: 403 });
    }

    if (resolved !== undefined && !canResolve) {
      return NextResponse.json({ error: "Not authorized to resolve this comment" }, { status: 403 });
    }

    // Update the comment
    const updatedComment = await prisma.projectComment.update({
      where: { id: commentId },
      data: {
        ...(content !== undefined && { content }),
        ...(resolved !== undefined && { resolved })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Log the activity
    if (resolved === true) {
      await prisma.collaborationActivity.create({
        data: {
          projectId,
          userId: session.user.id,
          action: "resolved_comment",
          details: {
            commentId,
            comment: comment.content.substring(0, 100)
          }
        }
      });
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

// Delete a comment
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, commentId } = params;

    // Check if comment exists
    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      include: { project: true }
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.projectId !== projectId) {
      return NextResponse.json({ error: "Comment does not belong to this project" }, { status: 400 });
    }

    // Check if user is the comment owner or project owner
    const isCommentOwner = comment.userId === session.user.id;
    const isProjectOwner = comment.project.userId === session.user.id;

    if (!isCommentOwner && !isProjectOwner) {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 });
    }

    // Delete the comment
    await prisma.projectComment.delete({
      where: { id: commentId }
    });

    // Log the activity
    await prisma.collaborationActivity.create({
      data: {
        projectId,
        userId: session.user.id,
        action: "deleted_comment",
        details: {
          commentId,
          comment: comment.content.substring(0, 100)
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
