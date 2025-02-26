'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Layout,
  Search,
  Share2,
  GitFork,
  Eye,
  EyeOff,
  Trash2,
  Users,
  Clock,
  ExternalLink,
  Loader2,
  Lock,
  Globe,
  Pencil
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from 'next/link';

export default function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${selectedProject.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete project');
      
      toast.success('Project deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const toggleVisibility = async (project) => {
    try {
      const response = await fetch(`/api/admin/projects/${project.id}/toggle-visibility`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to update visibility');
      
      toast.success(`Project is now ${project.shared ? 'private' : 'public'}`);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisibility = 
      visibilityFilter === 'all' || 
      (visibilityFilter === 'public' && project.shared) ||
      (visibilityFilter === 'private' && !project.shared);

    return matchesSearch && matchesVisibility;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <div className="flex gap-4">
          <Select
            value={visibilityFilter}
            onValueChange={setVisibilityFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="public">Public Only</SelectItem>
              <SelectItem value="private">Private Only</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
            icon={Search}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {project.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVisibility(project)}
                  className={project.shared ? 'text-green-600' : 'text-gray-600'}
                >
                  {project.shared ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description || 'No description provided'}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <GitFork className="h-4 w-4 mr-1" />
                  {project.cloneCount || 0} clones
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {project.user?.image ? (
                    <img src={project.user.image} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <Users className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{project.user?.name}</div>
                  <div className="text-gray-500">{project.user?.email}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(project)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/project/${project.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(project)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Detailed information about the project.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project ID</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedProject.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Visibility</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedProject.shared ? 'Public' : 'Private'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(selectedProject.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(selectedProject.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedProject.user?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner Email</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedProject.user?.email}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedProject.description || 'No description provided'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  asChild
                >
                  <Link href={`/project/${selectedProject.id}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Project
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 