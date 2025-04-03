'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SortAsc, SortDesc, Plus } from 'lucide-react';
import useSWR from 'swr';
import { CreateTagDialog } from './CreateTagDialog';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ProjectFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showCreateTag, setShowCreateTag] = useState(false);

    const currentTag = searchParams.get('tagId') || 'all';
    const currentSort = searchParams.get('sortBy') || 'updatedAt';
    const currentOrder = searchParams.get('order') || 'desc';
    const currentPage = searchParams.get('page') || '1';

    const { data, error } = useSWR('/api/projects/tags', fetcher);
    const tags = data?.tags || [];

    const updateFilters = useCallback((updates) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.push(`/projects?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Select
                        value={currentTag}
                        onValueChange={(value) => updateFilters({ tagId: value })}
                    >
                        <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                            <SelectValue placeholder="Filter by tag" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                            {Array.isArray(tags) && tags.map((tag) => (
                                <SelectItem key={tag.id} value={tag.id}>
                                    <div className="flex items-center gap-2">
                                        {tag.emoji && <span>{tag.emoji}</span>}
                                        <span
                                            style={{ color: tag.color }}
                                            className="font-medium"
                                        >
                                            {tag.name}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={currentSort}
                        onValueChange={(value) => updateFilters({ sortBy: value })}
                    >
                        <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="updatedAt">Last Updated</SelectItem>
                            <SelectItem value="createdAt">Created Date</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2 col-span-2 sm:col-span-1 sm:justify-end">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateFilters({ order: currentOrder === 'asc' ? 'desc' : 'asc' })}
                            className="w-9 h-9 border-gray-200 hover:bg-gray-100 flex-1 sm:flex-none"
                            title={currentOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                        >
                            {currentOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowCreateTag(true)}
                            className="w-9 h-9 border-gray-200 hover:bg-gray-100 flex-1 sm:flex-none"
                            title="Create New Tag"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

            <CreateTagDialog open={showCreateTag} onOpenChange={setShowCreateTag} />
        </div>
    );
}