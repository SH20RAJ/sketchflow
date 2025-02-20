import { notFound } from 'next/navigation';
import { ArticleEditor } from '@/components/editor/ArticleEditor';

async function getArticle(articleId) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/articles/${articleId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.articleId);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  return {
    title: article.title,
    description: article.excerpt || 'Read this article on SketchFlow',
    openGraph: {
      title: article.title,
      description: article.excerpt || 'Read this article on SketchFlow',
      type: 'article',
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: [article.author?.name].filter(Boolean),
    }
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.articleId);

  if (!article) {
    notFound();
  }

  return (
    <div className="h-screen">
      <ArticleEditor
        initialTitle={article.title}
        initialContent={article.content}
        readOnly={true}
        isPublished={article.published}
      />
    </div>
  );
}