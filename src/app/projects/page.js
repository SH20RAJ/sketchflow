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
import { Plus, Loader2, Pencil, Trash, FolderOpen, Search, Settings, LogOut } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text mb-2">
            Your Projects
          </h1>
          <p className="text-gray-600">
            {projectCount} / {subscriptionData?.isPro ? "∞" : "100"} projects available
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
              className="pl-10 w-full md:w-64"
            />
          </div>
          <Button 
            onClick={handleCreateProject} 
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
              <DropdownMenuItem>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center p-12 border-2 border-dashed">
              <CardContent className="space-y-4">
                <FolderOpen className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-xl font-medium text-gray-600">
                  Start Your Journey
                </p>
                <p className="text-gray-500 max-w-md mx-auto">
                  Create your first project and begin bringing your ideas to life.
                </p>
                <Button 
                  onClick={handleCreateProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
                >
                  Create your first project
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {filteredProjects.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center p-12">
              <CardContent>
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-xl font-medium text-gray-600 mb-2">
                  No projects found
                </p>
                <p className="text-gray-500">
                  No projects match your search "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {filteredProjects.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={item}>
                <Card
                  className={`group hover:shadow-lg transition-all duration-200 ${
                    project.isOptimistic ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {project.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startTransition(() => router.push(`/project/${project.id}`))}
                          className="h-8 w-8 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteProject(project.id)}
                          className="h-8 w-8 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 flex items-center">
                      Created {format(new Date(project.createdAt), "PPP")}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      onClick={() => startTransition(() => router.push(`/project/${project.id}`))}
                    >
                      Open Project
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
