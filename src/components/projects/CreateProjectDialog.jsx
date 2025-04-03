'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Smile, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';

// Dynamically import the emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react').then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="h-[350px] w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
});

const fetcher = (url) => fetch(url).then((res) => res.json());

export function CreateProjectDialog({ open, onOpenChange }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [emoji, setEmoji] = useState('');
    const [color, setColor] = useState('#4F46E5');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch available tags
    const { data } = useSWR('/api/projects/tags', fetcher);
    const tags = data?.tags || [];

    // Generate a unique project name and theme
    const generateProjectTheme = useCallback(() => {
        const themes = [
            { category: 'Nature', adjectives: ['Verdant', 'Lush', 'Blooming', 'Wild', 'Natural', 'Serene'], nouns: ['Garden', 'Forest', 'Meadow', 'Mountain', 'River', 'Ocean'], emojis: ['🌿', '🌲', '🌺', '🏔️', '🌊', '🍃'], colors: ['#2E7D32', '#1B5E20', '#388E3C', '#00796B', '#0277BD', '#1565C0'] },
            { category: 'Space', adjectives: ['Cosmic', 'Stellar', 'Galactic', 'Celestial', 'Astral', 'Interstellar'], nouns: ['Nebula', 'Galaxy', 'Cosmos', 'Universe', 'Constellation', 'Orbit'], emojis: ['🌌', '✨', '🚀', '🌠', '🪐', '🌟'], colors: ['#311B92', '#4527A0', '#512DA8', '#283593', '#1A237E', '#0D47A1'] },
            { category: 'Tech', adjectives: ['Digital', 'Quantum', 'Neural', 'Cyber', 'Virtual', 'Innovative'], nouns: ['Network', 'System', 'Interface', 'Algorithm', 'Protocol', 'Framework'], emojis: ['💻', '🤖', '⚙️', '🔌', '📱', '🖥️'], colors: ['#0288D1', '#0097A7', '#00838F', '#006064', '#01579B', '#0D47A1'] },
            { category: 'Art', adjectives: ['Creative', 'Artistic', 'Vibrant', 'Expressive', 'Imaginative', 'Colorful'], nouns: ['Canvas', 'Masterpiece', 'Palette', 'Studio', 'Gallery', 'Exhibition'], emojis: ['🎨', '🖌️', '🖼️', '✏️', '📝', '🎭'], colors: ['#AD1457', '#C2185B', '#D81B60', '#8E24AA', '#6A1B9A', '#4A148C'] },
            { category: 'Business', adjectives: ['Strategic', 'Innovative', 'Dynamic', 'Efficient', 'Professional', 'Productive'], nouns: ['Venture', 'Enterprise', 'Solution', 'Strategy', 'Initiative', 'Project'], emojis: ['📊', '📈', '💼', '🏢', '📝', '🔍'], colors: ['#1565C0', '#0D47A1', '#01579B', '#006064', '#004D40', '#1B5E20'] },
            { category: 'Adventure', adjectives: ['Daring', 'Bold', 'Exciting', 'Thrilling', 'Adventurous', 'Intrepid'], nouns: ['Quest', 'Journey', 'Expedition', 'Voyage', 'Discovery', 'Exploration'], emojis: ['🧭', '🗺️', '🏕️', '⛰️', '🌄', '🧗‍♀️'], colors: ['#EF6C00', '#E65100', '#F57C00', '#FF8F00', '#FF6F00', '#F9A825'] }
        ];

        // Select a random theme
        const theme = themes[Math.floor(Math.random() * themes.length)];

        // Get random elements from the theme
        const randomAdjective = theme.adjectives[Math.floor(Math.random() * theme.adjectives.length)];
        const randomNoun = theme.nouns[Math.floor(Math.random() * theme.nouns.length)];
        const randomEmoji = theme.emojis[Math.floor(Math.random() * theme.emojis.length)];
        const randomColor = theme.colors[Math.floor(Math.random() * theme.colors.length)];

        return {
            name: `${randomAdjective} ${randomNoun}`,
            emoji: randomEmoji,
            color: randomColor
        };
    }, []);

    // Generate just a new name
    const generateProjectName = useCallback(() => {
        const adjectives = [
            'Amazing', 'Brilliant', 'Creative', 'Dynamic', 'Elegant', 'Fantastic',
            'Gorgeous', 'Harmonious', 'Innovative', 'Jubilant', 'Kinetic', 'Luminous',
            'Magnificent', 'Novel', 'Outstanding', 'Powerful', 'Quantum', 'Radiant',
            'Stellar', 'Transformative', 'Unique', 'Vibrant', 'Wonderful', 'Xenial',
            'Yielding', 'Zealous'
        ];

        const nouns = [
            'Adventure', 'Blueprint', 'Canvas', 'Discovery', 'Expedition', 'Framework',
            'Galaxy', 'Horizon', 'Insight', 'Journey', 'Kingdom', 'Landscape',
            'Masterpiece', 'Nexus', 'Odyssey', 'Panorama', 'Quest', 'Revelation',
            'Synthesis', 'Tapestry', 'Universe', 'Venture', 'Wonderland', 'Zenith'
        ];

        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${randomAdjective} ${randomNoun}`;
    }, []);

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            const theme = generateProjectTheme();
            setName(theme.name);
            setDescription('');
            setEmoji(theme.emoji);
            setColor(theme.color);
            setSelectedTags([]);
        }
    }, [open, generateProjectTheme]);

    const handleTagToggle = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter a project name');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    description,
                    emoji,
                    color,
                    tagIds: selectedTags.length > 0 ? selectedTags : undefined
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create project');
            }

            const newProject = await response.json();
            toast.success('Project created successfully');

            // Close the dialog and redirect to the new project
            onOpenChange(false);
            router.push(`/project/${newProject.id}`);
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error(error.message || 'Failed to create project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                        <div>
                            <div className="mb-2">
                                <Label htmlFor="emoji">Icon</Label>
                                <div className="mt-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-12 h-12 text-2xl"
                                                aria-label="Select emoji"
                                            >
                                                {emoji || <Smile className="h-6 w-6 text-gray-400" />}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <EmojiPicker
                                                onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)}
                                                width="100%"
                                                height="350px"
                                                previewConfig={{ showPreview: false }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="color">Color</Label>
                                <div className="mt-1">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-12 h-12 p-1 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="name"
                                        placeholder="Enter project name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="flex-shrink-0"
                                        onClick={() => {
                                            const theme = generateProjectTheme();
                                            setName(theme.name);
                                            setEmoji(theme.emoji);
                                            setColor(theme.color);
                                        }}
                                        title="Generate new theme"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter project description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {tags.length > 0 && (
                        <div className="space-y-2">
                            <Label>Tags (optional)</Label>
                            <div className="flex flex-wrap gap-2 p-2 border rounded-md max-h-24 overflow-y-auto">
                                {tags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => handleTagToggle(tag.id)}
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                            selectedTags.includes(tag.id)
                                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                                        }`}
                                        style={
                                            selectedTags.includes(tag.id) && tag.color
                                                ? {
                                                    backgroundColor: `${tag.color}20`,
                                                    color: tag.color,
                                                    borderColor: `${tag.color}40`
                                                }
                                                : {}
                                        }
                                    >
                                        {tag.emoji && <span className="mr-1">{tag.emoji}</span>}
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
