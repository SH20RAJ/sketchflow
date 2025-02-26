'use client';

import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { toast } from 'sonner';

export default function NewArticlePage() {
  const router = useRouter();

  const handleSave = async ({ title, content }) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt: content.substring(0, 200) + '...',
          published: false
        })
      });

      if (!response.ok) throw new Error('Failed to create article');

      const article = await response.json();
      toast.success('Article saved successfully');
      router.push(`/articles/${article.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save article');
    }
  };

  const handlePublish = async ({ title, content }) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt: content.substring(0, 200) + '...',
          published: true
        })
      });

      if (!response.ok) throw new Error('Failed to publish article');

      const article = await response.json();
      toast.success('Article published successfully');
      router.push(`/articles/${article.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to publish article');
    }
  };

  return (
    <div className="h-screen">
      <ArticleEditor
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </div>
  );
}