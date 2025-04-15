// Constants
export const EXCALIDRAW_LIBRARIES_KEY = 'excalidraw-libraries';
export const EXCALIDRAW_LIBRARIES_URL = 'https://libraries.excalidraw.com/libraries.json';

/**
 * Load libraries from localStorage
 * @returns {Array} Array of libraries
 */
export function loadLibrariesFromLocalStorage() {
  try {
    const savedLibraries = localStorage.getItem(EXCALIDRAW_LIBRARIES_KEY);
    if (savedLibraries) {
      return JSON.parse(savedLibraries);
    }
    return [];
  } catch (error) {
    console.error('Error loading libraries from localStorage:', error);
    return [];
  }
}

/**
 * Save libraries to localStorage
 * @param {Array} libraries Array of libraries to save
 */
export function saveLibrariesToLocalStorage(libraries) {
  try {
    localStorage.setItem(EXCALIDRAW_LIBRARIES_KEY, JSON.stringify(libraries));
    return true;
  } catch (error) {
    console.error('Error saving libraries to localStorage:', error);
    return false;
  }
}

/**
 * Fetch libraries from libraries.excalidraw.com
 * @returns {Promise<Array>} Promise that resolves to an array of libraries
 */
export async function fetchOnlineLibraries() {
  try {
    const response = await fetch(EXCALIDRAW_LIBRARIES_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch libraries');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching online libraries:', error);
    throw error;
  }
}

/**
 * Get library items from a library
 * @param {Object} library The library object
 * @returns {Array} Array of library items
 */
export function getLibraryItems(library) {
  if (!library || !library.data) return [];

  // Handle both formats: libraryItems array or library array of arrays
  if (library.data.libraryItems) {
    return library.data.libraryItems;
  } else if (library.data.library) {
    // Flatten the library array of arrays into a single array of items
    return library.data.library.flat();
  }

  return [];
}

/**
 * Fetch a library from a URL
 * @param {string} url URL of the library to fetch
 * @returns {Promise<Object>} Promise that resolves to the library data
 */
export async function fetchLibraryFromUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch library');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching library:', error);
    throw error;
  }
}

/**
 * Add a library to localStorage
 * @param {Object} library Library to add
 * @returns {boolean} True if the library was added successfully
 */
export function addLibraryToLocalStorage(library) {
  try {
    const libraries = loadLibrariesFromLocalStorage();

    // Validate library data
    if (!library.data || (!library.data.libraryItems && !library.data.library)) {
      console.error('Invalid library format');
      return false;
    }

    // Check if library already exists
    const exists = libraries.some(lib =>
      (lib.name === library.name && library.name) ||
      lib.url === library.url
    );

    if (exists) {
      return false;
    }

    // Add the library
    libraries.push({
      ...library,
      addedAt: new Date().toISOString()
    });

    return saveLibrariesToLocalStorage(libraries);
  } catch (error) {
    console.error('Error adding library to localStorage:', error);
    return false;
  }
}

/**
 * Remove a library from localStorage
 * @param {number} index Index of the library to remove
 * @returns {boolean} True if the library was removed successfully
 */
export function removeLibraryFromLocalStorage(index) {
  try {
    const libraries = loadLibrariesFromLocalStorage();
    libraries.splice(index, 1);
    return saveLibrariesToLocalStorage(libraries);
  } catch (error) {
    console.error('Error removing library from localStorage:', error);
    return false;
  }
}

/**
 * Parse library URL parameters from libraries.excalidraw.com
 * @param {string} url URL with library parameters
 * @returns {Object|null} Library data or null if the URL is invalid
 */
export function parseLibraryUrlParams(url) {
  try {
    const urlObj = new URL(url);
    const source = urlObj.searchParams.get('source');
    const libraryUrl = urlObj.searchParams.get('url');

    if (libraryUrl) {
      return {
        source: source || 'libraries.excalidraw.com',
        url: libraryUrl
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing library URL parameters:', error);
    return null;
  }
}
