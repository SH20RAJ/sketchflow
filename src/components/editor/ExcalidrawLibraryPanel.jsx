'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Library, ExternalLink, Download, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

// Constants
const EXCALIDRAW_LIBRARIES_KEY = 'excalidraw-libraries';
const EXCALIDRAW_LIBRARIES_URL = 'https://libraries.excalidraw.com/libraries.json';

export function ExcalidrawLibraryPanel({ onAddToCanvas }) {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('local');
  const [onlineLibraries, setOnlineLibraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingOnline, setLoadingOnline] = useState(false);
  const libraryUrlInputRef = useRef(null);

  // Load libraries from localStorage
  useEffect(() => {
    const loadLibraries = () => {
      try {
        const savedLibraries = localStorage.getItem(EXCALIDRAW_LIBRARIES_KEY);
        if (savedLibraries) {
          const parsedLibraries = JSON.parse(savedLibraries);
          // Ensure libraries have the correct format
          const validLibraries = parsedLibraries.filter(lib =>
            lib && lib.data && (lib.data.libraryItems || lib.data.library)
          );
          setLibraries(validLibraries);
        }
      } catch (error) {
        console.error('Error loading libraries from localStorage:', error);
        toast.error('Failed to load libraries');
      } finally {
        setLoading(false);
      }
    };

    loadLibraries();
  }, []);

  // Save libraries to localStorage whenever they change
  useEffect(() => {
    if (libraries.length > 0) {
      localStorage.setItem(EXCALIDRAW_LIBRARIES_KEY, JSON.stringify(libraries));
    }
  }, [libraries]);

  // Fetch online libraries
  const fetchOnlineLibraries = useCallback(async () => {
    if (onlineLibraries.length > 0) return;

    setLoadingOnline(true);
    try {
      const response = await fetch(EXCALIDRAW_LIBRARIES_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch libraries');
      }
      const data = await response.json();
      setOnlineLibraries(data);
    } catch (error) {
      console.error('Error fetching online libraries:', error);
      toast.error('Failed to fetch online libraries');
    } finally {
      setLoadingOnline(false);
    }
  }, [onlineLibraries.length]);

  // Fetch online libraries when the online tab is selected
  useEffect(() => {
    if (activeTab === 'online') {
      fetchOnlineLibraries();
    }
  }, [activeTab, fetchOnlineLibraries]);

  // Add a library from URL
  const addLibraryFromUrl = async (url) => {
    if (!url || !url.trim()) {
      toast.error('Please enter a valid library URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch library');
      }
      const libraryData = await response.json();

      // Validate library data
      if (!libraryData || (!libraryData.libraryItems && !libraryData.library)) {
        throw new Error('Invalid library format');
      }

      // Check if library already exists
      const exists = libraries.some(lib =>
        (lib.name === libraryData.name && libraryData.name) ||
        lib.url === url
      );

      if (exists) {
        toast.info('Library already exists');
        return;
      }

      // Add the library
      const newLibrary = {
        name: libraryData.name || url.split('/').pop() || 'Unnamed Library',
        url,
        data: libraryData,
        addedAt: new Date().toISOString()
      };

      setLibraries(prev => [...prev, newLibrary]);
      toast.success('Library added successfully');

      // Clear the input field
      if (libraryUrlInputRef.current) {
        libraryUrlInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error adding library:', error);
      toast.error(`Failed to add library: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add an online library
  const addOnlineLibrary = async (library) => {
    setLoading(true);
    try {
      const response = await fetch(library.url);
      if (!response.ok) {
        throw new Error('Failed to fetch library');
      }
      const libraryData = await response.json();

      // Validate library data
      if (!libraryData || (!libraryData.libraryItems && !libraryData.library)) {
        throw new Error('Invalid library format');
      }

      // Check if library already exists
      const exists = libraries.some(lib =>
        (lib.name === library.name && library.name) ||
        lib.url === library.url
      );

      if (exists) {
        toast.info('Library already exists');
        return;
      }

      // Add the library
      const newLibrary = {
        name: library.name || 'Unnamed Library',
        url: library.url,
        data: libraryData,
        addedAt: new Date().toISOString()
      };

      setLibraries(prev => [...prev, newLibrary]);
      toast.success('Library added successfully');

      // Switch to local tab to show the added library
      setActiveTab('local');
    } catch (error) {
      console.error('Error adding library:', error);
      toast.error(`Failed to add library: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove a library
  const removeLibrary = (index) => {
    setLibraries(prev => prev.filter((_, i) => i !== index));
    toast.success('Library removed');
  };

  // Filter online libraries based on search term
  const filteredOnlineLibraries = onlineLibraries.filter(library =>
    library.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding library items to canvas
  const handleAddToCanvas = (libraryItem) => {
    if (onAddToCanvas) {
      onAddToCanvas(libraryItem);
      toast.success('Added to canvas');
    }
  };

  // Get library items from a library
  const getLibraryItems = (library) => {
    if (!library || !library.data) return [];

    // Handle both formats: libraryItems array or library array of arrays
    if (library.data.libraryItems) {
      return library.data.libraryItems;
    } else if (library.data.library) {
      // Flatten the library array of arrays into a single array of items
      return library.data.library.flat();
    }

    return [];
  };

  // Render a preview of a library item
  const renderLibraryItemPreview = (item) => {
    if (!item || !item.elements || item.elements.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          Empty
        </div>
      );
    }

    // Find a representative element to show
    const previewElement = item.elements.find(el =>
      el.type !== 'text' && !el.isDeleted
    ) || item.elements[0];

    if (!previewElement) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          Empty
        </div>
      );
    }

    // Determine background color based on element
    const bgColor = previewElement.backgroundColor || 'transparent';
    const strokeColor = previewElement.strokeColor || '#000';

    return (
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: bgColor !== 'transparent' ? bgColor : '#f8f9fa',
          border: `1px solid ${strokeColor}`,
          borderRadius: '4px',
        }}
      >
        <div className="transform scale-75">
          {previewElement.type === 'rectangle' && (
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: strokeColor,
                borderRadius: previewElement.roundness ? '4px' : '0',
              }}
            />
          )}
          {previewElement.type === 'ellipse' && (
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: strokeColor,
                borderRadius: '50%',
              }}
            />
          )}
          {previewElement.type === 'diamond' && (
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: strokeColor,
                transform: 'rotate(45deg)',
              }}
            />
          )}
          {previewElement.type === 'line' && (
            <div
              style={{
                width: '20px',
                height: '2px',
                backgroundColor: strokeColor,
              }}
            />
          )}
          {previewElement.type === 'arrow' && (
            <div className="flex items-center">
              <div
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: strokeColor,
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderLeft: `6px solid ${strokeColor}`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium mb-1">Library</h3>
        <p className="text-sm text-gray-500">Add and manage your libraries</p>
      </div>

      <Tabs defaultValue="local" value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 px-4 pt-2">
          <TabsTrigger value="local">My Libraries</TabsTrigger>
          <TabsTrigger value="online">Browse Libraries</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="flex-1 overflow-auto flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4 p-4 flex-1 flex flex-col">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Paste library URL"
                  ref={libraryUrlInputRef}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const url = e.target.value;
                      if (url) {
                        addLibraryFromUrl(url);
                      }
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const url = libraryUrlInputRef.current?.value;
                    if (url) {
                      addLibraryFromUrl(url);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                <p>Add libraries from <a href="https://libraries.excalidraw.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">libraries.excalidraw.com</a> or use the Browse tab.</p>
              </div>

              {libraries.length === 0 ? (
                <div className="text-center py-8 text-gray-500 flex-1 flex flex-col items-center justify-center">
                  <Library className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No libraries added yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setActiveTab('online')}
                  >
                    Browse libraries
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  {libraries.map((library, index) => {
                    const libraryItems = getLibraryItems(library);
                    return (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="p-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">{library.name}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLibrary(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          {libraryItems.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              <p>No items in this library</p>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-3 gap-2">
                                {libraryItems.slice(0, 6).map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="border rounded p-1 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleAddToCanvas(item)}
                                    title="Click to add to canvas"
                                  >
                                    <div className="w-full h-16 bg-gray-50 flex items-center justify-center overflow-hidden">
                                      {renderLibraryItemPreview(item)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {libraryItems.length > 6 && (
                                <div className="mt-2 text-xs text-right text-blue-500">
                                  + {libraryItems.length - 6} more items
                                </div>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="online" className="flex-1 overflow-auto">
          <div className="space-y-4 p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search libraries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {loadingOnline ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOnlineLibraries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No libraries found</p>
                  </div>
                ) : (
                  filteredOnlineLibraries.map((library, index) => (
                    <Card key={index}>
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium">{library.name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(library.url, '_blank')}
                              title="Open in new tab"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addOnlineLibrary(library)}
                              title="Add to my libraries"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-xs text-gray-500">{library.description || 'No description available'}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => window.open('https://libraries.excalidraw.com', '_blank')}
        >
          Visit Excalidraw Libraries
        </Button>
      </div>
    </div>
  );
}
