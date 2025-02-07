"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { LoadingButton } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, X, Layout } from "lucide-react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";

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

export default function Editor({ projectId, initialData = {} }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [excalidrawData, setExcalidrawData] = useState(DEFAULT_DATA.excalidraw);
  const [markdown, setMarkdown] = useState(DEFAULT_DATA.markdown);
  const [projectName, setProjectName] = useState(DEFAULT_DATA.name);

  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState("split");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        console.log("data",data);

        setExcalidrawData(data.diagram ?.content || DEFAULT_DATA.excalidraw);
        setMarkdown(data.markdown?.content || DEFAULT_DATA.markdown);
        setProjectName(data.name || DEFAULT_DATA.name);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleExcalidrawChange = useCallback((elements, appState) => {
    setExcalidrawData({ elements, appState });
  }, []);

  const handleMarkdownChange = useCallback((newMarkdown) => {
    setMarkdown(newMarkdown);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          excalidraw: excalidrawData,
          markdown: markdown,
          name: projectName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save project");
      }
// diagram.content.appState.collaborators;
      if (data.success) {
        data.diagram.content.appState.collaborators = [];
        setProjectName(data.project?.name || projectName);
        setExcalidrawData(data.diagram?.content || excalidrawData);
        setMarkdown(data.markdown?.content || markdown);
        setIsEditingName(false);
      } else {
        throw new Error("Failed to save project");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  }, [projectId, excalidrawData, markdown, projectName]);

  const handleNameChange = useCallback((e) => {
    setProjectName(e.target.value);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <title>{projectName}</title>
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              size="sm"
              variant={layout === "split" ? "default" : "ghost"}
              onClick={() => setLayout("split")}
            >
              Split
            </Button>
            <Button
              size="sm"
              variant={layout === "sketch" ? "default" : "ghost"}
              onClick={() => setLayout("sketch")}
            >
              Sketch
            </Button>
            <Button
              size="sm"
              variant={layout === "markdown" ? "default" : "ghost"}
              onClick={() => setLayout("markdown")}
            >
              Notes
            </Button>
          </div>

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

          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
            className="ml-2"
          >
            Back to Projects
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {layout === "split" ? (
          <div className="grid grid-cols-10 h-full">
            <div className="col-span-3 h-full">
              <MarkdownEditor
                content={markdown}
                onChange={handleMarkdownChange}
              />
            </div>
            <div className="col-span-7 h-full">
              <Excalidraw
                onChange={handleExcalidrawChange}
                initialData={excalidrawData}
                viewModeEnabled={false}
              />
            </div>
          </div>
        ) : layout === "markdown" ? (
          <div className="h-full">
            <MarkdownEditor
              content={markdown}
              onChange={handleMarkdownChange}
            />
          </div>
        ) : (
          <div className="h-full">
            <Excalidraw
              onChange={handleExcalidrawChange}
              initialData={excalidrawData}
              viewModeEnabled={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
