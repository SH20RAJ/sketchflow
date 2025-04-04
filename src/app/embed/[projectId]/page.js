'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2, ExternalLink, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import('@/components/editor/EmbedEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-500">Loading embedded project...</p>
      </div>
    </div>
  )
});

export default function EmbedProjectPage({ params }) {
  const searchParams = useSearchParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date());
  
  // Parse embed options from URL parameters
  const showHeader = searchParams.get('header') !== 'false';
  const showFooter = searchParams.get('footer') === 'true';
  const showControls = searchParams.get('controls') !== 'false';
  const allowInteraction = searchParams.get('interact') !== 'false';
  const viewMode = searchParams.get('view') || 'split';
  const theme = searchParams.get('theme') || 'system';
  const token = searchParams.get('token');
  const autoSync = searchParams.get('sync') === 'true';
  const syncInterval = parseInt(searchParams.get('interval') || '60', 10);
  
  // Fetch project data
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (token) queryParams.append('token', token);
      if (window.location.origin) queryParams.append('origin', window.location.origin);
      
      // Fetch project data
      const response = await fetch(`/api/projects/${params.projectId}/embed?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load embedded project');
      }
      
      const data = await response.json();
      
      // Fetch project content
      const contentResponse = await fetch(`/api/projects/${params.projectId}`);
      
      if (!contentResponse.ok) {
        throw new Error('Failed to load project content');
      }
      
      const contentData = await contentResponse.json();
      
      // Combine data
      setProjectData({
        ...contentData,
        embedConfig: data.embedConfig
      });
      
      setLastSynced(new Date());
    } catch (error) {
      console.error('Error loading embedded project:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchProjectData();
  }, [params.projectId, token]);
  
  // Set up auto-sync if enabled
  useEffect(() => {
    if (!autoSync || syncInterval < 10) return;
    
    const intervalId = setInterval(() => {
      fetchProjectData();
    }, syncInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [autoSync, syncInterval, params.projectId]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error('Error attempting to enable fullscreen mode');
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Handle manual sync
  const handleSync = () => {
    fetchProjectData();
    toast.success('Project synced successfully');
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Set theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme handled by CSS media query
    }
  }, [theme]);
  
  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Error Loading Project</h3>
            <p className="text-sm">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchProjectData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (loading && !projectData) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">Loading embedded project...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full min-h-[400px] overflow-hidden">
      {/* Header */}
      {showHeader && (
        <header className="flex items-center justify-between px-4 py-2 border-b bg-white dark:bg-gray-950">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium truncate">{projectData?.name}</h1>
            {projectData?.description && (
              <span className="text-xs text-gray-500 truncate hidden sm:inline">
                — {projectData.description}
              </span>
            )}
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={handleSync}
                title="Sync project"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => window.open(`/project/${params.projectId}`, '_blank')}
                title="Open in SketchFlow"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </header>
      )}
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {projectData && (
          <Editor
            projectId={params.projectId}
            initialData={projectData}
            viewMode={viewMode}
            readOnly={!allowInteraction}
            isEmbedded={true}
          />
        )}
      </main>
      
      {/* Footer */}
      {showFooter && (
        <footer className="flex items-center justify-between px-4 py-2 border-t bg-white dark:bg-gray-950 text-xs text-gray-500">
          <div>
            Last updated: {new Date(projectData?.updatedAt).toLocaleString()}
          </div>
          <div>
            Powered by <a href="https://sketchflow.io" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">SketchFlow</a>
          </div>
        </footer>
      )}
    </div>
  );
}
