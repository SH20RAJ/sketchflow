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
      <div className="flex flex-wrap gap-2">
        {selectedProjects.map((project) => (
          <Badge
            key={project.id}
            variant="secondary"
            style={{
              backgroundColor: project.color ? `${project.color}15` : '#E5E7EB15',
              color: project.color || '#374151',
              borderColor: project.color ? `${project.color}30` : '#E5E7EB30'
            }}
            className="group hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {project.emoji && <span className="mr-1 opacity-90">{project.emoji}</span>}
            {project.name}
            <button
              onClick={() => handleRemoveProject(project.id)}
              className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-200"
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery && filteredProjects.length > 0 && (
          <div className="p-2 border rounded-lg max-h-48 overflow-y-auto space-y-1">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleAddProject(project)}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200"
                disabled={isLoading}
              >
                {project.emoji ? (
                  <span>{project.emoji}</span>
                ) : (
                  <FolderOpen className="h-4 w-4 text-gray-400" />
                )}
                <span className="flex-1">{project.name}</span>
                <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {searchQuery && filteredProjects.length === 0 && (
          <div className="p-4 border rounded-lg text-center text-gray-500">
            No matching projects found
          </div>
        )}
      </div>
    </div>
  );
}
