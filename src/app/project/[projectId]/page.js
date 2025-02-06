'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Editor from '@/components/editor/Editor';

export default function ProjectPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProjectData(data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && params.projectId) {
      fetchProject();
    }
  }, [params.projectId, router, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!projectData) {
    return null;
  }

  return (
    <Editor
      projectId={params.projectId}
      initialData={{
        markdown: projectData.markdown?.content || '',
        excalidraw: projectData.diagram?.content || { elements: [], appState: {} },
      }}
    />
  );
}
