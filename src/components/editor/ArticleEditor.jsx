'use client';

import { useState, useCallback, useEffect } from 'react';
import { MarkdownEditor } from './MarkdownEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Save, Share2 } from 'lucide-react';

export function ArticleEditor({
  initialContent = '',
  initialTitle = '',
  onSave,
  onPublish,
  isPublished = false,
}) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle content changes
  const handleContentChange = useCallback((newContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  }, []);

  // Handle title changes
  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  }, []);

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.({ title, content });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish handler
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish?.({ title, content });
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  // Setup beforeunload event listener
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b p-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Article Title"
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing || !title}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {isPublished ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <MarkdownEditor
          content={content}
          onChange={handleContentChange}
        />
      </div>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowExitDialog(false);
                // Handle exit logic here
              }}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}