'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from 'lucide-react';
import { debounce } from 'lodash';

export function ProjectSearch({ projects = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('search') || '');
    const [isSearching, setIsSearching] = useState(false);
    const [clientFilteredProjects, setClientFilteredProjects] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchInputRef = useRef(null);

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
            updateSearchParams(query);
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
        updateSearchParams('');
    };

    // Update search params
    const updateSearchParams = (search) => {
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Reset to first page on new search
        router.push(`/projects?${params.toString()}`);
    };

    // Handle focus and blur events
    const handleFocus = () => {
        setShowResults(true);
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full max-w-md" ref={searchInputRef}>
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
                    onFocus={handleFocus}
                    className="pl-10 pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 h-10"
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
            {showResults && localSearchQuery && clientFilteredProjects.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg p-2">
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
    );
}