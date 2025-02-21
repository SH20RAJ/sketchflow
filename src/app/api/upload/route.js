import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Upload to Imgur
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 6db47bd7029562d',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        type: 'base64',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.data.error || 'Failed to upload image');
    }

    return NextResponse.json({
      success: true,
      url: data.data.link,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}