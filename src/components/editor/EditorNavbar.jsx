'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
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
    GitFork,
    Download,
    Upload,
    FileJson,
    Users,
    UserPlus,
    Activity,
    Clock,
    RefreshCw
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
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { debounce } from "lodash";
import { CollaboratorsDialog } from "@/components/collaboration/CollaboratorsDialog";
import { ActivityFeed } from "@/components/collaboration/ActivityFeed";



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
    handleNameChange,
    isOwner,
    isShared,
    isCollaborator = false,
    collaboratorRole = null,
    autoSaveEnabled = true,
    setAutoSaveEnabled = () => {},
    lastSaved = null,
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
    handleDescriptionChange,
    autoSaveStatus,
    handleSync
}) {
    const [isCloning, setIsCloning] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importData, setImportData] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState('');
    const [showCollaboratorsDialog, setShowCollaboratorsDialog] = useState(false);
    const [showActivityFeed, setShowActivityFeed] = useState(false);



    // Export project as JSON
    const handleExportProject = async () => {
        console.log('Export project called', { projectId, projectName, projectDescription });

        try {
            // Fetch the latest project data
            const response = await fetch(`/api/projects/${projectId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project data for export');
            }

            const projectData = await response.json();
            console.log('Fetched project data for export:', projectData);

            // Create a JSON object with all project data
            const exportData = {
                name: projectName || 'Untitled Project',
                description: projectDescription || '',
                content: projectData.markdown?.content || '',
                diagram: projectData.diagram?.content || '',
                tags: projectData.projectTags || [],
                exportedAt: new Date().toISOString(),
                version: '1.0'
            };

            console.log('Export data prepared:', exportData);

            // Convert to JSON string
            const jsonString = JSON.stringify(exportData, null, 2);

            // Create a blob and download link
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Create download link and trigger download
            const a = document.createElement('a');
            a.href = url;
            const filename = `${(projectName || 'untitled').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
            a.download = filename;
            console.log('Downloading file:', filename);

            // Append to body, click, and remove
            document.body.appendChild(a);
            setTimeout(() => {
                a.click();
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success('Project exported successfully');
                }, 100);
            }, 0);
        } catch (error) {
            console.error('Export error:', error);
            toast.error(`Failed to export project: ${error.message}`);
        }
    };

    // Import project from JSON
    const handleImportProject = async (createNew = false) => {
        setIsImporting(true);
        setImportError('');

        try {
            // Parse the JSON data
            const parsedData = JSON.parse(importData);
            console.log('Parsed import data:', parsedData);

            // Validate the imported data
            if (!parsedData.name || !parsedData.content) {
                throw new Error('Invalid project data format: Missing name or content');
            }

            if (createNew) {
                // Create a new project with the imported data
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: parsedData.name,
                        description: parsedData.description || '',
                        markdown: parsedData.content, // Use markdown field for content
                        diagram: parsedData.diagram || '',
                        tags: parsedData.tags || []
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create project');
                }

                toast.success('Project imported and created successfully');

                // Redirect to the new project
                if (data.id) {
                    window.location.replace(`/project/${data.id}`);
                }
            } else {
                // Update the current project with the imported data
                // First save the current state to avoid conflicts
                await handleSave();

                console.log('Updating project with imported data:', {
                    projectId,
                    name: parsedData.name,
                    description: parsedData.description || projectDescription,
                    content: parsedData.content,
                    diagram: parsedData.diagram || ''
                });

                // Update the project data
                const response = await fetch(`/api/projects/${projectId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: parsedData.name,
                        description: parsedData.description || projectDescription,
                        content: parsedData.content,
                        diagram: parsedData.diagram || ''
                    }),
                });

                const responseData = await response.json();
                console.log('Update response:', responseData);

                if (!response.ok) {
                    throw new Error(responseData.error || 'Failed to update project');
                }

                toast.success('Project updated with imported data');

                // Reload the page to show the updated project
                window.location.reload();
            }

            setShowImportDialog(false);
        } catch (error) {
            console.error('Import error:', error);
            setImportError(error.message || 'Failed to import project');
            toast.error(error.message || 'Failed to import project');
        } finally {
            setIsImporting(false);
        }
    };

    // Handle file upload for import
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                setImportData(e.target.result);
                setImportError('');
                // Validate JSON format
                JSON.parse(e.target.result);
            } catch (error) {
                setImportError('Invalid JSON file format');
            }
        };
        reader.readAsText(file);
    };

    // Tag management is handled elsewhere

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
                        src="/logo.png"
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
                                Save changes {lastSaved && `(Last: ${new Date(lastSaved).toLocaleTimeString()})`}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                                className="h-9"
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                {autoSaveEnabled ? 'Disable Auto-save' : 'Enable Auto-save'}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleSync}
                                className="h-9"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync with Server
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <h1 className="px-2 py-1 text-sm font-semibold text-gray-500">Collaboration</h1>
                            <DropdownMenuItem onClick={() => setShowCollaboratorsDialog(true)} className="h-9">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Collaborators
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowActivityFeed(true)} className="h-9">
                                <Activity className="h-4 w-4 mr-2" />
                                View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <h1 className="px-2 py-1 text-sm font-semibold text-gray-500">Beta Features</h1>
                            <DropdownMenuItem onClick={handleExportProject} className="h-9">
                                <Download className="h-4 w-4 mr-2" />
                                Export as JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowImportDialog(true)} className="h-9">
                                <Upload className="h-4 w-4 mr-2" />
                                Import from JSON
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
                {/* Show save button for owner or editor collaborators */}
                {(isOwner || (isCollaborator && collaboratorRole === 'EDITOR')) ? (
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
                                    <span className="text-xs">
                                        {autoSaveStatus === 'saving' ? 'Saving...' :
                                            autoSaveStatus === 'error' ? 'Save failed' :
                                                autoSaveStatus === 'unsaved' ? 'Save' :
                                                    `Save ${lastSaved ? new Date(lastSaved).toLocaleTimeString() : ''}`}
                                    </span>
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

                        {/* Import Dialog */}
                        <Dialog
                            open={showImportDialog}
                            onOpenChange={setShowImportDialog}
                        >
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Import Project</DialogTitle>
                                    <DialogDescription>
                                        Import a project from a JSON file. You can either update this project or create a new one.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Upload JSON file
                                        </label>
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                type="file"
                                                accept=".json"
                                                onChange={handleFileUpload}
                                                className="cursor-pointer"
                                            />
                                            {importError && (
                                                <p className="text-sm text-red-500">{importError}</p>
                                            )}
                                        </div>
                                    </div>

                                    {importData && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Preview
                                            </label>
                                            <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-auto max-h-[200px]">
                                                <pre>{importData.substring(0, 500)}{importData.length > 500 ? '...' : ''}</pre>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowImportDialog(false)}
                                            disabled={isImporting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => handleImportProject(false)}
                                            disabled={!importData || isImporting}
                                            className="gap-2"
                                        >
                                            {isImporting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Importing...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4" />
                                                    Update Current Project
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => handleImportProject(true)}
                                            disabled={!importData || isImporting}
                                            variant="secondary"
                                            className="gap-2"
                                        >
                                            <FileJson className="h-4 w-4" />
                                            Create New Project
                                        </Button>
                                    </div>
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

            {/* Collaboration Components */}
            {showCollaboratorsDialog && (
                <CollaboratorsDialog
                    projectId={projectId}
                    isOwner={isOwner}
                    open={showCollaboratorsDialog}
                    onOpenChange={setShowCollaboratorsDialog}
                />
            )}

            {showActivityFeed && (
                <ActivityFeed
                    projectId={projectId}
                    open={showActivityFeed}
                    onOpenChange={setShowActivityFeed}
                />
            )}
        </div>
    );
}