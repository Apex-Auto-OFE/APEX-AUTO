import { NextResponse } from 'next/server';
import { etsyAPI } from '@/lib/integrations/etsy';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await etsyAPI.getShopStats();
        return NextResponse.json(stats);
      
      case 'listings':
        const limit = parseInt(searchParams.get('limit') || '25');
        const listings = await etsyAPI.getActiveListings(limit);
        return NextResponse.json(listings);
      
      case 'orders':
        const orderLimit = parseInt(searchParams.get('limit') || '10');
        const orders = await etsyAPI.getRecentOrders(orderLimit);
        return NextResponse.json(orders);
      
      case 'analytics':
        const days = parseInt(searchParams.get('days') || '30');
        const analytics = await etsyAPI.getAnalytics(days);
        return NextResponse.json(analytics);
      
      case 'sync':
        const synced = await etsyAPI.syncListingsToWebsite();
        return NextResponse.json({ success: true, products: synced });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Etsy API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
