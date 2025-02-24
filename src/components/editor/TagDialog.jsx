'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { Tag, Plus, Loader2, Save } from 'lucide-react';

export function TagDialog({ open, onOpenChange, projectId, onTagsUpdated, editTag }) {
  if (!open) return null;
  const [tag, setTag] = useState({ name: '', emoji: '', color: '#e2e8f0' });
  const [isProcessing, setIsProcessing] = useState(false);
  const isEditMode = !!editTag;

  useEffect(() => {
    if (editTag) {
      setTag(editTag);
    } else {
      setTag({ name: '', emoji: '', color: '#e2e8f0' });
    }
  }, [editTag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tag.name) {
      toast.error('Tag name is required');
      return;
    }

    setIsProcessing(true);
    try {
      const url = isEditMode
        ? `/api/projects/${projectId}/tags/${editTag.id}`
        : `/api/projects/${projectId}/tags`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag),
      });

      if (!response.ok) throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} tag`);

      const data = await response.json();
      toast.success(`Tag ${isEditMode ? 'updated' : 'created'} successfully`);
      onTagsUpdated?.(data);
      setTag({ name: '', emoji: '', color: '#e2e8f0' });
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} tag`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tag Name</label>
            <Input
              value={tag.name}
              onChange={(e) => setTag({ ...tag, name: e.target.value })}
              placeholder="Enter tag name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Emoji (optional)</label>
            <Input
              value={tag.emoji}
              onChange={(e) => setTag({ ...tag, emoji: e.target.value })}
              placeholder="Enter an emoji"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tag.color}
                onChange={(e) => setTag({ ...tag, color: e.target.value })}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <Input
                value={tag.color}
                onChange={(e) => setTag({ ...tag, color: e.target.value })}
                placeholder="#e2e8f0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isEditMode ? 'Save Changes' : 'Create Tag'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}