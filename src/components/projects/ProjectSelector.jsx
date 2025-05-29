'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X, FolderOpen } from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'sonner';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ProjectSelector({ tagId, onProjectsChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all projects
  const { data: projectsData } = useSWR('/api/projects?limit=100', fetcher);
  const allProjects = projectsData?.projects || [];

  // Fetch projects already associated with this tag
  const { data: tagProjectsData, mutate: mutateTagProjects } = useSWR(
    tagId ? `/api/projects/tags/${tagId}/projects` : null,
    fetcher
  );
  const tagProjects = tagProjectsData?.projects || [];

  // Initialize selected projects when tag projects load
  useEffect(() => {
    if (tagProjects.length > 0) {
      setSelectedProjects(tagProjects);
    }
  }, [tagProjectsData]);

  // Filter projects based on search query and exclude already selected ones
  const filteredProjects = allProjects
    .filter(project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedProjects.some(sp => sp.id === project.id)
    );

  const handleAddProject = async (project) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add project to tag');
      }

      setSelectedProjects([...selectedProjects, project]);
      await mutateTagProjects();
      if (onProjectsChange) onProjectsChange([...selectedProjects, project]);
      toast.success(`Added "${project.name}" to tag`);
    } catch (error) {
      console.error('Error adding project to tag:', error);
      toast.error(error.message || 'Failed to add project to tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProject = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove project from tag');
      }

      const updatedProjects = selectedProjects.filter(p => p.id !== projectId);
      setSelectedProjects(updatedProjects);
      await mutateTagProjects();
      if (onProjectsChange) onProjectsChange(updatedProjects);
      toast.success('Project removed from tag');
    } catch (error) {
      console.error('Error removing project from tag:', error);
      toast.error(error.message || 'Failed to remove project from tag');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedProjects.map((project) => (
          <Badge
            key={project.id}
            variant="secondary"
            className="pl-3 pr-2 py-1 flex items-center gap-1 text-sm bg-blue-50 text-blue-700 border-blue-200"
          >
            {project.emoji && <span className="mr-1">{project.emoji}</span>}
            {project.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 ml-1 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-full"
              onClick={() => handleRemoveProject(project.id)}
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-gray-300 focus:border-blue-300 focus:ring-blue-100"
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="max-h-80 overflow-auto rounded-lg border divide-y">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleAddProject(project)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gray-50 text-sm">
                  {project.emoji || <FolderOpen className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 truncate">{project.name}</p>
                  {project.description && (
                    <p className="text-xs text-gray-500 truncate">{project.description}</p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-2 border-dashed border-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddProject(project);
                }}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          <FolderOpen className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p>No matching projects found.</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          <FolderOpen className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p>Enter a search term to find projects.</p>
        </div>
      )}
    </div>
  );
}
