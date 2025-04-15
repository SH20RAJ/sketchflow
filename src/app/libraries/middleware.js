import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, searchParams } = new URL(request.url);
  
  // Check if this is a redirect from libraries.excalidraw.com
  const source = searchParams.get('source');
  const libraryUrl = searchParams.get('url');
  
  if (source === 'libraries.excalidraw.com' && libraryUrl) {
    // This is a redirect from libraries.excalidraw.com
    // We'll handle it in the page component
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/libraries/:path*'],
};
