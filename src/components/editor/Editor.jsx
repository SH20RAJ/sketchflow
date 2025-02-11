"use client";

import React, { useState, useCallback } from "react";
import useSWR from 'swr';
import { Excalidraw } from "@excalidraw/excalidraw";
import { LoadingButton } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X, Layout, Share } from "lucide-react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_DATA = {
  excalidraw: {
    elements: [
      {
        type: "rectangle",
        version: 141,
        versionNonce: 361174001,
        isDeleted: false,
        id: "oDVXy8D6rom3H1-LLH2-f",
        fillStyle: "hachure",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 1,
        opacity: 100,
        angle: 0,
        x: 100.50390625,
        y: 93.67578125,
        strokeColor: "#000000",
        backgroundColor: "transparent",
        width: 186.47265625,
        height: 141.9765625,
        seed: 1968410350,
        groupIds: [],
      },
    ],
    appState: { zenModeEnabled: false, viewBackgroundColor: "#a5d8ff" },
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

export default function Editor({ projectId, initialData = {} }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [layout, setLayout] = useState("sketch");

  const { data, error, mutate } = useSWR(`/api/projects/${projectId}`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
  });

  const [excalidrawData, setExcalidrawData] = useState(data?.diagram?.content || DEFAULT_DATA.excalidraw);
  const [markdown, setMarkdown] = useState(data?.markdown?.content || DEFAULT_DATA.markdown);
  const [projectName, setProjectName] = useState(data?.name || DEFAULT_DATA.name);

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
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [projectId, excalidrawData, markdown, projectName, mutate]);

  const handleShare = () => {
    navigator.clipboard.writeText(JSON.stringify({ excalidraw: excalidrawData, markdown, name: projectName }));
    alert("Project shared successfully!");
  }

  const handleNameChange = useCallback((e) => {
    setProjectName(e.target.value);
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <title>{projectName}</title>
      <div className="border-b h-12 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/projects">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          </Link>
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
              <h1 className="text-xl font-semibold">{projectName}</h1>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditingName(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 border rounded-lg p-1">
            {["split", "sketch", "markdown"].map((l) => (
              <Button
                key={l}
                size="sm"
                variant={layout === l ? "default" : "ghost"}
                onClick={() => setLayout(l)}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <LoadingButton>Saving...</LoadingButton>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share className="h-4 w-4 mr-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
          >
            Back to Projects
          </Button>
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
              />
            </ResizablePanel>
          )}
          {layout !== "markdown" && (
            <ResizablePanel defaultSize={layout === "split" ? 70 : 100}>
              <Excalidraw
                onChange={handleExcalidrawChange}
                initialData={excalidrawData}
                viewModeEnabled={false}
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
