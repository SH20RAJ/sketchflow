'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash.debounce';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Editor({ projectId, initialData }) {
  const router = useRouter();
  const [layout, setLayout] = useState('sketch'); // 'sketch', 'markdown', 'split'
  const [markdownContent, setMarkdownContent] = useState(initialData?.markdown || '');
  const [excalidrawContent, setExcalidrawContent] = useState(initialData?.excalidraw || null);

  const saveToDatabase = useCallback(
    debounce(async (data) => {
      try {
        await fetch(`/api/projects/${projectId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Error saving:', error);
      }
    }, 1000),
    [projectId]
  );

  const handleMarkdownChange = (e) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    saveToDatabase({ markdown: newContent, excalidraw: excalidrawContent });
  };

  const handleExcalidrawChange = (elements, appState) => {
    const newContent = { elements, appState };
    setExcalidrawContent(newContent);
    saveToDatabase({ markdown: markdownContent, excalidraw: newContent });
  };

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
        <Button variant="outline" onClick={() => router.push('/projects')}>
          Back to Projects
        </Button>
      </div>

      <div className="flex-1 flex">
        {(layout === 'sketch' || layout === 'split') && (
          <div className={layout === 'split' ? 'w-1/2 border-r' : 'w-full'}>
            <Excalidraw
              initialData={excalidrawContent}
              onChange={handleExcalidrawChange}
              viewModeEnabled={false}
            />
          </div>
        )}

        {(layout === 'markdown' || layout === 'split') && (
          <div className={layout === 'split' ? 'w-1/2 flex flex-col' : 'w-full flex flex-col'}>
            <div className="flex-1 flex">
              <div className="w-1/2 p-4">
                <textarea
                  className="w-full h-full p-4 border rounded"
                  value={markdownContent}
                  onChange={handleMarkdownChange}
                  placeholder="Write your markdown here..."
                />
              </div>
              <div className="w-1/2 p-4 border-l">
                <div className="prose max-w-none">
                  <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
