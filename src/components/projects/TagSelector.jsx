'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Tag as TagIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function TagSelector({ projectId, initialTags = [], onTagsChange }) {
  const [tags, setTags] = useState(initialTags);
  const [availableTags, setAvailableTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [newTagEmoji, setNewTagEmoji] = useState('');

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setAvailableTags(data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    }
  };

  const handleAddTag = async (tag) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId: tag.id })
      });

      if (!response.ok) throw new Error('Failed to add tag');
      
      const updatedTags = [...tags, tag];
      setTags(updatedTags);
      onTagsChange?.(updatedTags);
      toast.success('Tag added successfully');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/tags/${tagId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove tag');

      const updatedTags = tags.filter(tag => tag.id !== tagId);
      setTags(updatedTags);
      onTagsChange?.(updatedTags);
      toast.success('Tag removed successfully');
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTagName.trim(),
          color: newTagColor,
          emoji: newTagEmoji
        })
      });

      if (!response.ok) throw new Error('Failed to create tag');

      const newTag = await response.json();
      setAvailableTags([...availableTags, newTag]);
      await handleAddTag(newTag);
      
      setNewTagName('');
      setNewTagEmoji('');
      setShowCreateTag(false);
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTags = availableTags
    .filter(tag => !tags.some(t => t.id === tag.id))
    .filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.emoji?.includes(searchQuery)
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            style={{
              backgroundColor: `${tag.color}15`,
              color: tag.color,
              borderColor: `${tag.color}30`
            }}
            className="group hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {tag.emoji && <span className="mr-1 opacity-90">{tag.emoji}</span>}
            {tag.name}
            <button
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-200"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowCreateTag(!showCreateTag)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {showCreateTag && (
          <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Emoji (optional)"
                value={newTagEmoji}
                onChange={(e) => setNewTagEmoji(e.target.value)}
                className="w-24"
              />
              <Input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-24 h-10 p-1"
              />
              <Button
                onClick={handleCreateTag}
                disabled={isLoading || !newTagName.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create Tag'
                )}
              </Button>
            </div>
          </div>
        )}

        {searchQuery && filteredTags.length > 0 && (
          <div className="p-2 border rounded-lg max-h-48 overflow-y-auto space-y-1">
            {filteredTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleAddTag(tag)}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2 transition-colors duration-200"
                disabled={isLoading}
              >
                {tag.emoji && <span>{tag.emoji}</span>}
                <span
                  className="flex-1"
                  style={{ color: tag.color }}
                >
                  {tag.name}
                </span>
                <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}