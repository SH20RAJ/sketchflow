'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Loader2, Pencil, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProjectsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const [projectsRes, subscriptionRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/subscription')
        ]);
        
        if (!projectsRes.ok || !subscriptionRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const projectsData = await projectsRes.json();
        const subscriptionData = await subscriptionRes.json();

        setProjects(projectsData.projects);
        setProjectCount(projectsData.count);
        setSubscription(subscriptionData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [router, status]);

  const handleCreateProject = async () => {
    if (projectCount >= 100 && !subscription?.isPro) {
      router.push('/pricing');
      return;
    }

    setIsCreating(true);
    try {
      // Optimistically add a new project
      const optimisticProject = {
        id: 'temp-' + Date.now(),
        name: 'New Project',
        description: '',
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };
      setProjects(prev => [optimisticProject, ...prev]);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Project',
          description: '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();
      
      // Replace optimistic project with real one
      setProjects(prev => 
        prev.map(p => p.id === optimisticProject.id ? newProject : p)
      );

      router.push(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Error:', error);
      // Remove optimistic project on error
      setProjects(prev => prev.filter(p => !p.isOptimistic));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      // Optimistically remove the project
      const deletedProject = projects.find(p => p.id === projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error:', error);
      // Restore the project on error
      setProjects(prev => [...prev, deletedProject]);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto p-8">
        <title>Projects</title>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-gray-600">
            {projectCount} / {subscription?.isPro ? '∞' : '100'} projects used
          </p>
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <p className="text-gray-600">
          {projectCount} / {subscription?.isPro ? "∞" : "100"} projects used
        </p>
        <Button onClick={handleCreateProject} disabled={isCreating}>
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isCreating ? "Creating..." : "New Project"}
        </Button>

        <Avatar>
          <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
          <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent>
            <p className="text-gray-600 mb-4">
              You haven't created any projects yet.
            </p>
            <Button onClick={handleCreateProject}>
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`transition-opacity ${
                project.isOptimistic ? "opacity-50" : "opacity-100"
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        startTransition(() =>
                          router.push(`/project/${project.id}`)
                        )
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Created {format(new Date(project.createdAt), "PP")}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    startTransition(() => router.push(`/project/${project.id}`))
                  }
                >
                  Open Project
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
