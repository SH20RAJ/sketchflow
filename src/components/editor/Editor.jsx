"use client";

import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import useSWR from "swr";
import { Excalidraw } from "@excalidraw/excalidraw";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { toast } from "sonner";
import { EditorNavbar } from "./EditorNavbar";

const DEFAULT_DATA = {
  excalidraw: {
    elements: [],
    appState: { viewBackgroundColor: "#ffffff" },
    scrollToContent: true,
  },
  markdown: ``,
  name: "Untitled Project" + Math.floor(Math.random() * 1000),
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Editor({ projectId, initialData = {}, isOwner = false }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [layout, setLayout] = useState('split');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [excalidrawData, setExcalidrawData] = useState(
    initialData?.diagram?.content || DEFAULT_DATA.excalidraw
  );
  const [markdown, setMarkdown] = useState(
    initialData?.markdown?.content || DEFAULT_DATA.markdown
  );
  const [projectName, setProjectName] = useState(
    initialData?.name || DEFAULT_DATA.name
  );
  const [isShared, setIsShared] = useState(initialData?.shared || false);
  const [previousLayout, setPreviousLayout] = useState(layout);
  const [projectDescription, setProjectDescription] = useState(
    initialData?.description || ''
  );
  const [showTagDialog, setShowTagDialog] = useState(false);

  const handleTagsUpdated = async () => {
    await mutate();
  };

  const handleLayoutChange = useCallback((newLayout) => {
    setPreviousLayout(layout);
    setLayout(newLayout);

    let m = markdown;
    setMarkdown(m);
  }, [layout]);

  useEffect(() => {
    if (markdown) {
      localStorage.setItem('markdown-content', markdown);
    }
  }, [markdown]);

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdown-content');
    if (savedMarkdown && !markdown) {
      setMarkdown(savedMarkdown);
    }
  }, []);

  const { data, error, mutate } = useSWR(
    `/api/projects/${projectId}`,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
    }
  );

  const handleExcalidrawChange = useCallback((elements, appState) => {
    setExcalidrawData({ elements, appState });
  }, []);

  const handleMarkdownChange = useCallback((newMarkdown) => {
    setMarkdown(newMarkdown);
  }, []);

  const debouncedAutoSave = useCallback(
    debounce(async () => {
      if (!projectId) return;
      setAutoSaveStatus('saving');
      try {
        const response = await fetch(`/api/projects/${projectId}/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            excalidraw: excalidrawData,
            markdown,
            name: projectName,
            description: projectDescription,
          }),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Failed to save project");
        mutate(result);
        setLastSaved(new Date());
        setAutoSaveStatus('saved');
      } catch (err) {
        console.error("Auto-save error:", err);
        setAutoSaveStatus('error');
      }
    }, 2000),
    [projectId, excalidrawData, markdown, projectName, projectDescription, mutate]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          excalidraw: excalidrawData,
          markdown,
          name: projectName,
          description: projectDescription,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to save project");
      mutate(result);
      setIsEditingName(false);
      toast.success("Project saved successfully");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  }, [projectId, excalidrawData, markdown, projectName, projectDescription, mutate]);

  const toggleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shared: !isShared }),
      });

      if (!response.ok) throw new Error("Failed to update sharing settings");

      setIsShared(!isShared);
      toast.success(
        isShared ? "Project is now private" : "Project is now shared"
      );
      mutate();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update sharing settings");
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/project/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard");
  };

  const handleNameChange = useCallback((e) => {
    setProjectName(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setProjectDescription(e.target.value);
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-white">
      <EditorNavbar
        projectName={projectName}
        isEditingName={isEditingName}
        setIsEditingName={setIsEditingName}
        handleNameChange={handleNameChange}
        isOwner={isOwner}
        isShared={isShared}
        layout={layout}
        setLayout={handleLayoutChange}
        handleSave={handleSave}
        isSaving={isSaving}
        showShareDialog={showShareDialog}
        setShowShareDialog={setShowShareDialog}
        toggleShare={toggleShare}
        isSharing={isSharing}
        projectId={projectId}
        copyShareLink={copyShareLink}
        projectDescription={projectDescription}
        handleDescriptionChange={handleDescriptionChange}
      />

      <div className="flex-1 min-h-0 relative">
        <ResizablePanelGroup
          direction={layout === 'split' ? 'horizontal' : 'vertical'}
          className="rounded-lg"
        >
          <ResizablePanel
            defaultSize={layout === 'split' ? 30 : 100}
            className={`min-h-0 ${layout === 'sketch' ? 'hidden' : ''}`}
          >
            <div className="h-full overflow-auto">
              <MarkdownEditor
                content={markdown}
                onChange={handleMarkdownChange}
                readOnly={!isOwner}
              />
            </div>
          </ResizablePanel>
          <ResizablePanel
            defaultSize={layout === 'split' ? 70 : 100}
            className={`min-h-0 ${layout === 'markdown' ? 'hidden' : ''}`}
          >
            <Excalidraw
              onChange={handleExcalidrawChange}
              initialData={excalidrawData}
              viewModeEnabled={!isOwner}
              UIOptions={{
                dockedToolbar: true,
                toolbarPosition: "left",
                canvasActions: {
                  saveToActiveFile: false,
                }
              }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
