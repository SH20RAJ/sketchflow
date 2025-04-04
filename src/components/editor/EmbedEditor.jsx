'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Resizable } from 're-resizable';
import dynamic from 'next/dynamic';
import { Loader2, SplitSquareVertical, FileText, Box } from 'lucide-react';

// Dynamically import Excalidraw with SSR disabled
const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    ),
  }
);

// Dynamically import the Markdown editor with SSR disabled
const MarkdownEditor = dynamic(
  () => import('@/components/editor/MarkdownEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    ),
  }
);

export default function EmbedEditor({
  projectId,
  initialData = {},
  viewMode = 'split',
  readOnly = false,
  isEmbedded = true,
}) {
  const [excalidrawData, setExcalidrawData] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState('split');
  const [splitPosition, setSplitPosition] = useState(50);
  
  // Initialize data
  useEffect(() => {
    if (initialData) {
      // Set diagram data if available
      if (initialData.diagram?.content) {
        try {
          setExcalidrawData(JSON.parse(initialData.diagram.content));
        } catch (error) {
          console.error('Error parsing diagram data:', error);
          setExcalidrawData(null);
        }
      }
      
      // Set markdown content if available
      if (initialData.markdown?.content) {
        setMarkdown(initialData.markdown.content);
      }
    }
  }, [initialData]);
  
  // Set active tab based on viewMode prop
  useEffect(() => {
    setActiveTab(viewMode);
  }, [viewMode]);
  
  // Handle Excalidraw changes
  const handleExcalidrawChange = (elements, appState) => {
    if (readOnly) return;
    
    setExcalidrawData({
      elements,
      appState,
    });
  };
  
  // Handle Markdown changes
  const handleMarkdownChange = (value) => {
    if (readOnly) return;
    
    setMarkdown(value);
  };
  
  // Render based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'split':
        return (
          <div className="flex h-full">
            <Resizable
              defaultSize={{ width: `${splitPosition}%`, height: '100%' }}
              minWidth="30%"
              maxWidth="70%"
              enable={{ right: true }}
              onResizeStop={(e, direction, ref, d) => {
                const newWidth = splitPosition + (d.width / window.innerWidth) * 100;
                setSplitPosition(Math.min(Math.max(newWidth, 30), 70));
              }}
              className="h-full border-r"
            >
              <div className="h-full">
                {excalidrawData && (
                  <Excalidraw
                    initialData={excalidrawData}
                    onChange={handleExcalidrawChange}
                    viewModeEnabled={readOnly}
                    zenModeEnabled
                    gridModeEnabled
                    theme="light"
                  />
                )}
              </div>
            </Resizable>
            
            <div className="flex-1 h-full overflow-auto">
              <MarkdownEditor
                value={markdown}
                onChange={handleMarkdownChange}
                readOnly={readOnly}
                isEmbedded={isEmbedded}
              />
            </div>
          </div>
        );
        
      case 'diagram':
        return (
          <div className="h-full">
            {excalidrawData && (
              <Excalidraw
                initialData={excalidrawData}
                onChange={handleExcalidrawChange}
                viewModeEnabled={readOnly}
                zenModeEnabled
                gridModeEnabled
                theme="light"
              />
            )}
          </div>
        );
        
      case 'markdown':
        return (
          <div className="h-full">
            <MarkdownEditor
              value={markdown}
              onChange={handleMarkdownChange}
              readOnly={readOnly}
              isEmbedded={isEmbedded}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // If viewMode is fixed, just render the content without tabs
  if (viewMode !== 'split' && viewMode !== 'diagram' && viewMode !== 'markdown') {
    return renderContent();
  }
  
  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <TabsList className="mx-4 mt-2 mb-0 justify-start">
          <TabsTrigger value="split" className="flex items-center gap-1">
            <SplitSquareVertical className="h-4 w-4" />
            <span className="hidden sm:inline">Split View</span>
          </TabsTrigger>
          <TabsTrigger value="diagram" className="flex items-center gap-1">
            <Box className="h-4 w-4" />
            <span className="hidden sm:inline">Diagram</span>
          </TabsTrigger>
          <TabsTrigger value="markdown" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Markdown</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="split" className="flex-1 m-0 p-0 overflow-hidden">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="diagram" className="flex-1 m-0 p-0 overflow-hidden">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="markdown" className="flex-1 m-0 p-0 overflow-hidden">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
