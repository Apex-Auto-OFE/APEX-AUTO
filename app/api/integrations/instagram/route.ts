import { NextResponse } from 'next/server';
import { instagramAPI } from '@/lib/integrations/instagram';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await instagramAPI.getAccountStats();
        return NextResponse.json(stats);
      
      case 'posts':
        const limit = parseInt(searchParams.get('limit') || '25');
        const posts = await instagramAPI.getPosts(limit);
        return NextResponse.json(posts);
      
      case 'stories':
        const stories = await instagramAPI.getStories();
        return NextResponse.json(stories);
      
      case 'insights':
        const days = parseInt(searchParams.get('days') || '30');
        const insights = await instagramAPI.getInsights(days);
        return NextResponse.json(insights);
      
      case 'top-posts':
        const topLimit = parseInt(searchParams.get('limit') || '10');
        const topPosts = await instagramAPI.getTopPosts(topLimit);
        return NextResponse.json(topPosts);
      
      case 'audience':
        const audience = await instagramAPI.getAudienceInsights();
        return NextResponse.json(audience);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Instagram API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'publish-post') {
      const result = await instagramAPI.publishPost(body.data);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Instagram API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
