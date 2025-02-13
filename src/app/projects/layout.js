import React from 'react'
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SideBarHere } from '@/components/SideBarHere'

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
        <div className="flex-1 w-full">{children}</div>
      </div>
    </SidebarProvider>
  )
}

