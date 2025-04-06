'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Users, Search } from 'lucide-react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectPagination } from '@/components/projects/ProjectPagination';
import { Badge } from '@/components/ui/badge';

const fetcher = (...args) => fetch(...args).then(res => res.json());

// Animation variants
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

export function CollaboratedProjects({ searchQuery }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('collaboratedPage') || '1', 10);

  // Construct API URL with pagination and search parameters
  const getApiUrl = () => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '6'); // 6 items per page (2x3 grid)
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    return `/api/projects/collaborated?${params.toString()}`;
  };

  const { data, error, isLoading } = useSWR(getApiUrl(), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  // Handle pagination
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('collaboratedPage', newPage.toString());
    router.push(`/projects?${params.toString()}`);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'EDITOR': return 'bg-green-500';
      case 'COMMENTER': return 'bg-yellow-500';
      case 'VIEWER': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Collaborated Projects</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Collaborated Projects</h2>
        </div>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Error loading collaborated projects. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projects = data?.projects || [];
  const pagination = data?.pagination;
  const hasProjects = projects.length > 0;

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Collaborated Projects</h2>
        <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
          <Users className="h-3.5 w-3.5" />
          <span>{pagination?.total || 0} Projects</span>
        </Badge>
      </div>

      {!hasProjects && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 sm:p-6 md:p-8 text-center">
            {searchQuery ? (
              <div className="space-y-3">
                <div className="relative mx-auto w-12 h-12 mb-2">
                  <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-lg" />
                  <Search className="relative h-12 w-12 mx-auto text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-700">No collaborated projects match your search</p>
                <p className="text-gray-500">Try a different search term or check your invitations</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative mx-auto w-12 h-12 mb-2">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg" />
                  <Users className="relative h-12 w-12 mx-auto text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-700">No collaborated projects yet</p>
                <p className="text-gray-500">Projects that others invite you to collaborate on will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {hasProjects && (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
          >
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div key={project.id} variants={item} layout>
                  <ProjectCard
                    project={project}
                    isCollaborated={true}
                    roleBadge={
                      <Badge className={`${getRoleBadgeColor(project.role)} text-white`}>
                        {project.role.charAt(0) + project.role.slice(1).toLowerCase()}
                      </Badge>
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <ProjectPagination
                pagination={{
                  page: pagination.page,
                  totalPages: pagination.totalPages
                }}
                createPageURL={(pageNum) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('collaboratedPage', pageNum.toString());
                  return `/projects?${params.toString()}`;
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
