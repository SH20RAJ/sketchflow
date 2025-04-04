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
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100 py-4 px-4 -mx-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsCreateDialogOpen(true)}><Plus className="h-5 w-5" /></Button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
          <div className="flex-1 sm:flex-none max-w-md"><ProjectSearch /></div>
          <div className="hidden sm:block"><Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}><Plus className="h-4 w-4" /><span>New Project</span></Button></div>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
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
      <div className="mt-4 bg-gray-50/80 border border-gray-100 rounded-lg p-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          <Select value={currentTag} onValueChange={(value) => updateFilters({ tagId: value })}>
            <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Filter by tag" />
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
          <Select value={currentSort} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => updateFilters({ order: currentOrder === 'asc' ? 'desc' : 'asc' })} className="w-9 h-9 border-gray-200 hover:bg-gray-100" title={currentOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}>
            {currentOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsCreateTagOpen(true)} className="w-9 h-9 border-gray-200 hover:bg-gray-100" title="Create New Tag">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <CreateTagDialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen} />
    </div>
  );
}
