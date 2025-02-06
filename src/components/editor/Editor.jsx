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
  excalidraw: { elements: [], appState: {} },
  markdown: '',
  name: 'Untitled',
};

export default function Editor({ projectId, initialData = {} }) {
  const router = useRouter();
  const [excalidrawData, setExcalidrawData] = useState(DEFAULT_DATA.excalidraw);
  const [markdown, setMarkdown] = useState(DEFAULT_DATA.markdown);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(DEFAULT_DATA.name);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState("split"); // 'split', 'sketch', 'markdown'

  // Load initial data
  useEffect(() => {
    if (initialData) {
      if (initialData.diagrams?.[0]?.content) {
        setExcalidrawData(initialData.diagrams[0].content);
      }
      if (initialData.markdowns?.[0]?.content) {
        setMarkdown(initialData.markdowns[0].content);
      }
      if (initialData.name) {
        setProjectName(initialData.name);
      }
    }
  }, [initialData]);

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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          excalidraw: excalidrawData,
          markdown: markdown,
          name: projectName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save project');
      }

      // Update local state with saved data
      if (data.success) {
        if (data.project?.name) {
          setProjectName(data.project.name);
        }
        if (data.diagram?.content) {
          setExcalidrawData(data.diagram.content);
        }
        if (data.markdown?.content) {
          setMarkdown(data.markdown.content);
        }
        setIsEditingName(false);
      } else {
        throw new Error('Failed to save project');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  }, [projectId, excalidrawData, markdown, projectName]);

  const handleNameChange = useCallback((e) => {
    setProjectName(e.target.value);
  }, []);

  return (
    <div className="h-screen flex flex-col">
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

      {error && (
        <div className="bg-red-50 text-red-500 p-2 text-sm">{error}</div>
      )}

      <div className="flex-1 min-h-0">
        {layout === "split" ? (
          <div className="grid grid-cols-2 h-full">
            <div className="h-full border-r">
              <Excalidraw
                onChange={handleExcalidrawChange}
                initialData={excalidrawData}
                viewModeEnabled={false}
              />
            </div>
            <div className="h-full">
              <MarkdownEditor
                content={markdown}
                onChange={handleMarkdownChange}
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
