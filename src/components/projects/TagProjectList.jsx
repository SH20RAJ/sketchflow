'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, FolderOpen, ExternalLink, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function TagProjectList({ tagId }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, error, mutate, isLoading } = useSWR(
    tagId ? `/api/projects/tags/${tagId}/projects` : null,
    fetcher
  );

  const projects = data?.projects || [];

  const handleRemoveProject = async (projectId) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove project from tag');
      }

      await mutate();
      toast.success('Project removed from tag');
    } catch (error) {
      console.error('Error removing project from tag:', error);
      toast.error(error.message || 'Failed to remove project from tag');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-700">Loading Projects...</h3>
        <p className="text-gray-500">Please wait while we fetch the projects for this tag.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load projects. Please try again later.</span>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
        <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Projects Found</h3>
        <p className="text-gray-500 mb-4">This tag doesn't have any projects associated with it yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="group hover:shadow-md transition-all duration-200"
          style={{
            backgroundColor: project.color ? `${project.color}10` : '#F3F4F6',
            borderColor: project.color ? `${project.color}30` : '#E5E7EB'
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {project.emoji ? (
                  <span className="text-xl">{project.emoji}</span>
                ) : (
                  <FolderOpen
                    className="h-5 w-5"
                    style={{ color: project.color || '#374151' }}
                  />
                )}
                <CardTitle className="text-lg">
                  {project.name}
                </CardTitle>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.push(`/project/${project.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleRemoveProject(project.id)}
                  disabled={isProcessing}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {project.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {project.projectTags && project.projectTags
                .filter(tag => tag.id !== tagId)
                .map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    style={{
                      backgroundColor: `${tag.color}15` || '#E5E7EB15',
                      color: tag.color || '#374151',
                      borderColor: `${tag.color}30` || '#E5E7EB30'
                    }}
                    className="hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full"
                    onClick={() => router.push(`/projects/tag-manage?tagId=${tag.id}`)}
                  >
                    {tag.emoji && <span className="mr-1 opacity-90">{tag.emoji}</span>}
                    {tag.name}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
