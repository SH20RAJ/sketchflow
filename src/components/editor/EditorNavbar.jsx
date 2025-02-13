'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Layout,
    SplitSquareHorizontal,
    FileText,
    Share2,
    Copy,
    Globe,
    Lock,
    Menu
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const layouts = [
    {
        id: 'canvas',
        name: 'Canvas View',
        icon: Layout,
        description: 'Full canvas for diagramming'
    },
    {
        id: 'split',
        name: 'Split View',
        icon: SplitSquareHorizontal,
        description: 'Canvas with documentation'
    },
    {
        id: 'document',
        name: 'Document View',
        icon: FileText,
        description: 'Full documentation view'
    }
];

export function EditorNavbar({
    currentLayout,
    onLayoutChange,
    isShared,
    onShareToggle,
    onCopyLink,
    projectName,
    isOwner
}) {
    return (
        <div className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-14 items-center px-4 gap-4">
                <div className="flex items-center gap-2 md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            {layouts.map((layout) => (
                                <DropdownMenuItem
                                    key={layout.id}
                                    onClick={() => onLayoutChange(layout.id)}
                                    className="flex items-center gap-2"
                                >
                                    <layout.icon className="h-4 w-4" />
                                    <span>{layout.name}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="font-medium text-sm">{projectName}</span>
                </div>

                <div className="hidden md:flex items-center gap-1">
                    {layouts.map((layout) => (
                        <Button
                            key={layout.id}
                            variant={currentLayout === layout.id ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => onLayoutChange(layout.id)}
                            className={cn(
                                "gap-2",
                                currentLayout === layout.id && "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                            )}
                        >
                            <layout.icon className="h-4 w-4" />
                            <span>{layout.name}</span>
                        </Button>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {isOwner && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onShareToggle}
                            className="gap-2"
                        >
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                            {isShared ? (
                                <Globe className="h-4 w-4 text-green-500" />
                            ) : (
                                <Lock className="h-4 w-4 text-gray-500" />
                            )}
                        </Button>
                    )}
                    {isShared && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onCopyLink}
                            className="gap-2"
                        >
                            <Copy className="h-4 w-4" />
                            <span className="hidden sm:inline">Copy Link</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
} 