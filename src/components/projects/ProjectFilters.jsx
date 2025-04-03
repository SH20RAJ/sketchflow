'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SortAsc, SortDesc, Tags, Plus } from 'lucide-react';
import useSWR from 'swr';
import { CreateTagDialog } from './CreateTagDialog';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ProjectFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showCreateTag, setShowCreateTag] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    const currentTag = searchParams.get('tagId') || 'all';
    const currentSort = searchParams.get('sortBy') || 'updatedAt';
    const currentOrder = searchParams.get('order') || 'desc';

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

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateFilters({ search: searchQuery });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, updateFilters]);

    return (
        <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 w-full md:min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                    <Select
                        value={currentTag}
                        onValueChange={(value) => updateFilters({ tagId: value })}
                    >
                        <SelectTrigger className="w-full md:w-[180px] border-gray-200 focus:border-blue-300 focus:ring-blue-200">
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
                        <SelectTrigger className="w-full md:w-[150px] border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="updatedAt">Last Updated</SelectItem>
                            <SelectItem value="createdAt">Created Date</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateFilters({ order: currentOrder === 'asc' ? 'desc' : 'asc' })}
                        className="w-9 h-9 border-gray-200 hover:bg-gray-100"
                        title={currentOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                    >
                        {currentOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowCreateTag(true)}
                        className="w-9 h-9 border-gray-200 hover:bg-gray-100"
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