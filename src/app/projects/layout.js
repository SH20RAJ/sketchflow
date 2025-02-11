import React from 'react'
import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar'
import { SideBarHere } from '@/components/SideBarHere'

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
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

