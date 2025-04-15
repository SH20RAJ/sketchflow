import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const libraryUrl = searchParams.get('url');
    
    if (!libraryUrl) {
      return NextResponse.json({ error: 'No library URL provided' }, { status: 400 });
    }
    
    // Fetch the library data
    const response = await fetch(libraryUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
    }
    
    const libraryData = await response.json();
    
    // Return the library data
    return NextResponse.json(libraryData);
  } catch (error) {
    console.error('Error fetching library:', error);
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
  }
}
