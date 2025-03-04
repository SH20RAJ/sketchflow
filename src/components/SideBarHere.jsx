"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, FolderOpen, Share2, Settings, LogOut, CreditCard, ChevronRight, Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { MotionContainer, MotionProgress } from "@/components/ui/motion-container";
import { useState } from "react";
import { toast } from 'sonner';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MenuItem = ({ href, icon: Icon, children, className, badge }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start group relative",
        "hover:bg-blue-50/50 hover:text-blue-600 transition-all duration-200",
        "border border-transparent",
        isActive && "bg-blue-50 text-blue-600 border-blue-100/50 shadow-sm",
        className
      )}
    >
      <Link href={href} className="flex items-center">
        <Icon className={cn(
          "mr-2 h-4 w-4",
          isActive ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500",
          "transition-colors duration-200"
        )} />
        <span className="flex-1 font-medium">{children}</span>
        {badge}
        {/* <ChevronRight className={cn(
          "h-4 w-4 text-gray-400",
          "transition-all duration-300",
          "opacity-0 -translate-x-2",
          "group-hover:opacity-100 group-hover:translate-x-0",
          "group-hover:text-blue-500"
        )} /> */}
      </Link>
    </Button>
  );
};

export function SideBarHere() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const { data: subscriptionData } = useSWR('/api/subscription', fetcher);
  const { data: projectsData, mutate: mutateProjects } = useSWR('/api/projects', fetcher);

  const projectCount = projectsData?.count || 0;
  const maxProjects = subscriptionData?.isPro ? "∞" : "100";
  const percentageUsed = subscriptionData?.isPro ? 0 : (projectCount / 100) * 100;
  const isPro = subscriptionData?.isPro;

  const handleNewProject = async (e) => {
    e.preventDefault();
    if (projectsData?.count >= 100 && !subscriptionData?.isPro) {
      window.location.href = "/pricing";
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Project", description: "" }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      await mutateProjects();
      window.location.href = `/project/${newProject.id}`;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const ProBadge = () => (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600/10 to-blue-400/10 text-blue-600 border border-blue-200 text-xs font-medium flex items-center gap-1">
      <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
      Pro
    </span>
  );

  const TemplatesBadge = () => (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-gray-600/10 to-gray-400/10 text-gray-600 border border-gray-200 text-xs font-medium">
      {isPro ? "Pro" : "Preview"}
    </span>
  );

  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2 space-y-8">
        <MotionContainer>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg" />
            <img src="/logo.png" alt="SketchFlow" className="relative h-8 w-auto" />
          </div>
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text hover:opacity-80 transition-opacity">
            SketchFlow
          </Link>
        </MotionContainer>
        <Separator className="my-4" />

        <div className="space-y-8">
          <div>
            <h2 className="mb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</h2>
            <div className="space-y-1.5">
              <MenuItem href="/projects" icon={FolderOpen}>All Projects</MenuItem>
              <MenuItem href="/projects/new" onClick={handleNewProject} icon={PlusCircle} disabled={isCreating}>
                {isCreating ? "Creating..." : "New Project"}
              </MenuItem>
              <MenuItem href="/projects/shared" icon={Share2}>Shared Projects</MenuItem>
              <MenuItem
                href="/projects/templates"
                icon={Sparkles}
                className="relative"
                badge={<TemplatesBadge />}
              >
                Templates
              </MenuItem>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* <div>
            <h2 className="mb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Articles</h2>
            <div className="space-y-1.5">
              <MenuItem 
                href="#" 
                icon={FileText}
                className="opacity-50 cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Articles feature coming soon!");
                }}
              >
                All Articles
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-600/10 to-yellow-400/10 text-yellow-600 border border-yellow-200 text-xs font-medium">
                  Coming Soon
                </span>
              </MenuItem>
              <MenuItem 
                href="#" 
                icon={PlusCircle}
                className="opacity-50 cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Articles feature coming soon!");
                }}
              >
                New Article
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-600/10 to-yellow-400/10 text-yellow-600 border border-yellow-200 text-xs font-medium">
                  Coming Soon
                </span>
              </MenuItem>
            </div>
          </div> */}
          <div className="px-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Project Usage</span>
                <span className="text-gray-900 font-semibold">{projectCount}/{maxProjects}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <MotionProgress percentageUsed={percentageUsed} />
              </div>
              {percentageUsed > 90 && !isPro && (
                <p className="text-xs text-red-600 flex items-center gap-1.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-600 animate-pulse"></span>
                  Running out of space! Consider upgrading.
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
            <div className="space-y-4">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">Plan</span>
                  <span className={cn(
                    "text-sm font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5",
                    isPro
                      ? "bg-gradient-to-r from-blue-600/10 to-blue-400/10 text-blue-600 border border-blue-200"
                      : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200"
                  )}>
                    {isPro ? (
                      <>
                        <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                        Pro
                      </>
                    ) : "Free"}
                  </span>
                </div>
                {isPro && subscriptionData?.subscription?.endDate && (
                  <p className="text-xs text-gray-500">
                    Renews: {new Date(subscriptionData.subscription.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!isPro ? (
                <MenuItem href="/subscription" icon={CreditCard} className="text-sm bg-gradient-to-r from-blue-50/50 to-transparent">
                  Upgrade to Pro
                </MenuItem>
              ) : (
                <MenuItem href="/projects/settings" icon={CreditCard} className="text-sm">
                  Manage Subscription
                </MenuItem>
              )}
              <MenuItem href="/projects/settings" icon={Settings} className="text-sm">Settings</MenuItem>
              <MenuItem href="/logout" icon={LogOut} className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50">
                Logout
              </MenuItem>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
