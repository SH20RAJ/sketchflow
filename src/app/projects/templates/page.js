"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, Sparkles, Lock, Copy, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const templates = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    description: 'Create professional flowcharts and process diagrams',
    category: 'Diagram',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flowchart_symbols.png',
  },
  {
    id: 'mindmap',
    name: 'Mind Map',
    description: 'Organize ideas and concepts visually',
    category: 'Diagram',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flowchart_symbols.png',
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    description: 'Design user interfaces and website layouts',
    category: 'Design',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flowchart_symbols.png',
  },
  {
    id: 'architecture',
    name: 'System Architecture',
    description: 'Document system architecture and components',
    category: 'Technical',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flowchart_symbols.png',
  },
  {
    id: 'gantt',
    name: 'Gantt Chart',
    description: 'Plan and track project timelines',
    category: 'Project Management',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flowchart_symbols.png',
  },
  {
    id: 'erd',
    name: 'Entity Relationship',
    description: 'Design and document database schemas',
    category: 'Technical',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flowchart_symbols.png',
  }
];

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

export default function TemplatesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: subscriptionData, error: subscriptionError } = useSWR(
    status === "authenticated" ? "/api/subscription" : null,
    fetcher
  );

  const isPro = subscriptionData?.isPro;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !subscriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleUseTemplate = (templateId) => {
    if (!isPro) {
      router.push("/subscription?from=templates");
      return;
    }
    // TODO: Implement template usage logic
    console.log('Using template:', templateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 pt-16 md:pt-8">
      <nav className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              Templates
            </h1>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1.5",
              isPro 
                ? "bg-gradient-to-r from-blue-600/10 to-blue-400/10 text-blue-600 border border-blue-200"
                : "bg-gradient-to-r from-gray-600/10 to-gray-400/10 text-gray-600 border border-gray-200"
            )}>
              {isPro ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Pro
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4" />
                  Preview
                </>
              )}
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            {isPro 
              ? "Start your projects faster with professional templates"
              : "Preview our professional templates - Upgrade to Pro to use them"
            }
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </nav>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      >
        {templates.map((template) => (
          <motion.div key={template.id} variants={item}>
            <Card className={cn(
              "group overflow-hidden",
              !isPro && "relative"
            )}>
              {!isPro && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Crown className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                    <h3 className="text-lg font-semibold mb-2">Pro Template</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upgrade to Pro to use this template
                    </p>
                    <Button
                      onClick={() => router.push("/subscription?from=templates")}
                      className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              )}
              <CardHeader className="p-0">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Lock className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {template.category}
                  </span>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  className={cn(
                    "w-full",
                    !isPro && "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {isPro ? "Use Template" : "Preview Template"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 