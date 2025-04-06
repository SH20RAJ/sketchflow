"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  Search, 
  ArrowLeft, 
  Loader2, 
  Globe, 
  SortAsc, 
  SortDesc, 
  Filter, 
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PublicProjectPagination } from "@/components/projects/PublicProjectPagination";
import { PublicProjectCard } from "@/components/projects/PublicProjectCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function PublicProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCloning, setIsCloning] = useState(false);
  const [cloningProjectId, setCloningProjectId] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [excludeOwn, setExcludeOwn] = useState(false);
  const searchInputRef = useRef(null);
  
  // Get filter parameters from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSortBy = searchParams.get('sortBy') || 'updatedAt';
  const currentOrder = searchParams.get('order') || 'desc';
  const currentExcludeOwn = searchParams.get('excludeOwn') === 'true';

  // Set page title
  useEffect(() => {
    document.title = 'Public Projects | SketchFlow';
    return () => {
      document.title = 'SketchFlow';
    };
  }, []);

  // Initialize state from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
    
    setExcludeOwn(currentExcludeOwn);
  }, [searchParams, searchQuery, currentExcludeOwn]);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);

      // Update URL with search query
      const params = new URLSearchParams(searchParams);
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      params.set('page', '1'); // Reset to first page on new search
      router.push(`/projects/public?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  // Handle filter changes
  const updateFilters = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    // Always reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/projects/public?${params.toString()}`);
  }, [router, searchParams]);

  // Construct API URL with all parameters
  const getApiUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', '9'); // 9 items per page (3x3 grid)
    params.set('sortBy', currentSortBy);
    params.set('order', currentOrder);
    params.set('excludeOwn', excludeOwn.toString());
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    
    return `/api/projects/public?${params.toString()}`;
  }, [currentPage, debouncedSearch, currentSortBy, currentOrder, excludeOwn]);

  // Fetch data with SWR
  const { data: publicProjectsData, error, isLoading, mutate } = useSWR(
    status === "authenticated" ? getApiUrl() : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 5000,
    }
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Handle project cloning
  const handleCloneProject = useCallback(async (projectId) => {
    setIsCloning(true);
    setCloningProjectId(projectId);
    
    try {
      const response = await fetch(`/api/projects/${projectId}/clone`, {
        method: 'POST',
      });

      if (response.status === 401) {
        setIsCloning(false);
        setCloningProjectId(null);
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clone project');
      }

      toast.success(data.message || 'Project cloned successfully');
      
      // Refresh the data
      await mutate();

      if (data.id) {
        router.push(`/project/${data.id}`);
      }
    } catch (error) {
      console.error('Clone error:', error);
      toast.error(error.message || 'Failed to clone project');
    } finally {
      setIsCloning(false);
      setCloningProjectId(null);
    }
  }, [router, mutate]);

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Skeleton className="h-10 w-full sm:w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex justify-between pt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Public Projects</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Error loading public projects. Please try again later.</p>
            <p className="text-sm text-red-500 mt-2">{error.message}</p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => mutate()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projects = publicProjectsData?.projects || [];
  const pagination = publicProjectsData?.pagination;
  const totalProjects = pagination?.totalItems || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Public Projects
            </h1>
            <Badge variant="outline" className="ml-2">
              {totalProjects} {totalProjects === 1 ? 'project' : 'projects'}
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">
            Discover and clone public projects from the community
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/projects")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search public projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 h-10 w-full"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Sort By */}
          <div className="col-span-1">
            <Select 
              value={currentSortBy} 
              onValueChange={(value) => updateFilters({ sortBy: value })}
            >
              <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200 h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort Order and Filters */}
          <div className="col-span-1 flex justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateFilters({ order: currentOrder === 'asc' ? 'desc' : 'asc' })}
              className="border-gray-200 hover:bg-gray-100 h-10 w-10"
              title={currentOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            >
              {currentOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
            
            <div className="flex items-center space-x-2 border border-gray-200 rounded-md px-3 h-10">
              <Checkbox 
                id="excludeOwn" 
                checked={excludeOwn}
                onCheckedChange={(checked) => {
                  setExcludeOwn(checked);
                  updateFilters({ excludeOwn: checked });
                }}
              />
              <Label 
                htmlFor="excludeOwn" 
                className="text-sm cursor-pointer"
              >
                Hide my projects
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <AnimatePresence mode="wait">
        {/* Empty State - No Projects */}
        {projects.length === 0 && !searchQuery && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="my-12"
          >
            <Card className="text-center p-8 sm:p-12 border-2 border-dashed bg-white/50 backdrop-blur-sm">
              <CardContent className="space-y-4 pt-4">
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg" />
                  <Globe className="relative h-16 w-16 mx-auto text-blue-500" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-gray-800">
                  No Public Projects Yet
                </p>
                <p className="text-gray-500 max-w-md mx-auto">
                  Be the first to share a project with the community! Make one of your projects public to get started.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => router.push("/projects")}
                >
                  Go to My Projects
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Empty State - Search Results */}
        {projects.length === 0 && searchQuery && (
          <motion.div
            key="empty-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="my-12"
          >
            <Card className="text-center p-8 sm:p-12 bg-white/50 backdrop-blur-sm">
              <CardContent className="space-y-4 pt-4">
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-lg" />
                  <Search className="relative h-16 w-16 mx-auto text-gray-400" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-gray-800">
                  No projects found
                </p>
                <p className="text-gray-500">
                  No public projects match your search "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleClearSearch}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Projects Grid */}
        {projects.length > 0 && (
          <motion.div
            key="projects"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={item} layout>
                <PublicProjectCard
                  project={project}
                  onClone={handleCloneProject}
                  isCloning={isCloning && cloningProjectId === project.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <PublicProjectPagination pagination={pagination} />
        </div>
      )}
    </div>
  );
}
