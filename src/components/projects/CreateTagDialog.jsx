'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { mutate } from 'swr';

// Dynamically import the emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react').then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="h-[350px] w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
});

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
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="emoji"
                                    placeholder="Select or type emoji"
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    className="pr-10"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
                                        >
                                            <Smile className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="end">
                                        <EmojiPicker
                                            onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)}
                                            width="100%"
                                            height="350px"
                                            previewConfig={{ showPreview: false }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {emoji && (
                                <div className="flex items-center justify-center w-10 h-10 text-2xl border rounded-md">
                                    {emoji}
                                </div>
                            )}
                        </div>
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