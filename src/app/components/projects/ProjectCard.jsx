import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Check, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ProjectCard = ({ project, onDelete }) => {
  const router = useRouter();
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(project.tags?.map(tag => tag.id) || []);
  const [availableTags, setAvailableTags] = useState([]);

  const handleAddTagsClick = async () => {
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const tags = await response.json();
      setAvailableTags(tags);
      setIsTagDialogOpen(true);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    }
  };

  const handleTagSelection = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSaveTags = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagIds: selectedTags }),
      });

      if (!response.ok) throw new Error('Failed to update tags');

      toast.success('Tags updated successfully');
      setIsTagDialogOpen(false);
    } catch (error) {
      console.error('Error updating tags:', error);
      toast.error('Failed to update tags');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {project.tags?.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              style={{
                backgroundColor: `${tag.color}15` || '#E5E7EB15',
                color: tag.color || '#374151',
                borderColor: `${tag.color}30` || '#E5E7EB30'
              }}
              className="hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {tag.emoji && <span className="mr-1 opacity-90">{tag.emoji}</span>}
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/80 transition-all duration-200 flex-1 mr-2 rounded-md shadow-sm"
          onClick={handleAddTagsClick}
        >
          <Tag className="h-3.5 w-3.5 mr-2" />
          Manage Tags
        </Button>
      </CardFooter>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Select tags to add to this project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => handleTagSelection(tag.id)}
              >
                <div className="w-4 h-4 border rounded flex items-center justify-center">
                  {selectedTags.includes(tag.id) && (
                    <Check className="w-3 h-3" />
                  )}
                </div>
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTags}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectCard;