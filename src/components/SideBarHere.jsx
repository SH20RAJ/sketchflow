"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, FolderOpen, Share2 } from "lucide-react";
import Link from "next/link";



export const SideBarHere = () => {
  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Projects</h2>
        <div className="space-y-1">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/projects">
              <FolderOpen className="mr-2 h-4 w-4" />
              All Projects
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/projects/shared">
              <Share2 className="mr-2 h-4 w-4" />
              Shared Projects
            </Link>
          </Button>
        </div>
      </div>
      <Separator className="my-2" />
    </ScrollArea>
  );
};
