 "use client";

import { useState, useCallback, useEffect } from "react";
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
import { Pencil, Search, Clock, Users, GitFork, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

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

const MotionCard = motion(Card);

export default function SharedProjectsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCloning, setIsCloning] = useState(false);

  const {
    data: sharedProjectsData,
    error: sharedProjectsError,
    mutate: mutateProjects,
  } = useSWR(
    status === "authenticated" ? "/api/projects/shared" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 5000,
    }
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleCloneProject = useCallback(async (projectId) => {
    setIsCloning(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/clone`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.status === 401) {
        setIsCloning(false);
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clone project');
      }

      toast.success(data.message || 'Project cloned successfully');

      if (data.id) {
        router.push(`/project/${data.id}`);
      }
    } catch (error) {
      console.error('Clone error:', error);
      toast.error(error.message || 'Failed to clone project');
    } finally {
      setIsCloning(false);
    }
  }, [router]);

  if (status === "loading" || !sharedProjectsData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <title>Shared Projects</title>
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Shared Projects</h1>
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

  const projects = sharedProjectsData?.projects || [];
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
              Shared Projects
            </h1>
          </div>
          <Separator className="my-4" />
          <p className="text-gray-600">
            Projects shared with you by other users
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search shared projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-64 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {filteredProjects.length === 0 && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center p-12 border-2 border-dashed bg-white/50 backdrop-blur-sm">
              <CardContent className="space-y-4">
                <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  No Shared Projects Yet
                </p>
                <p className="text-gray-500 max-w-md mx-auto">
                  When other users share their projects with you, they'll appear here.
                </p>
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
                  No shared projects match your search "{searchQuery}"
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
                <MotionCard className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-gray-200/50">
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
                        Shared by {project.owner?.name || "Unknown"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      onClick={() => router.push(`/project/${project.id}`)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                      onClick={() => handleCloneProject(project.id)}
                      disabled={isCloning}
                    >
                      <GitFork className="h-4 w-4 mr-1" />
                      {isCloning ? "Cloning..." : "Clone"}
                    </Button>
                  </CardFooter>
                </MotionCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}