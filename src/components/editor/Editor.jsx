"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import useSWR from "swr";
import { Excalidraw } from "@excalidraw/excalidraw";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "../ui/resizable";
import { toast } from "sonner";
import { EditorNavbar } from "./EditorNavbar";
import { ExcalidrawLibraryPanel } from "./ExcalidrawLibraryPanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Library } from "lucide-react";

const DEFAULT_DATA = {
  excalidraw: {
    elements: [],
    appState: { viewBackgroundColor: "#ffffff" },
    scrollToContent: true,
  },
  markdown: `
  # Welcome to SketchFlow!

  This is a sample project to help you get started with SketchFlow.
  `,
  name: "Untitled Project" + Math.floor(Math.random() * 1000),
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Editor({ projectId, initialData = {}, isOwner = false, isCollaborator = false, collaboratorRole = null }) {
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
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveInterval, setAutoSaveInterval] = useState(80000); // 30 seconds
  const [showLibraryPanel, setShowLibraryPanel] = useState(false);
  const excalidrawRef = useRef(null);

  const handleTagsUpdated = async () => {
    await mutate();
  };

  const handleLayoutChange = useCallback((newLayout) => {
    setPreviousLayout(layout);
    setLayout(newLayout);
  }, [layout]);

  // Auto-save functionality - only on content changes
  useEffect(() => {
    if (!autoSaveEnabled || !projectId) return;
    if (isSaving) return; // Don't trigger a new save if already saving

    // Create a debounced save function
    const debouncedSave = setTimeout(async () => {
      if (excalidrawData || markdown) {
        try {
          setIsSaving(true);
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

          if (response.ok) {
            const result = await response.json();
            mutate(result);
            setLastSaved(new Date());
            console.log('Auto-saved project after content change');
          }
        } catch (err) {
          console.error("Auto-save error:", err);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(debouncedSave);
  }, [excalidrawData, markdown]); // Only trigger on content changes

  // Auto-save on project name or description changes
  useEffect(() => {
    if (!autoSaveEnabled || !projectId || isSaving) return;

    // Only save if we have a name (to avoid saving empty projects)
    if (!projectName) return;

    // Create a debounced save function with longer delay for metadata changes
    const debouncedMetadataSave = setTimeout(async () => {
      try {
        setIsSaving(true);
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

        if (response.ok) {
          const result = await response.json();
          mutate(result);
          setLastSaved(new Date());
          console.log('Auto-saved project after metadata change');
        }
      } catch (err) {
        console.error("Metadata auto-save error:", err);
      } finally {
        setIsSaving(false);
      }
    }, 3000); // 3 second debounce for metadata changes

    return () => clearTimeout(debouncedMetadataSave);
  }, [projectName, projectDescription]);

  // Save markdown to localStorage as backup
  useEffect(() => {
    if (markdown) {
      localStorage.setItem('markdown-content', markdown);
    }
  }, [markdown]);

  // Load markdown from localStorage if available
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
      setLastSaved(new Date());
      toast.success("Project saved successfully");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  }, [projectId, excalidrawData, markdown, projectName, projectDescription, mutate]);

  // Sync function to fetch the latest project data from the database
  const handleSync = useCallback(async () => {
    try {
      toast.loading("Syncing project...");

      // Fetch the latest project data
      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }

      const latestData = await response.json();

      // Update the local state with the latest data
      if (latestData.markdown?.content) {
        setMarkdown(latestData.markdown.content);
      }

      if (latestData.diagram?.content) {
        setExcalidrawData(latestData.diagram.content);
      }

      setProjectName(latestData.name || DEFAULT_DATA.name);
      setProjectDescription(latestData.description || '');
      setIsShared(latestData.shared || false);

      // Update the SWR cache
      mutate(latestData);

      toast.dismiss();
      toast.success("Project synced successfully");
    } catch (error) {
      console.error("Sync error:", error);
      toast.dismiss();
      toast.error("Failed to sync project: " + error.message);
    }
  }, [projectId, mutate]);

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
        isCollaborator={isCollaborator}
        collaboratorRole={collaboratorRole}
        autoSaveEnabled={autoSaveEnabled}
        setAutoSaveEnabled={setAutoSaveEnabled}
        lastSaved={lastSaved}
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
        handleSync={handleSync}
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
                readOnly={!(isOwner || (isCollaborator && collaboratorRole === 'EDITOR'))}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={layout === 'split' ? 70 : 100}
            className={`min-h-0 ${layout === 'markdown' ? 'hidden' : ''}`}
          >
            <div className="relative h-full">
              <Excalidraw
                ref={excalidrawRef}
                onChange={handleExcalidrawChange}
                initialData={excalidrawData}
                viewModeEnabled={!(isOwner || (isCollaborator && collaboratorRole === 'EDITOR'))}
                UIOptions={{
                  dockedToolbar: true,
                  toolbarPosition: "left",
                  canvasActions: {
                    saveToActiveFile: false,
                  }
                }}
              />

              {/* Library Button */}
              <div className="absolute top-2 right-2 z-10">
                <Sheet open={showLibraryPanel} onOpenChange={setShowLibraryPanel}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white shadow-sm"
                    >
                      <Library className="h-4 w-4 mr-1" />
                      Library
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0">
                    <div className="h-full">
                      <ExcalidrawLibraryPanel
                        onAddToCanvas={(libraryItem) => {
                          if (excalidrawRef.current && libraryItem) {
                            try {
                              // Add library item to canvas
                              let elements = [];

                              // Handle both formats: elements array or direct elements
                              if (libraryItem.elements && Array.isArray(libraryItem.elements)) {
                                elements = libraryItem.elements;
                              } else if (Array.isArray(libraryItem)) {
                                elements = libraryItem;
                              }

                              if (elements.length > 0) {
                                // Position elements in the center of the viewport
                                const appState = excalidrawRef.current.getAppState();
                                const { width, height } = appState;

                                // Clone elements to avoid modifying the original
                                const clonedElements = JSON.parse(JSON.stringify(elements));

                                // Add elements to canvas
                                excalidrawRef.current.updateScene({
                                  elements: clonedElements
                                });
                              }
                            } catch (error) {
                              console.error('Error adding library item to canvas:', error);
                              toast.error('Failed to add library item to canvas');
                            }
                          }
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
