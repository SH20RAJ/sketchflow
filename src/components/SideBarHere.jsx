"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, FolderOpen, Share2, Settings, LogOut, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MenuItem = ({ href, icon: Icon, children, className }) => (
  <Button asChild variant="ghost" className={cn("w-full justify-start group hover:bg-blue-50/50", className)}>
    <Link href={href} className="flex items-center">
      <Icon className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
      <span className="flex-1 group-hover:text-blue-600 transition-colors">{children}</span>
      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
    </Link>
  </Button>
);

export const SideBarHere = () => {
  const { data: projectsData } = useSWR("/api/projects", fetcher);
  const { data: subscriptionData } = useSWR("/api/subscription", fetcher);

  const projectCount = projectsData?.count || 0;
  const maxProjects = subscriptionData?.isPro ? "∞" : "100";
  const percentageUsed = subscriptionData?.isPro ? 0 : (projectCount / 100) * 100;
  const isPro = subscriptionData?.isPro;

  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6 px-4"
        >
          <img src="/logo.svg" alt="SketchFlow" className="h-8 w-auto" />
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text hover:opacity-80 transition-opacity">
            SketchFlow
          </Link>
        </motion.div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-2 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Projects</h2>
            <div className="space-y-1">
              <MenuItem href="/projects" icon={FolderOpen}>All Projects</MenuItem>
              <MenuItem href="/projects/new" icon={PlusCircle}>New Project</MenuItem>
              <MenuItem href="/projects/shared" icon={Share2}>Shared Projects</MenuItem>
            </div>
          </div>

          <div className="px-4">
            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Project Usage</span>
                <span className="text-gray-900 font-semibold">{projectCount}/{maxProjects}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageUsed}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full transition-colors",
                    percentageUsed > 90 ? "bg-red-500" :
                      percentageUsed > 70 ? "bg-yellow-500" :
                        "bg-blue-500"
                  )}
                />
              </div>
              {percentageUsed > 90 && !isPro && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                  Running out of space! Consider upgrading.
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
            <div className="space-y-1">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className={cn(
                    "text-sm font-semibold px-2 py-1 rounded-full",
                    isPro ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {isPro ? "Pro" : "Free"}
                  </span>
                </div>
                {subscriptionData?.expiresAt && (
                  <p className="text-xs text-gray-500">
                    Expires: {new Date(subscriptionData.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <MenuItem href="/subscription" icon={CreditCard} className="text-sm">
                {isPro ? "Manage Subscription" : "Upgrade to Pro"}
              </MenuItem>
              <MenuItem href="/settings" icon={Settings} className="text-sm">Settings</MenuItem>
              <MenuItem href="/logout" icon={LogOut} className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50">
                Logout
              </MenuItem>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
