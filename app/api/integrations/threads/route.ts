import { NextResponse } from 'next/server';
import { threadsAPI } from '@/lib/integrations/threads';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await threadsAPI.getAccountStats();
        return NextResponse.json(stats);
      
      case 'posts':
        const limit = parseInt(searchParams.get('limit') || '25');
        const posts = await threadsAPI.getPosts(limit);
        return NextResponse.json(posts);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Threads API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'publish-post') {
      const result = await threadsAPI.publishPost(body.data);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Threads API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
