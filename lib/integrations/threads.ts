// Threads API Integration
const GRAPH_API_BASE = 'https://graph.threads.net/v1.0';

export interface ThreadsStats {
  followersCount: number;
  postsCount: number;
  totalViews: number;
  totalLikes: number;
}

export interface ThreadsPost {
  id: string;
  text: string;
  mediaUrl?: string;
  permalink: string;
  timestamp: string;
  views: number;
  likes: number;
  replies: number;
}

class ThreadsAPI {
  private accessToken: string;
  private userId: string;

  constructor() {
    this.accessToken = process.env.THREADS_ACCESS_TOKEN || '';
    this.userId = process.env.THREADS_USER_ID || '';
  }

  private async fetchThreads(endpoint: string, options: RequestInit = {}) {
    const url = `${GRAPH_API_BASE}${endpoint}`;
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}access_token=${this.accessToken}`;
    const response = await fetch(fullUrl, options);
    if (!response.ok) throw new Error(`Threads API Error: ${response.statusText}`);
    return response.json();
  }

  async getAccountStats(): Promise<ThreadsStats> {
    try {
      const profile = await this.fetchThreads(`/${this.userId}?fields=followers_count`);
      const threads = await this.getPosts(100);
      return {
        followersCount: profile.followers_count || 0,
        postsCount: threads.length,
        totalViews: threads.reduce((sum, post) => sum + post.views, 0),
        totalLikes: threads.reduce((sum, post) => sum + post.likes, 0),
      };
    } catch (error) {
      console.error('Error fetching Threads stats:', error);
      throw error;
    }
  }

  async getPosts(limit: number = 25): Promise<ThreadsPost[]> {
    try {
      const response = await this.fetchThreads(
        `/${this.userId}/threads?fields=id,text,media_url,permalink,timestamp,views,likes,replies&limit=${limit}`
      );
      return response.data.map((post: any) => ({
        id: post.id,
        text: post.text || '',
        mediaUrl: post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp,
        views: post.views || 0,
        likes: post.likes || 0,
        replies: post.replies || 0,
      }));
    } catch (error) {
      console.error('Error fetching Threads posts:', error);
      throw error;
    }
  }

  async publishPost(data: { text: string; imageUrl?: string }): Promise<any> {
    try {
      const container = await this.fetchThreads(`/${this.userId}/threads`, {
        method: 'POST',
        body: JSON.stringify({
          media_type: data.imageUrl ? 'IMAGE' : 'TEXT',
          text: data.text,
          ...(data.imageUrl && { image_url: data.imageUrl }),
        }),
      });
      const published = await this.fetchThreads(`/${this.userId}/threads_publish`, {
        method: 'POST',
        body: JSON.stringify({ creation_id: container.id }),
      });
      return published;
    } catch (error) {
      console.error('Error publishing Threads post:', error);
      throw error;
    }
  }
}

export const threadsAPI = new ThreadsAPI();
