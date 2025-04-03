'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Plus, X, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function AddTagToProjectDialog({ open, onOpenChange, project }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateTag, setShowCreateTag] = useState(false);

    // States for creating a new tag
    const [newTagName, setNewTagName] = useState('');
    const [newTagEmoji, setNewTagEmoji] = useState('');
    const [newTagColor, setNewTagColor] = useState('#4F46E5');

    // Fetch all available tags
    const { data, error, isLoading: isLoadingTags } = useSWR('/api/projects/tags', fetcher);
    const allTags = data?.tags || [];

    // Initialize selected tags with project's current tags
    useEffect(() => {
        if (project && project.projectTags) {
            setSelectedTags(project.projectTags);
        }
    }, [project]);

    // Filter tags based on search query and exclude already selected ones
    const filteredTags = allTags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedTags.some(st => st.id === tag.id)
    );

    const handleAddTag = async (tag) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${project.id}/tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tagId: tag.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to add tag to project');
            }

            setSelectedTags([...selectedTags, tag]);
            toast.success(`Added "${tag.name}" tag to project`);

            // Refresh projects data
            await mutate(`/api/projects?tagId=&sortBy=updatedAt&order=desc&search=`);
        } catch (error) {
            console.error('Error adding tag to project:', error);
            toast.error(error.message || 'Failed to add tag to project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveTag = async (tagId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${project.id}/tags/${tagId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove tag from project');
            }

            setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
            toast.success('Tag removed from project');

            // Refresh projects data
            await mutate(`/api/projects?tagId=&sortBy=updatedAt&order=desc&search=`);
        } catch (error) {
            console.error('Error removing tag from project:', error);
            toast.error(error.message || 'Failed to remove tag from project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) {
            toast.error('Please enter a tag name');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/projects/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newTagName.trim(),
                    emoji: newTagEmoji,
                    color: newTagColor
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create tag');
            }

            const newTag = await response.json();

            // Add the new tag to the project
            await handleAddTag(newTag);

            // Reset form and close create tag view
            setNewTagName('');
            setNewTagEmoji('');
            setNewTagColor('#4F46E5');
            setShowCreateTag(false);

            // Refresh tags list
            await mutate('/api/projects/tags');

            toast.success('Tag created and added to project');
        } catch (error) {
            console.error('Error creating tag:', error);
            toast.error(error.message || 'Failed to create tag');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Tags for {project?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {isLoadingTags ? (
                            <div className="flex items-center text-gray-500 text-sm">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading tags...
                            </div>
                        ) : selectedTags.length > 0 ? (
                            selectedTags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    style={{
                                        backgroundColor: `${tag.color}15` || '#E5E7EB15',
                                        color: tag.color || '#374151',
                                        borderColor: `${tag.color}30` || '#E5E7EB30'
                                    }}
                                    className="group hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full"
                                >
                                    {tag.emoji && <span className="mr-1 opacity-90">{tag.emoji}</span>}
                                    {tag.name}
                                    <button
                                        onClick={() => handleRemoveTag(tag.id)}
                                        className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-200"
                                        disabled={isLoading}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm">No tags assigned to this project</div>
                        )}
                    </div>

                    <div className="relative">
                        {isLoading ? (
                            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                        ) : (
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        )}
                        <Input
                            type="text"
                            placeholder={isLoading ? "Processing..." : "Search tags..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            disabled={isLoading || isLoadingTags}
                        />
                    </div>

                    {searchQuery && !isLoadingTags && (
                        <div className="p-2 border rounded-lg max-h-48 overflow-y-auto space-y-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : filteredTags.length > 0 ? (
                                filteredTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => handleAddTag(tag)}
                                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200"
                                        disabled={isLoading}
                                    >
                                        {tag.emoji ? (
                                            <span>{tag.emoji}</span>
                                        ) : (
                                            <Tag className="h-4 w-4 text-gray-400" />
                                        )}
                                        <span
                                            className="flex-1"
                                            style={{ color: tag.color }}
                                        >
                                            {tag.name}
                                        </span>
                                        <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No matching tags found
                                </div>
                            )}
                        </div>
                    )}



                    {!showCreateTag ? (
                        <div className="flex justify-between mt-4">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Done
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowCreateTag(true)}
                                disabled={isLoading}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Tag
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 border-t pt-4 mt-4">
                            <h3 className="font-medium">Create New Tag</h3>
                            <div className="space-y-2">
                                <Label htmlFor="new-tag-name">Tag Name</Label>
                                <Input
                                    id="new-tag-name"
                                    placeholder="Enter tag name"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-tag-emoji">Emoji (optional)</Label>
                                <Input
                                    id="new-tag-emoji"
                                    placeholder="Enter emoji"
                                    value={newTagEmoji}
                                    onChange={(e) => setNewTagEmoji(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-tag-color">Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="new-tag-color"
                                        type="color"
                                        value={newTagColor}
                                        onChange={(e) => setNewTagColor(e.target.value)}
                                        className="w-20 h-10 p-1"
                                    />
                                    <div
                                        className="flex-1 rounded-md"
                                        style={{ backgroundColor: newTagColor }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateTag(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateTag}
                                    disabled={isLoading || !newTagName.trim()}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Tag'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
