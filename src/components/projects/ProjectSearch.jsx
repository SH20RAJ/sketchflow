'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from 'lucide-react';
import { debounce } from 'lodash';

export function ProjectSearch({ className }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('search') || '');
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchInputRef = useRef(null);

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

    // We don't need client-side filtering anymore as we're using server-side filtering

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
                    className={`pl-10 pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 h-10 ${className || ''}`}
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
        </div>
    );
}