"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewProjectPage() {
  const router = useRouter();

  useEffect(() => {
    const createProject = async () => {
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "New Project", description: "" }),
        });

        if (!response.ok) throw new Error("Failed to create project");

        const newProject = await response.json();
        router.push(`/project/${newProject.id}`);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to create project");
        router.push("/projects");
      }
    };

    createProject();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
          <div className="relative h-16 w-16 mx-auto rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Creating your project...</h2>
        <p className="text-gray-500 mt-2">You'll be redirected automatically</p>
      </div>
    </div>
  );
}