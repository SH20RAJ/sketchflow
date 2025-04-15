"use client";

import React, { useState, useCallback, useEffect, Suspense, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ExcalidrawLibraryPanel } from "./ExcalidrawLibraryPanel";
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
    FileText,
    ChevronDown,
    Menu,
    GitFork,
    Tag,
    Plus,
    Library
} from "lucide-react";
import { signIn } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MarkdownEditor } from "./MarkdownEditor";
import { useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
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
    const [showLibraryPanel, setShowLibraryPanel] = useState(false);
    const excalidrawRef = useRef(null);

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
        signIn('google', { callbackUrl: window.location.href });
        toast.info('Redirecting to Google Sign-in...', {
            description: 'Please sign in to save your work'
        });
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Navbar */}
            <div className="border-b h-12 flex items-center justify-between bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                {/* Left Section */}
                <div className="flex items-center gap-2 px-2">
                    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity p-1.5">
                        <Image src="/logo.png" alt="Logo" width={24} height={24} className="rounded-md" />
                    </Link>

                    <div className="h-6 w-px bg-gray-200 mx-1" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm font-medium text-gray-700">
                                {projectName}
                                <ChevronDown className="h-3 w-3 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-72">
                            <div className="p-2 space-y-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Project Name</label>
                                    <Input
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="h-8 text-sm"
                                        placeholder="Enter project name"
                                    />
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Center Section - Layout Controls */}
                <div className="flex items-center gap-1 border rounded-md p-0.5 bg-gray-50/50">
                    <Button
                        size="sm"
                        variant={layout === "split" ? "default" : "ghost"}
                        onClick={() => setLayout("split")}
                        className={`h-7 gap-2 px-3 text-xs font-medium ${layout === "split" ? 'bg-white hover:bg-gray-50 text-black shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                        aria-label="Switch to Split View"
                        aria-pressed={layout === "split"}
                    >
                        <SplitSquareHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Split View</span>
                    </Button>
                    <Button
                        size="sm"
                        variant={layout === "canvas" ? "default" : "ghost"}
                        onClick={() => setLayout("canvas")}
                        className={`h-7 gap-2 px-3 text-xs font-medium ${layout === "canvas" ? 'bg-white hover:bg-gray-50 text-black shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                        aria-label="Switch to Canvas View"
                        aria-pressed={layout === "canvas"}
                    >
                        <Layout className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Canvas View</span>
                    </Button>
                    <Button
                        size="sm"
                        variant={layout === "markdown" ? "default" : "ghost"}
                        onClick={() => setLayout("markdown")}
                        className={`h-7 gap-2 px-3 text-xs font-medium ${layout === "markdown" ? 'bg-white hover:bg-gray-50 text-black shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                        aria-label="Switch to Document View"
                        aria-pressed={layout === "markdown"}
                    >
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Document View</span>
                    </Button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 px-2">
                    <Button
                        onClick={handleSave}
                        size="sm"
                        className="h-8 gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4"
                        aria-label="Sign in with Google"
                    >
                        <Globe className="h-3.5 w-3.5" aria-hidden="true" />

                        <span className="text-xs">Sign in with Google</span>
                    </Button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden">
                {layout === "split" ? (
                    <ResizablePanelGroup direction={layout === "split" ? "horizontal" : "vertical"} className="rounded-lg">
                        <ResizablePanel defaultSize={layout === "split" ? 30 : 100} minSize={30} className={`min-h-0 ${layout === "canvas" ? "hidden" : ""}`}>
                            <div className="h-full overflow-auto">
                                <MarkdownEditor
                                    value={markdownContent}
                                    onChange={handleMarkdownChange}
                                    readOnly={readOnly}
                                    disableLocalStorage={false}
                                />
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={layout === "split" ? 70 : 100} minSize={30} className={`min-h-0 ${layout === "markdown" ? "hidden" : ""}`}>
                            <div className="h-full">
                                <div className="relative h-full">
                                    <Excalidraw
                                        ref={excalidrawRef}
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
                            </div>
                        </ResizablePanel>

                    </ResizablePanelGroup>
                ) : layout === "canvas" ? (
                    <div className="h-full">
                        <div className="relative h-full">
                            <Excalidraw
                                ref={excalidrawRef}
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