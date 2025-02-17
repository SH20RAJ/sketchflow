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

const layouts = [
    {
        id: 'split',
        name: 'Split View',
        icon: SplitSquareHorizontal,
    },
    {
        id: 'sketch',
        name: 'Canvas View',
        icon: Layout,
    },
    {
        id: 'markdown',
        name: 'Document View',
        icon: FileText,
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
    copyShareLink
}) {
    return (
        <div className="border-b px-3 h-12 flex items-center justify-between bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Link
                    href="/projects"
                    className="flex items-center hover:opacity-80 transition-opacity"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="rounded-md"
                    />
                </Link>
                {isEditingName ? (
                    <div className="flex items-center gap-1">
                        <Input
                            value={projectName}
                            onChange={handleNameChange}
                            className="w-[180px] h-8 text-sm"
                            autoFocus
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setIsEditingName(false)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <h1 className="text-sm font-medium text-gray-700">
                            {projectName}
                        </h1>
                        {isOwner && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => setIsEditingName(true)}
                            >
                                <Pencil className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}
                {isShared && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Globe className="w-3 h-3 mr-0.5" />
                        Shared
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border rounded-md p-0.5">
                    {layouts.map((l) => (
                        <Button
                            key={l.id}
                            size="sm"
                            variant={layout === l.id ? "default" : "ghost"}
                            onClick={() => setLayout(l.id)}
                            className="h-7 px-2"
                        >
                            <l.icon className="h-3 w-3" />
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-1">
                    {isOwner && (
                        <>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="h-7 px-2 text-xs"
                                size="sm"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Save className="h-3 w-3" />
                                )}
                            </Button>

                            <Dialog
                                open={showShareDialog}
                                onOpenChange={setShowShareDialog}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="h-7 px-2" size="sm">
                                        <Share2 className="h-3 w-3" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
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
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}