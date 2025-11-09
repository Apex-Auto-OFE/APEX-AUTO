import { NextResponse } from 'next/server';
import { pinterestAPI } from '@/lib/integrations/pinterest';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await pinterestAPI.getAccountStats();
        return NextResponse.json(stats);
      
      case 'boards':
        const boards = await pinterestAPI.getBoards();
        return NextResponse.json(boards);
      
      case 'pins':
        const boardId = searchParams.get('boardId') || undefined;
        const limit = parseInt(searchParams.get('limit') || '25');
        const pins = await pinterestAPI.getPins(boardId, limit);
        return NextResponse.json(pins);
      
      case 'top-pins':
        const days = parseInt(searchParams.get('days') || '30');
        const topPins = await pinterestAPI.getTopPins(days);
        return NextResponse.json(topPins);
      
      case 'insights':
        const insights = await pinterestAPI.getAudienceInsights();
        return NextResponse.json(insights);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Pinterest API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-pin') {
      const pin = await pinterestAPI.createPin(body.data);
      return NextResponse.json(pin);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Pinterest API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
