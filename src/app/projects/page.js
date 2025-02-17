"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { Plus, Loader2, Pencil, Trash, FolderOpen, Search, Settings, LogOut, PlusCircle, Clock, Users } from "lucide-react";
import { format } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MotionGrid, MotionGridItem, MotionFadeIn, AnimatePresence } from "@/components/ui/motion-project";
import { toast } from "react-hot-toast";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function ProjectsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: projectsData,
    error: projectsError,
    mutate: mutateProjects,
  } = useSWR(status === "authenticated" ? "/api/projects" : null, fetcher);

  const { data: subscriptionData, error: subscriptionError } = useSWR(
    status === "authenticated" ? "/api/subscription" : null,
    fetcher
  );

  const isLoading =
    (!projectsData && !projectsError) ||
    (!subscriptionData && !subscriptionError);

  const handleCreateProject = async () => {
    if (projectsData?.count >= 100 && !subscriptionData?.isPro) {
      router.push("/pricing");
      return;
    }

    setIsCreating(true);
    try {
      const optimisticProject = {
        id: "temp-" + Date.now(),
        name: "New Project",
        description: "",
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };
      mutateProjects(
        (prevData) => ({
          ...prevData,
          projects: [optimisticProject, ...prevData?.projects],
          count: prevData.count + 1,
        }),
        false
      );

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Project", description: "" }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      mutateProjects();
      router.push(`/project/${newProject.id}`);
    } catch (error) {
      console.error("Error:", error);
      mutateProjects();
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      mutateProjects(
        (prevData) => ({
          ...prevData,
          projects: prevData.projects.filter((p) => p.id !== projectId),
          count: prevData.count - 1,
        }),
        false
      );

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      mutateProjects();
    } catch (error) {
      console.error("Error:", error);
      mutateProjects();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      mutateProjects(
        (prevData) => ({
          ...prevData,
          projects: prevData.projects.filter((p) => p.id !== projectToDelete.id),
          count: prevData.count - 1,
        }),
        false
      );

      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete project");
      
      toast.success("Project deleted successfully");
      await mutateProjects();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete project");
      await mutateProjects();
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") return "";

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <title>Projects</title>
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Your Projects</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Loading...</p>
            <Button disabled className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          </div>
        </nav>
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

  const projects = projectsData?.projects || [];
  const projectCount = projectsData?.count || 0;
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 pt-16 md:pt-8">
      <nav className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              Projects
              {subscriptionData?.isPro && (
                <span className="ml-3 text-sm font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600/10 to-blue-400/10 text-blue-600 border border-blue-200 inline-flex items-center gap-1.5 align-middle">
                  <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                  Pro
                </span>
              )}
            </h1>
          </div>
          <Separator className="my-4" />
          <p className="text-gray-600">
            {subscriptionData?.isPro ? 'Unlimited projects with Pro' : 'Create and manage your projects'}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-64 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>
          <Button 
            onClick={handleCreateProject} 
            disabled={isCreating}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isCreating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isCreating ? "Creating..." : "New Project"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                <Avatar>
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                  <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium leading-none">{session?.user?.name}</p>
                  <p className="text-sm leading-none text-gray-500">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/projects/settings')}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <AnimatePresence>
        {filteredProjects.length === 0 && !searchQuery && (
          <MotionFadeIn>
            <Card className="text-center p-12 border-2 border-dashed bg-white/50 backdrop-blur-sm">
              <CardContent className="space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
                  <FolderOpen className="relative h-16 w-16 mx-auto text-blue-500" />
                </div>
                <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  Start Your Journey
                </p>
                <p className="text-gray-500 max-w-md mx-auto">
                  Create your first project and begin bringing your ideas to life.
                </p>
                <Button 
                  onClick={handleCreateProject}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white mt-4 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Create your first project
                </Button>
              </CardContent>
            </Card>
          </MotionFadeIn>
        )}

        {filteredProjects.length === 0 && searchQuery && (
          <MotionFadeIn>
            <Card className="text-center p-12 bg-white/50 backdrop-blur-sm">
              <CardContent>
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-lg" />
                  <Search className="relative h-16 w-16 mx-auto text-gray-400" />
                </div>
                <p className="text-2xl font-semibold bg-gradient-to-r from-gray-700 to-gray-500 text-transparent bg-clip-text mb-2">
                  No projects found
                </p>
                <p className="text-gray-500">
                  No projects match your search "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          </MotionFadeIn>
        )}

        {filteredProjects.length > 0 && (
          <MotionGrid>
            {filteredProjects.map((project) => (
              <MotionGridItem key={project.id}>
                <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-gray-200/50">
                  {subscriptionData?.isPro && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-blue-600/10 to-blue-400/10 text-blue-600 border border-blue-200 inline-flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Pro
                      </span>
                    </div>
                  )}
                  <CardHeader className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-gray-500">
                      {project.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {format(new Date(project.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {project.collaborators?.length || 0} members
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      onClick={() => startTransition(() => router.push(`/project/${project.id}`))}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
                      onClick={() => setProjectToDelete(project)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </MotionGridItem>
            ))}
          </MotionGrid>
        )}
      </AnimatePresence>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{projectToDelete?.name}" and all of its contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Project
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
