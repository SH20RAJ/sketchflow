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
import { Plus, Loader2, Pencil, Trash } from "lucide-react";
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
const fetcher = (...args) => fetch(...args).then((res) => res.json());


export default function ProjectsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);

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
          projects: [optimisticProject, ...prevData.projects],
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

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") return "";

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto p-8">
        <title>Projects</title>
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Projects</h1>
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

  return (
    <div className="container mx-auto p-8">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">
            {projectCount} / {subscriptionData?.isPro ? "∞" : "100"} projects
          </p>
          <Button onClick={handleCreateProject} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isCreating ? "Creating..." : "New Project"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={session?.user?.image}
                  alt={session?.user?.name}
                />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

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
