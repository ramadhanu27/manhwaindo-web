import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/proxy-image?url={imageUrl}
 * Proxy image requests to bypass CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // Validate URL is from expected domain
    if (!imageUrl.includes('img-id.gmbr.pro') && !imageUrl.includes('gmbr.pro')) {
      return NextResponse.json(
        { error: 'Invalid image domain' },
        { status: 403 }
      );
    }

    console.log(`Proxying image: ${imageUrl}`);

    // Fetch image from external server
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://apimanhwa.netlify.app/',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`Image fetch failed: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    console.log(`✓ Image proxied: ${blob.size} bytes`);

    // Return image with proper headers
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
