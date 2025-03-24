'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash, FolderOpen, Tag } from 'lucide-react';
import { toast } from 'sonner';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function TagManagePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states for create/edit
  const [tagName, setTagName] = useState('');
  const [tagEmoji, setTagEmoji] = useState('');
  const [tagColor, setTagColor] = useState('#4F46E5');

  const { data, error, isLoading: isLoadingTags } = useSWR(
    '/api/projects/tags',
    fetcher
  );

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/projects/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tagName.trim(),
          emoji: tagEmoji,
          color: tagColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create tag');
      }

      await mutate('/api/projects/tags');
      toast.success('Tag created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error(error.message || 'Failed to create tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTag = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/tags/${selectedTag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tagName.trim(),
          emoji: tagEmoji,
          color: tagColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tag');
      }

      await mutate('/api/projects/tags');
      toast.success('Tag updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error(error.message || 'Failed to update tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/tags/${selectedTag.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tag');
      }

      await mutate('/api/projects/tags');
      toast.success('Tag deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error(error.message || 'Failed to delete tag');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (tag) => {
    setSelectedTag(tag);
    setTagName(tag.name);
    setTagEmoji(tag.emoji || '');
    setTagColor(tag.color || '#4F46E5');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (tag) => {
    setSelectedTag(tag);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setTagName('');
    setTagEmoji('');
    setTagColor('#4F46E5');
    setSelectedTag(null);
  };

  const handleCreateDialogChange = (open) => {
    setIsCreateDialogOpen(open);
    if (!open) resetForm();
  };

  const handleEditDialogChange = (open) => {
    setIsEditDialogOpen(open);
    if (!open) resetForm();
  };

  if (status === 'loading' || isLoadingTags) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Tags</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Tags</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load tags. Please try again later.</span>
        </div>
      </div>
    );
  }

  const tags = data?.tags || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Tags</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Tag
        </Button>
      </div>

      {tags.length === 0 ? (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Tags Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't created any tags yet. Tags help you organize your projects.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <Card 
              key={tag.id} 
              className="group hover:shadow-md transition-all duration-200"
              style={{
                backgroundColor: `${tag.color}10` || '#F3F4F6',
                borderColor: `${tag.color}30` || '#E5E7EB'
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FolderOpen 
                      className="h-5 w-5" 
                      style={{ color: tag.color || '#374151' }} 
                    />
                    <CardTitle className="text-lg">
                      {tag.emoji && <span className="mr-1">{tag.emoji}</span>}
                      {tag.name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => openEditDialog(tag)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
                      onClick={() => openDeleteDialog(tag)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="outline"
                  style={{
                    color: tag.color || '#374151',
                    borderColor: `${tag.color}30` || '#E5E7EB'
                  }}
                >
                  {/* This would show the count of projects with this tag */}
                  0 projects
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Create a new tag to organize your projects.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTag} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name</Label>
              <Input
                id="name"
                placeholder="Enter tag name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji (optional)</Label>
              <Input
                id="emoji"
                placeholder="Enter emoji"
                value={tagEmoji}
                onChange={(e) => setTagEmoji(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <div
                  className="flex-1 rounded-md"
                  style={{ backgroundColor: tagColor }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading || !tagName.trim()}
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the details of your tag.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTag} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tag Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter tag name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-emoji">Emoji (optional)</Label>
              <Input
                id="edit-emoji"
                placeholder="Enter emoji"
                value={tagEmoji}
                onChange={(e) => setTagEmoji(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <div
                  className="flex-1 rounded-md"
                  style={{ backgroundColor: tagColor }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading || !tagName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Tag'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tag
              {selectedTag?.name && <strong> "{selectedTag.name}"</strong>} and remove it from all associated projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTag}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
