'use client';

import React from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SideBarHere } from '@/components/SideBarHere';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        {/* Mobile Menu Trigger */}
        <div className="fixed left-4 top-4 z-50 md:hidden">
          <SidebarTrigger />
        </div>

        <Sidebar>
          <SidebarContent>
            <SideBarHere/>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 w-full">
          <div className="container mx-auto px-4 py-0">
            {/* Header - Consistent across all states */}
            <ProjectsHeader />

            {/* Content - Changes based on search/loading */}
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

