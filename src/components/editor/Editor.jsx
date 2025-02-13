"use client";

import React, { useState, useCallback, useEffect } from "react";
import useSWR from 'swr';
import { Excalidraw } from "@excalidraw/excalidraw";
import { LoadingButton } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X, Layout, Share2, Copy, Globe, Loader2 } from "lucide-react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import Image from "next/image";
import Link from "next/link";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { motion } from 'framer-motion';

const DEFAULT_DATA = {
  excalidraw: {
    elements: [],
    appState: { viewBackgroundColor: "#ffffff" },
    scrollToContent: true,
  },
  markdown: `
# SketchFlow

---

A collaborative diagramming and markdown editor.

  `,
  name: "Untitled Project" + Math.floor(Math.random() * 1000),
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Editor({ projectId, initialData = {}, isOwner = false }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [layout, setLayout] = useState("split");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [excalidrawData, setExcalidrawData] = useState(initialData?.diagram?.content || DEFAULT_DATA.excalidraw);
  const [markdown, setMarkdown] = useState(initialData?.markdown?.content || DEFAULT_DATA.markdown);
  const [projectName, setProjectName] = useState(initialData?.name || DEFAULT_DATA.name);
  const [isShared, setIsShared] = useState(initialData?.shared || false);
  const [previousLayout, setPreviousLayout] = useState(layout);

  useEffect(() => {
    if (layout !== previousLayout) {
      setPreviousLayout(layout);
      if (layout === 'split' || layout === 'markdown') {
        setMarkdown(prev => prev);
      }
      if (layout === 'split' || layout === 'sketch') {
        setExcalidrawData(prev => ({ ...prev }));
      }
    }
  }, [layout]);

  const { data, error, mutate } = useSWR(`/api/projects/${projectId}`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
  });

  const handleExcalidrawChange = useCallback((elements, appState) => {
    setExcalidrawData({ elements, appState });
  }, []);

  const handleMarkdownChange = useCallback((newMarkdown) => {
    setMarkdown(newMarkdown);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excalidraw: excalidrawData, markdown, name: projectName }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to save project");
      mutate(result);
      setIsEditingName(false);
      toast.success("Project saved successfully");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  }, [projectId, excalidrawData, markdown, projectName, mutate]);

  const toggleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shared: !isShared })
      });

      if (!response.ok) throw new Error('Failed to update sharing settings');

      setIsShared(!isShared);
      toast.success(isShared ? 'Project is now private' : 'Project is now shared');
      mutate();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update sharing settings');
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/project/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };

  const handleNameChange = useCallback((e) => {
    setProjectName(e.target.value);
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="border-b px-4 h-16 flex items-center justify-between bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="rounded-lg" />
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={projectName}
                  onChange={handleNameChange}
                  className="w-[200px]"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingName(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">{projectName}</h1>
                {isOwner && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            {isShared && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Globe className="w-3 h-3 mr-1" />
                Shared
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-1">
            {["split", "sketch", "markdown"].map((l) => (
              <Button
                key={l}
                size="sm"
                variant={layout === l ? "default" : "ghost"}
                onClick={() => setLayout(l)}
                className="capitalize"
              >
                {l}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>

                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Project</DialogTitle>
                      <DialogDescription>
                        Anyone with the link can view this project when sharing is enabled.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Share with anyone</h4>
                          <p className="text-sm text-gray-500">
                            {isShared ? 'Project is publicly accessible' : 'Project is private'}
                          </p>
                        </div>
                        <Switch
                          checked={isShared}
                          onCheckedChange={toggleShare}
                          disabled={isSharing}
                        />
                      </div>
                      {isShared && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Share link</label>
                          <div className="flex gap-2">
                            <Input
                              readOnly
                              value={`${window.location.origin}/project/${projectId}`}
                            />
                            <Button onClick={copyShareLink}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResizablePanelGroup
          direction={layout === "split" ? "horizontal" : "vertical"}
        >
          {layout !== "sketch" && (
            <ResizablePanel defaultSize={layout === "split" ? 30 : 100}>
              <MarkdownEditor
                content={markdown}
                onChange={handleMarkdownChange}
                readOnly={!isOwner}
              />
            </ResizablePanel>
          )}
          {layout !== "markdown" && (
            <ResizablePanel defaultSize={layout === "split" ? 70 : 100}>
              <Excalidraw
                onChange={handleExcalidrawChange}
                initialData={excalidrawData}
                viewModeEnabled={!isOwner}
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
