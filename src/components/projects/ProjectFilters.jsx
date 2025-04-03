'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
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
import { Search, SortAsc, SortDesc, Tags, Plus, Loader2, X } from 'lucide-react';
import useSWR from 'swr';
import { CreateTagDialog } from './CreateTagDialog';
import { debounce } from 'lodash';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ProjectFilters({ projects = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showCreateTag, setShowCreateTag] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('search') || '');
    const [isSearching, setIsSearching] = useState(false);
    const [clientFilteredProjects, setClientFilteredProjects] = useState([]);

    const currentTag = searchParams.get('tagId') || 'all';
    const currentSort = searchParams.get('sortBy') || 'updatedAt';
    const currentOrder = searchParams.get('order') || 'desc';
    const currentPage = searchParams.get('page') || '1';

    const { data, error } = useSWR('/api/projects/tags', fetcher);
    const tags = data?.tags || [];

    // Client-side filtering for immediate search results
    useEffect(() => {
        if (projects.length > 0 && localSearchQuery) {
            const filtered = projects.filter(project =>
                project.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                (project.description && project.description.toLowerCase().includes(localSearchQuery.toLowerCase()))
            );
            setClientFilteredProjects(filtered);
        } else {
            setClientFilteredProjects([]);
        }
    }, [localSearchQuery, projects]);

    // Debounced search function to update URL params
    const debouncedSearch = useRef(
        debounce((query) => {
            setIsSearching(true);
            updateFilters({ search: query, page: '1' });
            setTimeout(() => setIsSearching(false), 300); // Add a small delay to show loading state
        }, 500)
    ).current;

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setLocalSearchQuery(query);
        debouncedSearch(query);
    };

    // Clear search
    const handleClearSearch = () => {
        setLocalSearchQuery('');
        setSearchQuery('');
        updateFilters({ search: '', page: '1' });
    };

    const updateFilters = useCallback((updates) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // If we're updating search, update the state
        if ('search' in updates) {
            setSearchQuery(updates.search || '');
        }

        router.push(`/projects?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 w-full md:min-w-[200px]">
                    <div className="relative">
                        {isSearching ? (
                            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                        ) : (
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        )}
                        <Input
                            type="text"
                            placeholder="Search projects..."
                            value={localSearchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                        />
                        {localSearchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
                                onClick={handleClearSearch}
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </Button>
                        )}
                    </div>

                    {/* Client-side search results preview */}
                    {localSearchQuery && clientFilteredProjects.length > 0 && !isSearching && searchQuery !== localSearchQuery && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg p-2">
                            <div className="text-xs text-gray-500 mb-2 px-2">Quick results:</div>
                            {clientFilteredProjects.slice(0, 5).map(project => (
                                <div
                                    key={project.id}
                                    className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2"
                                    onClick={() => router.push(`/project/${project.id}`)}
                                >
                                    {project.emoji ? (
                                        <span className="text-lg">{project.emoji}</span>
                                    ) : (
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: project.projectTags?.[0]?.color || '#E5E7EB' }}
                                        ></div>
                                    )}
                                    <span className="font-medium">{project.name}</span>
                                </div>
                            ))}
                            {clientFilteredProjects.length > 5 && (
                                <div className="text-xs text-center text-blue-500 mt-1 pt-1 border-t">
                                    {clientFilteredProjects.length - 5} more results
                                </div>
                            )}
                        </div>
                    )}
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