// Etsy API Integration
const ETSY_API_BASE = 'https://openapi.etsy.com/v3';

export interface EtsyShopStats {
  shopId: string;
  shopName: string;
  totalListings: number;
  activeListings: number;
  totalSales: number;
  totalViews: number;
  totalFavorites: number;
  currency: string;
}

export interface EtsyListing {
  listingId: string;
  title: string;
  price: string;
  quantity: number;
  views: number;
  favorites: number;
  numFavorers: number;
  url: string;
  images: string[];
  state: string;
}

export interface EtsyOrder {
  orderId: string;
  buyerEmail: string;
  totalPrice: string;
  status: string;
  createdAt: string;
  items: Array<{
    title: string;
    quantity: number;
    price: string;
  }>;
}

export interface EtsyAnalytics {
  date: string;
  views: number;
  favorites: number;
  orders: number;
  revenue: number;
}

class EtsyAPI {
  private apiKey: string;
  private shopId: string;
  private accessToken: string;

  constructor() {
    this.apiKey = process.env.ETSY_API_KEY || '';
    this.shopId = process.env.ETSY_SHOP_ID || '';
    this.accessToken = process.env.ETSY_ACCESS_TOKEN || '';
  }

  private async fetchEtsy(endpoint: string, options: RequestInit = {}) {
    const url = `${ETSY_API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Etsy API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getShopStats(): Promise<EtsyShopStats> {
    try {
      const shop = await this.fetchEtsy(`/application/shops/${this.shopId}`);
      
      return {
        shopId: shop.shop_id,
        shopName: shop.shop_name,
        totalListings: shop.listing_active_count || 0,
        activeListings: shop.listing_active_count || 0,
        totalSales: shop.transaction_sold_count || 0,
        totalViews: shop.views || 0,
        totalFavorites: shop.num_favorers || 0,
        currency: shop.currency_code || 'USD',
      };
    } catch (error) {
      console.error('Error fetching Etsy shop stats:', error);
      throw error;
    }
  }

  async getActiveListings(limit: number = 25): Promise<EtsyListing[]> {
    try {
      const response = await this.fetchEtsy(
        `/application/shops/${this.shopId}/listings/active?limit=${limit}`
      );

      return response.results.map((listing: any) => ({
        listingId: listing.listing_id,
        title: listing.title,
        price: `${listing.price.currency_code} ${listing.price.amount / listing.price.divisor}`,
        quantity: listing.quantity,
        views: listing.views || 0,
        favorites: listing.num_favorers || 0,
        numFavorers: listing.num_favorers || 0,
        url: listing.url,
        images: listing.images?.map((img: any) => img.url_570xN) || [],
        state: listing.state,
      }));
    } catch (error) {
      console.error('Error fetching Etsy listings:', error);
      throw error;
    }
  }

  async getRecentOrders(limit: number = 10): Promise<EtsyOrder[]> {
    try {
      const response = await this.fetchEtsy(
        `/application/shops/${this.shopId}/receipts?limit=${limit}&was_paid=true`
      );

      return response.results.map((receipt: any) => ({
        orderId: receipt.receipt_id,
        buyerEmail: receipt.buyer_email,
        totalPrice: `${receipt.total_price.currency_code} ${receipt.total_price.amount / receipt.total_price.divisor}`,
        status: receipt.status,
        createdAt: new Date(receipt.created_timestamp * 1000).toISOString(),
        items: receipt.transactions?.map((tx: any) => ({
          title: tx.title,
          quantity: tx.quantity,
          price: `${tx.price.currency_code} ${tx.price.amount / tx.price.divisor}`,
        })) || [],
      }));
    } catch (error) {
      console.error('Error fetching Etsy orders:', error);
      throw error;
    }
  }

  async getAnalytics(days: number = 30): Promise<EtsyAnalytics[]> {
    try {
      // Note: Etsy's analytics API requires additional permissions
      // This is a simplified version using available data
      const listings = await this.getActiveListings(100);
      const orders = await this.getRecentOrders(100);

      // Aggregate data by date
      const analytics: { [key: string]: EtsyAnalytics } = {};
      
      orders.forEach(order => {
        const date = order.createdAt.split('T')[0];
        if (!analytics[date]) {
          analytics[date] = {
            date,
            views: 0,
            favorites: 0,
            orders: 0,
            revenue: 0,
          };
        }
        analytics[date].orders += 1;
        const price = parseFloat(order.totalPrice.split(' ')[1]);
        analytics[date].revenue += price;
      });

      return Object.values(analytics).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, days);
    } catch (error) {
      console.error('Error fetching Etsy analytics:', error);
      throw error;
    }
  }

  async syncListingsToWebsite(): Promise<any[]> {
    try {
      const listings = await this.getActiveListings(100);
      
      // Convert Etsy listings to your website format
      return listings.map(listing => ({
        name: listing.title,
        price: listing.price,
        category: 'DIGITAL PRODUCTS', // You can add logic to determine category
        image: listing.images[0] || '',
        images: listing.images,
        description: `Imported from Etsy - ${listing.title}`,
        buyUrl: listing.url,
      }));
    } catch (error) {
      console.error('Error syncing Etsy listings:', error);
      throw error;
    }
  }
}

export const etsyAPI = new EtsyAPI();
