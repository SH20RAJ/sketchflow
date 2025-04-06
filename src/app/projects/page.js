"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, FolderOpen } from "lucide-react";
import { PremiumLoader, PremiumCardSkeleton, PremiumEmptyState } from "@/components/ui/premium-loader";
import { toast } from "react-hot-toast";
import { ProjectCard } from "@/components/projects/ProjectCard";
// ProjectFilters is now in the header component
// ProjectSearch is now in the header component
import { ProjectPagination } from "@/components/projects/ProjectPagination";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { CollaboratedProjects } from "@/components/projects/CollaboratedProjects";
import { redirect } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// Using the premium loader component instead of the basic skeleton

export default function ProjectsPage({ searchParams }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isPending, startTransition] = useTransition();

  // Set page title
  useEffect(() => {
    document.title = 'My Projects | SketchFlow';

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'SketchFlow';
    };
  }, []);

  const { tagId, sortBy = 'updatedAt', order = 'desc', search, page = '1' } = searchParams || {};

  const { data, error, isLoading } = useSWR(
    `/api/projects?${new URLSearchParams({
      tagId: tagId || '',
      sortBy,
      order,
      search: search || '',
      page
    })}`,
    fetcher
  );

  if (status === "loading" || isLoading) {
    return (
      <>
        {/* Premium branded loading experience */}
        {/* <div className="mb-8">
          <PremiumLoader message="Loading your projects..." />
        </div> */}

        {/* Projects grid skeleton with premium styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <PremiumCardSkeleton count={9} showBranding={true} />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Error loading projects</h3>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  const projects = data?.projects || [];
  const pagination = data?.pagination;

  const handleDeleteProject = async (project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/projects/${projectToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        toast.success('Project deleted successfully');
        router.refresh();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete project');
      } finally {
        setProjectToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <>
      {/* Project Filters moved to header */}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      {/* Premium Empty State */}
      {projects.length === 0 && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <PremiumEmptyState
            message="No projects found"
            icon={<FolderOpen className="h-8 w-8 text-blue-500" />}
            actionLabel="Create New Project"
            onAction={() => setIsCreateDialogOpen(true)}
          />
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <ProjectPagination pagination={pagination} />
      )}

      {/* Collaborated Projects Section */}
      <CollaboratedProjects searchQuery={search || ''} />

      {/* Delete Project Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project
              and remove all of its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Project'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}