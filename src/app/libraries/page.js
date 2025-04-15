'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchLibraryFromUrl, addLibraryToLocalStorage } from '@/lib/excalidraw-library';

export default function LibraryRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const handleLibraryRedirect = async () => {
      try {
        const libraryUrl = searchParams.get('url');
        
        if (!libraryUrl) {
          toast.error('No library URL provided');
          router.push('/projects');
          return;
        }
        
        // Fetch the library data
        const libraryData = await fetchLibraryFromUrl(libraryUrl);
        
        // Add the library to localStorage
        const library = {
          name: libraryData.name || 'Unnamed Library',
          url: libraryUrl,
          data: libraryData
        };
        
        const added = addLibraryToLocalStorage(library);
        
        if (added) {
          toast.success('Library added successfully');
        } else {
          toast.info('Library already exists');
        }
        
        // Redirect to projects page
        router.push('/projects');
      } catch (error) {
        console.error('Error handling library redirect:', error);
        toast.error('Failed to add library');
        router.push('/projects');
      }
    };
    
    handleLibraryRedirect();
  }, [router, searchParams]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-600">Adding library to your collection...</p>
    </div>
  );
}
