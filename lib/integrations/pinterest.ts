// Pinterest API Integration
const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';

export interface PinterestStats {
  followers: number;
  following: number;
  boardCount: number;
  pinCount: number;
  monthlyViews: number;
}

export interface PinterestPin {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  boardName: string;
  createdAt: string;
  saves: number;
  impressions: number;
  clicks: number;
  outboundClicks: number;
}

export interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  pinCount: number;
  followerCount: number;
  imageUrl: string;
}

export interface PinterestAnalytics {
  date: string;
  impressions: number;
  saves: number;
  clicks: number;
  outboundClicks: number;
}

class PinterestAPI {
  private accessToken: string;

  constructor() {
    this.accessToken = process.env.PINTEREST_ACCESS_TOKEN || '';
  }

  private async fetchPinterest(endpoint: string, options: RequestInit = {}) {
    const url = `${PINTEREST_API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Pinterest API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getAccountStats(): Promise<PinterestStats> {
    try {
      const user = await this.fetchPinterest('/user_account');
      const boards = await this.fetchPinterest('/boards');

      return {
        followers: user.follower_count || 0,
        following: user.following_count || 0,
        boardCount: user.board_count || 0,
        pinCount: user.pin_count || 0,
        monthlyViews: user.monthly_views || 0,
      };
    } catch (error) {
      console.error('Error fetching Pinterest stats:', error);
      throw error;
    }
  }

  async getBoards(): Promise<PinterestBoard[]> {
    try {
      const response = await this.fetchPinterest('/boards');

      return response.items.map((board: any) => ({
        id: board.id,
        name: board.name,
        description: board.description || '',
        pinCount: board.pin_count || 0,
        followerCount: board.follower_count || 0,
        imageUrl: board.media?.image_cover_url || '',
      }));
    } catch (error) {
      console.error('Error fetching Pinterest boards:', error);
      throw error;
    }
  }

  async getPins(boardId?: string, limit: number = 25): Promise<PinterestPin[]> {
    try {
      const endpoint = boardId 
        ? `/boards/${boardId}/pins?page_size=${limit}`
        : `/pins?page_size=${limit}`;
      
      const response = await this.fetchPinterest(endpoint);

      return response.items.map((pin: any) => ({
        id: pin.id,
        title: pin.title || '',
        description: pin.description || '',
        link: pin.link || '',
        imageUrl: pin.media?.images?.['600x']?.url || '',
        boardName: pin.board_name || '',
        createdAt: pin.created_at,
        saves: 0, // Requires analytics API
        impressions: 0,
        clicks: 0,
        outboundClicks: 0,
      }));
    } catch (error) {
      console.error('Error fetching Pinterest pins:', error);
      throw error;
    }
  }

  async getPinAnalytics(pinId: string, days: number = 30): Promise<PinterestAnalytics[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await this.fetchPinterest(
        `/pins/${pinId}/analytics?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&metric_types=IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK`
      );

      return response.daily_metrics?.map((metric: any) => ({
        date: metric.date,
        impressions: metric.metrics?.IMPRESSION || 0,
        saves: metric.metrics?.SAVE || 0,
        clicks: metric.metrics?.PIN_CLICK || 0,
        outboundClicks: metric.metrics?.OUTBOUND_CLICK || 0,
      })) || [];
    } catch (error) {
      console.error('Error fetching Pinterest pin analytics:', error);
      throw error;
    }
  }

  async getTopPins(days: number = 30): Promise<PinterestPin[]> {
    try {
      const pins = await this.getPins(undefined, 50);
      
      // Get analytics for each pin and sort by performance
      const pinsWithAnalytics = await Promise.all(
        pins.map(async (pin) => {
          try {
            const analytics = await this.getPinAnalytics(pin.id, days);
            const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
            const totalSaves = analytics.reduce((sum, a) => sum + a.saves, 0);
            const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
            
            return {
              ...pin,
              impressions: totalImpressions,
              saves: totalSaves,
              clicks: totalClicks,
            };
          } catch {
            return pin;
          }
        })
      );

      return pinsWithAnalytics
        .sort((a, b) => (b.impressions + b.saves * 10) - (a.impressions + a.saves * 10))
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching top Pinterest pins:', error);
      throw error;
    }
  }

  async createPin(data: {
    boardId: string;
    title: string;
    description: string;
    link: string;
    imageUrl: string;
  }): Promise<PinterestPin> {
    try {
      const response = await this.fetchPinterest('/pins', {
        method: 'POST',
        body: JSON.stringify({
          board_id: data.boardId,
          title: data.title,
          description: data.description,
          link: data.link,
          media_source: {
            source_type: 'image_url',
            url: data.imageUrl,
          },
        }),
      });

      return {
        id: response.id,
        title: response.title,
        description: response.description,
        link: response.link,
        imageUrl: response.media?.images?.['600x']?.url || '',
        boardName: '',
        createdAt: response.created_at,
        saves: 0,
        impressions: 0,
        clicks: 0,
        outboundClicks: 0,
      };
    } catch (error) {
      console.error('Error creating Pinterest pin:', error);
      throw error;
    }
  }

  async getAudienceInsights(): Promise<any> {
    try {
      const response = await this.fetchPinterest('/user_account/analytics/audience_insights');
      return response;
    } catch (error) {
      console.error('Error fetching Pinterest audience insights:', error);
      throw error;
    }
  }
}

export const pinterestAPI = new PinterestAPI();
