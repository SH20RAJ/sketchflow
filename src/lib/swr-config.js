import { useState, useEffect } from 'react';
import { SWRConfig } from 'swr';

// LocalStorage cache provider implementation
const localStorageProvider = () => {
  // When initializing, restore from localStorage
  const map = new Map(
    JSON.parse(localStorage.getItem('swr-cache') || '[]')
  );

  // Before unloading app, write to localStorage
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem('swr-cache', appCache);
  });

  // SWR provider interface implementation
  return {
    get: (key) => {
      const item = map.get(key);
      if (!item) return undefined;
      
      // Check if cached data is expired (24 hours cache)
      const { data, timestamp } = item;
      if (Date.now() - timestamp > 86400000) {
        map.delete(key);
        return undefined;
      }
      
      return data;
    },
    set: (key, data) => {
      map.set(key, { data, timestamp: Date.now() });
    },
    delete: (key) => {
      map.delete(key);
    }
  };
};

// React hook for detecting if online
const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export function SwrProviderWithCache({ children }) {
  const isOnline = useIsOnline();
  
  return (
    <SWRConfig 
      value={{
        provider: typeof window !== 'undefined' ? localStorageProvider : null,
        fetcher: (url) => fetch(url).then(res => res.json()),
        revalidateIfStale: true,
        revalidateOnFocus: isOnline, // Only revalidate when online
        revalidateOnReconnect: true,
        focusThrottleInterval: 5000, // Reduce revalidation on frequent focus changes
        dedupingInterval: 5000, // Dedupe requests within this time window
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        suspense: false,
        keepPreviousData: true, // Show previous data while revalidating
        fallbackData: null, // Can be set per-hook
      }}
    >
      {children}
    </SWRConfig>
  );
}

// Helper hook for specific data fetching with customized options
export function useProjectData(projectId, initialData = null) {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `/api/projects/${projectId}` : null, 
    {
      keepPreviousData: true,
      revalidateOnMount: true,
      fallbackData: initialData,
      onSuccess: (data) => {
        // Prefetch related data that the user might need next
        if (data && data.id) {
          // Prefetch collaborators
          fetch(`/api/projects/${data.id}/collaborators`);
          // Prefetch comments
          fetch(`/api/projects/${data.id}/comments`);
        }
      }
    }
  );
  
  return {
    project: data,
    isLoading,
    isError: error,
    mutate
  };
}
