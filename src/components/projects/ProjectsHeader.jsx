'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Plus, Settings, LogOut, SortAsc, SortDesc } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signOut } from 'next-auth/react';
import { ProjectSearch } from '@/components/projects/ProjectSearch';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { CreateTagDialog } from '@/components/projects/CreateTagDialog';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ProjectsHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const currentTag = searchParams.get('tagId') || 'all';
  const currentSort = searchParams.get('sortBy') || 'updatedAt';
  const currentOrder = searchParams.get('order') || 'desc';
  const { data } = useSWR('/api/projects/tags', fetcher);
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 py-4 px-4 -mx-4 mb-6 shadow-sm">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top section: Title, Search, and Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-80 lg:w-96">
              <ProjectSearch />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <Button
                className="hidden md:flex gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 transition-transform hover:scale-105 border-2 border-gray-100">
                    <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">{session?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-gray-500">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/projects/settings')} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Bottom section: Filters and Sorting */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Tag Filter */}
            <div className="col-span-2 md:col-span-1">
              <Select value={currentTag} onValueChange={(value) => updateFilters({ tagId: value })}>
                <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200 h-10">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {Array.isArray(tags) && tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        {tag.emoji && <span>{tag.emoji}</span>}
                        <span style={{ color: tag.color }} className="font-medium">{tag.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="col-span-2 md:col-span-1">
              <Select value={currentSort} onValueChange={(value) => updateFilters({ sortBy: value })}>
                <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200 h-10">
                  <SelectValue placeholder="Last Updated" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Last Updated</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order and Create Tag */}
            <div className="col-span-2 md:col-span-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateFilters({ order: currentOrder === 'asc' ? 'desc' : 'asc' })}
                className="border-gray-200 hover:bg-gray-100 h-10 w-10"
                title={currentOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              >
                {currentOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreateTagOpen(true)}
                className="border-gray-200 hover:bg-gray-100 h-10 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Create Tag</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <CreateTagDialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen} />
    </header>
  );
}
