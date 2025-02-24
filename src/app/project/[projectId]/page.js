'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Editor from '@/components/editor/Editor';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Copy, Lock, Globe, Loader2, AlertCircle, Layout, Tag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '@/app/loading';

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
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

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
      {/* Project Switcher */}
      <div className="absolute bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 group relative"
          onClick={() => setShowProjectSwitcher(true)}
        >
          <Layout className="h-4 w-4" />
          Switch Project
          {isShared && (
            <Globe className="h-3.5 w-3.5 text-green-500 absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </Button>

        <Sheet open={showProjectSwitcher} onOpenChange={setShowProjectSwitcher}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Switch Project</SheetTitle>
              <SheetDescription>Select a project to switch to</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {projects.map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className={`w-full justify-start ${project.id === params.projectId ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => {
                    router.push(`/project/${project.id}`);
                    setShowProjectSwitcher(false);
                  }}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  {project.name}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Editor */}
      <div>
        <Editor
          projectId={params.projectId}
          initialData={projectData}
          isOwner={isOwner}
        />
      </div>

      {/* Tag Selector */}
      <div className="absolute bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowTagSelector(true)}
        >
          <Tag className="h-4 w-4" />
          Tags
        </Button>

        <Sheet open={showTagSelector} onOpenChange={setShowTagSelector}>
          <SheetContent side="bottom" className="h-[40vh]">
            <SheetHeader>
              <SheetTitle>Manage Tags</SheetTitle>
              <SheetDescription>Add or remove tags from this project</SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {['UI/UX', 'Frontend', 'Backend', 'Database', 'API'].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
