'use client';

import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function NewArticlePage() {
  const router = useRouter();

  const handleSave = async ({ title, content }) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          status: 'draft',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      const data = await response.json();
      toast.success('Article saved successfully');
      return data;
    } catch (error) {
      toast.error('Failed to save article');
      throw error;
    }
  };

  const handlePublish = async ({ title, content }) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          status: 'published',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish article');
      }

      const data = await response.json();
      toast.success('Article published successfully');
      router.push(`/articles/${data.id}`);
      return data;
    } catch (error) {
      toast.error('Failed to publish article');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ArticleEditor
          onSave={handleSave}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}