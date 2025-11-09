// Instagram API Integration (via Meta Graph API)
const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

export interface InstagramStats {
  followersCount: number;
  followsCount: number;
  mediaCount: number;
  profileViews: number;
  reach: number;
  impressions: number;
  engagement: number;
}

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
  impressions: number;
  reach: number;
  saved: number;
  engagement: number;
}

export interface InstagramStory {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  timestamp: string;
  impressions: number;
  reach: number;
  replies: number;
  exits: number;
}

export interface InstagramInsights {
  date: string;
  impressions: number;
  reach: number;
  profileViews: number;
  websiteClicks: number;
  engagement: number;
}

class InstagramAPI {
  private accessToken: string;
  private userId: string;

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
    this.userId = process.env.INSTAGRAM_USER_ID || '';
  }

  private async fetchInstagram(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${GRAPH_API_BASE}${endpoint}`;
    
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}access_token=${this.accessToken}`;

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      throw new Error(`Instagram API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getAccountStats(): Promise<InstagramStats> {
    try {
      const account = await this.fetchInstagram(
        `/${this.userId}?fields=followers_count,follows_count,media_count`
      );

      // Get insights for last 30 days
      const insights = await this.fetchInstagram(
        `/${this.userId}/insights?metric=impressions,reach,profile_views,website_clicks&period=day&since=${Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60}`
      );

      const totalImpressions = insights.data.find((m: any) => m.name === 'impressions')?.values.reduce((sum: number, v: any) => sum + v.value, 0) || 0;
      const totalReach = insights.data.find((m: any) => m.name === 'reach')?.values.reduce((sum: number, v: any) => sum + v.value, 0) || 0;
      const totalProfileViews = insights.data.find((m: any) => m.name === 'profile_views')?.values.reduce((sum: number, v: any) => sum + v.value, 0) || 0;

      return {
        followersCount: account.followers_count || 0,
        followsCount: account.follows_count || 0,
        mediaCount: account.media_count || 0,
        profileViews: totalProfileViews,
        reach: totalReach,
        impressions: totalImpressions,
        engagement: 0, // Calculated from posts
      };
    } catch (error) {
      console.error('Error fetching Instagram stats:', error);
      throw error;
    }
  }

  async getPosts(limit: number = 25): Promise<InstagramPost[]> {
    try {
      const response = await this.fetchInstagram(
        `/${this.userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${limit}`
      );

      // Get insights for each post
      const postsWithInsights = await Promise.all(
        response.data.map(async (post: any) => {
          try {
            const insights = await this.fetchInstagram(
              `/${post.id}/insights?metric=impressions,reach,saved,engagement`
            );

            return {
              id: post.id,
              caption: post.caption || '',
              mediaType: post.media_type,
              mediaUrl: post.media_url,
              permalink: post.permalink,
              timestamp: post.timestamp,
              likeCount: post.like_count || 0,
              commentsCount: post.comments_count || 0,
              impressions: insights.data.find((m: any) => m.name === 'impressions')?.values[0]?.value || 0,
              reach: insights.data.find((m: any) => m.name === 'reach')?.values[0]?.value || 0,
              saved: insights.data.find((m: any) => m.name === 'saved')?.values[0]?.value || 0,
              engagement: insights.data.find((m: any) => m.name === 'engagement')?.values[0]?.value || 0,
            };
          } catch {
            return {
              id: post.id,
              caption: post.caption || '',
              mediaType: post.media_type,
              mediaUrl: post.media_url,
              permalink: post.permalink,
              timestamp: post.timestamp,
              likeCount: post.like_count || 0,
              commentsCount: post.comments_count || 0,
              impressions: 0,
              reach: 0,
              saved: 0,
              engagement: 0,
            };
          }
        })
      );

      return postsWithInsights;
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error;
    }
  }

  async getStories(): Promise<InstagramStory[]> {
    try {
      const response = await this.fetchInstagram(
        `/${this.userId}/stories?fields=id,media_type,media_url,timestamp`
      );

      const storiesWithInsights = await Promise.all(
        response.data.map(async (story: any) => {
          try {
            const insights = await this.fetchInstagram(
              `/${story.id}/insights?metric=impressions,reach,replies,exits`
            );

            return {
              id: story.id,
              mediaType: story.media_type,
              mediaUrl: story.media_url,
              timestamp: story.timestamp,
              impressions: insights.data.find((m: any) => m.name === 'impressions')?.values[0]?.value || 0,
              reach: insights.data.find((m: any) => m.name === 'reach')?.values[0]?.value || 0,
              replies: insights.data.find((m: any) => m.name === 'replies')?.values[0]?.value || 0,
              exits: insights.data.find((m: any) => m.name === 'exits')?.values[0]?.value || 0,
            };
          } catch {
            return {
              id: story.id,
              mediaType: story.media_type,
              mediaUrl: story.media_url,
              timestamp: story.timestamp,
              impressions: 0,
              reach: 0,
              replies: 0,
              exits: 0,
            };
          }
        })
      );

      return storiesWithInsights;
    } catch (error) {
      console.error('Error fetching Instagram stories:', error);
      throw error;
    }
  }

  async getInsights(days: number = 30): Promise<InstagramInsights[]> {
    try {
      const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
      const response = await this.fetchInstagram(
        `/${this.userId}/insights?metric=impressions,reach,profile_views,website_clicks&period=day&since=${since}`
      );

      const impressionsData = response.data.find((m: any) => m.name === 'impressions')?.values || [];
      const reachData = response.data.find((m: any) => m.name === 'reach')?.values || [];
      const profileViewsData = response.data.find((m: any) => m.name === 'profile_views')?.values || [];
      const websiteClicksData = response.data.find((m: any) => m.name === 'website_clicks')?.values || [];

      const insights: InstagramInsights[] = [];
      for (let i = 0; i < impressionsData.length; i++) {
        insights.push({
          date: impressionsData[i].end_time.split('T')[0],
          impressions: impressionsData[i].value || 0,
          reach: reachData[i]?.value || 0,
          profileViews: profileViewsData[i]?.value || 0,
          websiteClicks: websiteClicksData[i]?.value || 0,
          engagement: 0,
        });
      }

      return insights;
    } catch (error) {
      console.error('Error fetching Instagram insights:', error);
      throw error;
    }
  }

  async getTopPosts(limit: number = 10): Promise<InstagramPost[]> {
    try {
      const posts = await this.getPosts(50);
      return posts
        .sort((a, b) => (b.engagement + b.likeCount * 2) - (a.engagement + a.likeCount * 2))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top Instagram posts:', error);
      throw error;
    }
  }

  async publishPost(data: {
    imageUrl: string;
    caption: string;
  }): Promise<any> {
    try {
      // Step 1: Create media container
      const container = await this.fetchInstagram(
        `/${this.userId}/media`,
        {
          method: 'POST',
          body: JSON.stringify({
            image_url: data.imageUrl,
            caption: data.caption,
          }),
        }
      );

      // Step 2: Publish the container
      const published = await this.fetchInstagram(
        `/${this.userId}/media_publish`,
        {
          method: 'POST',
          body: JSON.stringify({
            creation_id: container.id,
          }),
        }
      );

      return published;
    } catch (error) {
      console.error('Error publishing Instagram post:', error);
      throw error;
    }
  }

  async getAudienceInsights(): Promise<any> {
    try {
      const response = await this.fetchInstagram(
        `/${this.userId}/insights?metric=audience_city,audience_country,audience_gender_age&period=lifetime`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching Instagram audience insights:', error);
      throw error;
    }
  }
}

export const instagramAPI = new InstagramAPI();
