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
import { Plus, Loader2, Trash, FolderOpen, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectSearch } from "@/components/projects/ProjectSearch";
import { ProjectPagination } from "@/components/projects/ProjectPagination";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { redirect } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// Skeleton loader for project cards
function ProjectCardSkeleton({ count = 6 }) {
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-gray-300 h-[200px] animate-pulse flex flex-col"
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between mb-3">
            <div className="h-5 bg-gray-200 rounded w-3/5"></div>
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex gap-1.5 mb-3">
            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="flex-1"></div>
        <div className="p-3 border-t border-gray-100 flex justify-between">
          <div className="flex gap-2">
            <div className="h-7 bg-gray-200 rounded w-14"></div>
            <div className="h-7 bg-gray-200 rounded w-14"></div>
          </div>
          <div className="h-7 w-7 bg-gray-200 rounded"></div>
        </div>
      </div>
    ));
}

export default function ProjectsPage({ searchParams }) {
  const router = useRouter();
  const { data: session, status } = useSession({
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
      <div className="container mx-auto px-4 py-0">
        {/* Header skeleton */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 py-4 px-4 -mx-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
              <div className="w-40 h-8 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="sm:hidden w-9 h-9 bg-gray-200 animate-pulse rounded-md"></div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              <div className="w-full sm:w-64 h-10 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="hidden sm:block w-32 h-10 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="w-full h-16 bg-gray-100 animate-pulse rounded-lg mb-6"></div>

        {/* Projects grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ProjectCardSkeleton count={9} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
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
    <div className="container mx-auto px-4 py-0">
      {/* Header with search */}
      <div className="sticky md:w-[calc(100%-132px)] top-0 z-40 bg-white border-b border-gray-100 py-4 px-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
            <h1 className="text-2xl font-bold">My Projects</h1>
            <div className="sm:hidden">
              <Button
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <div className="flex-1 sm:flex-none max-w-md">
              <ProjectSearch projects={projects} />
            </div>

            <div className="hidden sm:block">
              <Button
                className="gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                  <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-gray-500">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/projects/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ProjectFilters />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4 bg-gray-50/80 border border-gray-100 rounded-lg col-span-1 sm:col-span-2 lg:col-span-3">
          <FolderOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Create a new project to get started
          </p>
          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <ProjectPagination pagination={pagination} />
      )}

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
    </div>
  );
}