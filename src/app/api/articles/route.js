import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      title, 
      content, 
      published = false,
      coverImage,
      seoTitle,
      seoDesc,
      tags = []
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Calculate reading time (assuming average reading speed of 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const article = await prisma.article.create({
      data: {
        title,
        content,
        excerpt: content.substring(0, 200) + '...',
        slug,
        coverImage,
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || content.substring(0, 160),
        readingTime,
        published,
        user: {
          connect: {
            id: session.user.id
          }
        },
        tags: {
          connectOrCreate: []
        }
      },
      include: {
        tags: true
      }
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        tags: true,
        user: {
          select: {
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            comments: true,
            claps: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}