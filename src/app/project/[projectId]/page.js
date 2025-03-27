'use client';

import { useCallback, useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Loading from '@/app/loading';

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import('@/components/editor/Editor'), {
  ssr: false,
  loading: () => <Loading />
});

// SWR fetcher function
const fetcher = (url) => fetch(url).then(res => res.json());

export default function ProjectPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShared, setIsShared] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [cloning, setCloning] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      setProjectData(data);
      setIsShared(data.shared);
      setIsOwner(session?.user?.id === data.userId);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      if (!error.message.includes('not found')) {
        router.push('/projects');
      }
    } finally {
      setLoading(false);
    }
  }, [params.projectId, router, session?.user?.id]);

  const toggleShare = async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shared: !isShared })
      });

      if (!response.ok) throw new Error('Failed to update sharing settings');
      
      setIsShared(!isShared);
      toast.success(isShared ? 'Project is now private' : 'Project is now shared');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update sharing settings');
    }
  };

  const cloneProject = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setCloning(true);
    try {
      const response = await fetch(`/api/projects/${params.projectId}/clone`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to clone project');
      
      const newProject = await response.json();
      toast.success('Project cloned successfully');
      router.push(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to clone project');
    } finally {
      setCloning(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/project/${params.projectId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };

  useEffect(() => {
    if (status === 'loading') return;

    const checkAccess = async () => {
      try {
        // First check access
        const accessResponse = await fetch(`/api/projects/${params.projectId}/access`);
        const accessData = await accessResponse.json();
        
        console.log('Access check response:', accessData);

        if (!accessData.hasAccess && !accessData.isShared) {
          if (status === 'unauthenticated') {
            toast.error('Please log in to view this project');
            router.push('/login');
          } else {
            toast.error('You do not have access to this project');
            router.push('/projects');
          }
          return;
        }

        // Then fetch project data
        const response = await fetch(`/api/projects/${params.projectId}`);
        if (!response.ok) {
          throw new Error(await response.text() || 'Failed to fetch project');
        }
        const data = await response.json();
        setProjectData(data);
        setIsShared(data.shared);
        setIsOwner(session?.user?.id === data.userId);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [status, params.projectId, router, session?.user?.id]);

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                className="w-full"
                onClick={() => router.push('/projects')}
              >
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!projectData) return null;

  return (
    <div className="relative">
      

      {/* Editor */}
      <div  >
        <Editor
          projectId={params.projectId}
          initialData={projectData}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
