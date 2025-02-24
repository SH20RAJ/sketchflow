'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { mutate } from 'swr';

export function CreateTagDialog({ open, onOpenChange }) {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('');
    const [color, setColor] = useState('#4F46E5');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Please enter a tag name');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/projects/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    emoji,
                    color
                })
            });

            if (!response.ok) throw new Error('Failed to create tag');

            await mutate('/api/projects/tags'); // Refresh tags list
            toast.success('Tag created successfully');
            onOpenChange(false);
            setName('');
            setEmoji('');
            setColor('#4F46E5');
        } catch (error) {
            console.error('Error creating tag:', error);
            toast.error('Failed to create tag');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Tag</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tag Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter tag name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="emoji">Emoji (optional)</Label>
                        <Input
                            id="emoji"
                            placeholder="Enter emoji"
                            value={emoji}
                            onChange={(e) => setEmoji(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <div className="flex gap-2">
                            <Input
                                id="color"
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-20 h-10 p-1"
                            />
                            <div
                                className="flex-1 rounded-md"
                                style={{ backgroundColor: color }}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
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
                </form>
            </DialogContent>
        </Dialog>
    );
} 