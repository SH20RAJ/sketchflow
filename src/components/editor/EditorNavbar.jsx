'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Pencil,
    Save,
    X,
    Share2,
    Copy,
    Globe,
    Loader2,
    Layout,
    SplitSquareHorizontal,
    FileText,
    ChevronDown,
    Menu,
    GitFork,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import { useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

const layouts = [
    {
        id: 'split',
        name: 'Split View',
        icon: SplitSquareHorizontal,
        description: 'Edit markdown and sketch simultaneously'
    },
    {
        id: 'sketch',
        name: 'Canvas View',
        icon: Layout,
        description: 'Full screen whiteboard'
    },
    {
        id: 'markdown',
        name: 'Document View',
        icon: FileText,
        description: 'Focus on writing'
    }
];

export function EditorNavbar({
    projectName,
    isEditingName,
    setIsEditingName,
    handleNameChange,
    isOwner,
    isShared,
    layout,
    setLayout,
    handleSave,
    isSaving,
    showShareDialog,
    setShowShareDialog,
    toggleShare,
    isSharing,
    projectId,
    copyShareLink,
    projectDescription,
    handleDescriptionChange
}) {
    const [isCloning, setIsCloning] = useState(false);

    const handleCloneProject = async () => {
        setIsCloning(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/clone`, {
                method: 'POST',
            });

            const data = await response.json();

            if (response.status === 401) {
                setIsCloning(false);
                signIn(undefined, { callbackUrl: window.location.href });
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to clone project');
            }

            toast.success(data.message || 'Project cloned successfully');

            // Redirect to the new project
            if (data.id) {
                window.location.replace(`/project/${data.id}`);
            } else {
                throw new Error('No project ID received');
            }
        } catch (error) {
            console.error('Clone error:', error);
            toast.error(error.message || 'Failed to clone project. Please try again.');
        } finally {
            setIsCloning(false);
        }
    };

    return (
        <div className="border-b h-12 flex items-center justify-between bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {/* Left Section */}
            <div className="flex items-center gap-2 px-2">
                <Link
                    href="/projects"
                    className="flex items-center hover:opacity-80 transition-opacity p-1.5"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="rounded-md"
                    />
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
                        {isOwner && (
                            <>
                                <div className="p-2 space-y-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Project Name</label>
                                        <Input
                                            value={projectName}
                                            onChange={handleNameChange}
                                            className="h-8 text-sm"
                                            placeholder="Enter project name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={projectDescription}
                                            onChange={handleDescriptionChange}
                                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] resize-none"
                                            placeholder="Add a project description..."
                                        />
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <div className="p-1">
                            <DropdownMenuItem onClick={() => setShowShareDialog(true)} className="h-9">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share project
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSave} disabled={isSaving} className="h-9">
                                <Save className="h-4 w-4 mr-2" />
                                Save changes
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {isShared && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Globe className="w-3 h-3 mr-0.5" />
                        Shared
                    </span>
                )}
            </div>

            {/* Center Section - View Modes */}
            <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1 border rounded-md p-0.5 bg-gray-50/50">
                    {layouts.map((l) => (
                        <Button
                            key={l.id}
                            size="sm"
                            variant={layout === l.id ? "default" : "ghost"}
                            onClick={() => setLayout(l.id)}
                            className={`h-7 gap-2 px-3 text-xs font-medium ${layout === l.id
                                ? 'bg-white hover:bg-gray-50 text-black shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <l.icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{l.name}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 px-2">
                {isOwner ? (
                    <>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span className="text-xs">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-3.5 w-3.5" />
                                    <span className="text-xs">Save</span>
                                </>
                            )}
                        </Button>

                        <Dialog
                            open={showShareDialog}
                            onOpenChange={setShowShareDialog}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-2"
                                >
                                    <Share2 className="h-3.5 w-3.5" />
                                    <span className="text-xs">Share</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Share Project</DialogTitle>
                                    <DialogDescription>
                                        Anyone with the link can view this project when sharing
                                        is enabled.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium">
                                                Share with anyone
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {isShared
                                                    ? "Project is publicly accessible"
                                                    : "Project is private"}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={isShared}
                                            onCheckedChange={toggleShare}
                                            disabled={isSharing}
                                        />
                                    </div>
                                    {isShared && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Share link
                                            </label>
                                            <div className="flex gap-2">
                                                <Input
                                                    readOnly
                                                    value={`${window.location.origin}/project/${projectId}`}
                                                />
                                                <Button onClick={copyShareLink}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : isShared && (
                    <Button
                        onClick={handleCloneProject}
                        disabled={isCloning}
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-2"
                    >
                        {isCloning ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span className="text-xs">Cloning...</span>
                            </>
                        ) : (
                            <>
                                <GitFork className="h-3.5 w-3.5" />
                                <span className="text-xs">Clone Project</span>
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}