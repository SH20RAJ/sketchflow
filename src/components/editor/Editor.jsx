"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import ReactMarkdown from "react-markdown";
import debounce from "lodash.debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Editor({ projectId, initialData }) {
  const router = useRouter();
  const [layout, setLayout] = useState("sketch");
  const [markdownContent, setMarkdownContent] = useState(
    initialData?.markdown || ""
  );
  const [excalidrawContent, setExcalidrawContent] = useState(
    initialData?.excalidraw || { elements: [], appState: {} }
  );

  // Use refs to store the latest values without causing re-renders
  const markdownRef = useRef(markdownContent);
  const excalidrawRef = useRef(excalidrawContent);

  useEffect(() => {
    markdownRef.current = markdownContent;
    excalidrawRef.current = excalidrawContent;
  }, [markdownContent, excalidrawContent]);

  const saveToDatabase = useCallback(
    debounce(async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            markdown: markdownRef.current,
            excalidraw: excalidrawRef.current,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to save");
        }
      } catch (error) {
        console.error("Error saving:", error);
      }
    }, 1000),
    [projectId]
  );

  const handleMarkdownChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      setMarkdownContent(newContent);
      saveToDatabase();
    },
    [saveToDatabase]
  );

  const handleExcalidrawChange = useCallback(
    (elements, appState) => {
      const newContent = { elements, appState };
      setExcalidrawContent(newContent);
      saveToDatabase();
    },
    [saveToDatabase]
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex justify-between items-center">
        <Tabs value={layout} onValueChange={setLayout} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="sketch">Sketch</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="split">Split View</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {layout === "split" ? (
          <div className="grid grid-cols-2 h-full">
            <div className="border-r p-4 overflow-auto">
              <textarea
                value={markdownContent}
                onChange={handleMarkdownChange}
                className="w-full h-full p-4 resize-none focus:outline-none"
                placeholder="Start writing in markdown..."
              />
            </div>
            <div className="h-full">
              <Excalidraw
                initialData={excalidrawContent}
                onChange={handleExcalidrawChange}
              />
            </div>
          </div>
        ) : layout === "markdown" ? (
          <div className="grid grid-cols-2 h-full">
            <div className="border-r p-4 overflow-auto">
              <textarea
                value={markdownContent}
                onChange={handleMarkdownChange}
                className="w-full h-full p-4 resize-none focus:outline-none"
                placeholder="Start writing in markdown..."
              />
            </div>
            <div className="p-4 overflow-auto">
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <Excalidraw
              initialData={excalidrawContent}
              onChange={handleExcalidrawChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
