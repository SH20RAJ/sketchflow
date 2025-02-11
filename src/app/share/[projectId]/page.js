"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Editor from "@/components/editor/Editor";
import { LoadingPage } from "@/components/ui/loading";

export default function ProjectPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/shared/${params.projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      setProjectData(data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  }, [params.projectId, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && params.projectId) {
      fetchProject();
    }
  }, [status, params.projectId, fetchProject, router]);

  if (status === "loading" || loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!projectData) {
    return null;
  }

  return <Editor projectId={params.projectId} initialData={projectData} />;
}
