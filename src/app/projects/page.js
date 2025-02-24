"use client";

import { useState, useTransition, Suspense } from "react";
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
import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { redirect } from "next/navigation";

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

export default function ProjectsPage({ searchParams }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const { tagId, sortBy = 'updatedAt', order = 'desc' } = searchParams || {};
  
  const { data, error, isLoading } = useSWR(
    `/api/projects?${new URLSearchParams({
      tagId: tagId || '',
      sortBy,
      order,
    })}`,
    fetcher
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
        </div>
        <ProjectFilters />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <ProjectCardSkeleton count={6} />
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Link href="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <ProjectFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="text-gray-600">
            Create a new project to get started
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectCardSkeleton({ count = 6 }) {
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
      >
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    ));
}
