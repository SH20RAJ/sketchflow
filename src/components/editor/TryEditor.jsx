"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { debounce } from "lodash";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
    async () => {
        const { Excalidraw, restore: excalidrawRestore, restoreAppState: excalidrawRestoreAppState, restoreElements: excalidrawRestoreElements } = await import("@excalidraw/excalidraw");
        Object.assign(restore, { value: excalidrawRestore });
        Object.assign(restoreAppState, { value: excalidrawRestoreAppState });
        Object.assign(restoreElements, { value: excalidrawRestoreElements });
        return Excalidraw;
    },
    { ssr: false }
);

const { restore, restoreAppState, restoreElements } = { restore: () => { }, restoreAppState: () => { }, restoreElements: () => { } };
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Pencil,
    Save,
    X,
    Layout,
    Share2,
    Copy,
    Globe,
    Loader2,
    SplitSquareHorizontal,
    FileText
} from "lucide-react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const DEFAULT_DATA = {
    excalidraw: {
        elements: [],
        appState: { viewBackgroundColor: "#ffffff" },
        scrollToContent: true,
    },
    markdown: `# Welcome to SketchFlow!

---

This is a sample project to help you get started with SketchFlow.

## Features

### 🎨 Drawing Tools
- Free-hand drawing
- Shapes and arrows
- Text annotations
- Custom colors and styles

### 📝 Markdown Support
- Full markdown syntax
- Real-time preview
- Code blocks with syntax highlighting
- Tables and lists

## Try it out!
1. Use the drawing tools on the left panel
2. Write markdown in the right panel
3. Switch between different views using the layout buttons

---
Made with ❤️ by SketchFlow Team
`,
    name: "Sample Project",
};

const STORAGE_KEY = "sketchflow_try_editor_data";

export default function TryEditor({ initialData = {}, readOnly = false }) {
    const router = useRouter();
    const [layout, setLayout] = useState("split");
    const [excalidrawData, setExcalidrawData] = useState(() => {
        const data = initialData.excalidraw || DEFAULT_DATA.excalidraw;
        return typeof restore.value === 'function' ? restore.value(data, null, null) : data;
    });
    const [markdownContent, setMarkdownContent] = useState(
        initialData.markdown || DEFAULT_DATA.markdown
    );
    const [projectName, setProjectName] = useState(
        initialData.name || DEFAULT_DATA.name
    );

    // Load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                const restoredData = restore(parsedData.excalidraw, null, null);
                setExcalidrawData(restoredData);
                setMarkdownContent(parsedData.markdown);
                setProjectName(parsedData.name);
            } catch (error) {
                console.error("Error loading data from localStorage:", error);
            }
        }
    }, []);

    // Save to localStorage whenever data changes
    const saveToLocalStorage = useCallback(
        debounce((data) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }, 1000),
        []
    );

    // Update localStorage when data changes
    useEffect(() => {
        const data = {
            excalidraw: excalidrawData,
            markdown: markdownContent,
            name: projectName,
        };
        saveToLocalStorage(data);
    }, [excalidrawData, markdownContent, projectName, saveToLocalStorage]);

    const handleExcalidrawChange = useCallback((elements, appState) => {
        const restoredElements = typeof restoreElements.value === 'function' ? restoreElements.value(elements, null) : elements;
        const restoredAppState = typeof restoreAppState.value === 'function' ? restoreAppState.value(appState, null) : appState;
        setExcalidrawData({ elements: restoredElements, appState: restoredAppState });
    }, []);

    const handleMarkdownChange = useCallback((value) => {
        setMarkdownContent(value);
    }, []);

    const handleSave = () => {
        toast.error('Please login to save your work', {
            action: {
                label: 'Login',
                onClick: () => router.push('/login')
            }
        });
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Navbar */}
            <div className="border-b h-12 flex items-center justify-between bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                        <Image src="/logo.png" alt="Logo" width={24} height={24} className="rounded-md" />
                    </Link>
                    <div className="h-6 w-px bg-gray-200 mx-1" />
                    <span className="font-medium text-sm text-gray-700">{projectName}</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 border rounded-md p-0.5 bg-gray-50/50">
                        <Button
                            size="sm"
                            variant={layout === "split" ? "default" : "ghost"}
                            onClick={() => setLayout("split")}
                            className={`h-7 gap-2 px-3 text-xs font-medium ${layout === "split" ? 'bg-white hover:bg-gray-50 text-black shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <SplitSquareHorizontal className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Split View</span>
                        </Button>
                        <Button
                            size="sm"
                            variant={layout === "canvas" ? "default" : "ghost"}
                            onClick={() => setLayout("canvas")}
                            className={`h-7 gap-2 px-3 text-xs font-medium ${layout === "canvas" ? 'bg-white hover:bg-gray-50 text-black shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <Layout className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Canvas View</span>
                        </Button>
                        <Button
                            size="sm"
                            variant={layout === "markdown" ? "default" : "ghost"}
                            onClick={() => setLayout("markdown")}
                            className={`h-7 gap-2 px-3 text-xs font-medium ${layout === "markdown" ? 'bg-white hover:bg-gray-50 text-black shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Document View</span>
                        </Button>
                    </div>

                    <Link
                        href="/projects"
                        onClick={handleSave}
                        size="sm"
                        as={Button}
                        className="h-8 w-full flex p-4 rounded-sm justify-center items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Save className="h-3.5 w-3.5" />
                        <span className="text-xs">Login</span>
                    </Link>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden">
                {layout === "split" ? (
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={30} minSize={30}>
                            <MarkdownEditor
                                value={markdownContent}
                                onChange={handleMarkdownChange}
                                readOnly={readOnly}
                                disableLocalStorage={false}
                            />
                        </ResizablePanel> <ResizablePanel defaultSize={70} minSize={30}>
                            <div className="h-full">
                                <Excalidraw
                                    initialData={excalidrawData}
                                    onChange={handleExcalidrawChange}
                                    viewModeEnabled={readOnly}
                                >
                                    {/* <WelcomeScreen /> */}

                                </Excalidraw>
                            </div>
                        </ResizablePanel>

                    </ResizablePanelGroup>
                ) : layout === "canvas" ? (
                    <div className="h-full">
                        <Excalidraw
                            initialData={excalidrawData}
                            onChange={handleExcalidrawChange}
                            viewModeEnabled={readOnly}
                            zenModeEnabled={false}
                            theme="light"
                            UIOptions={{
                                canvasActions: {
                                    saveToActiveFile: false,
                                    loadScene: false,
                                    export: false,
                                    clearCanvas: true,
                                }
                            }}
                        />
                    </div>
                ) : (
                    <MarkdownEditor
                        value={markdownContent}
                        onChange={handleMarkdownChange}
                        readOnly={readOnly}
                        disableLocalStorage={false}
                    />
                )}
            </div>
        </div>
    );
}