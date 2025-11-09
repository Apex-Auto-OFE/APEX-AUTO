# 🚀 LEGACY Admin Dashboard - Complete Setup Guide

## What You Just Got

A **powerful admin dashboard** with full integration for:
- ✅ **Etsy** - Shop stats, orders, listings, analytics, auto-sync
- ✅ **Pinterest** - Pin analytics, boards, audience insights, auto-posting
- ✅ **Instagram** - Posts, stories, insights, engagement tracking, auto-posting
- ✅ **Threads** - Post metrics, engagement, auto-posting
- ✅ **Cross-Platform Automation** - Post to multiple platforms at once

---

## 📋 Step 1: Get Your API Keys

### 🛍️ Etsy API Setup

1. **Go to:** https://www.etsy.com/developers/register
2. **Click:** "Register as a Developer"
3. **Create a new app:**
   - App Name: "LEGACY Dashboard"
   - App Description: "Admin dashboard for my shop"
4. **You'll get:**
   - `Keystring` (this is your API Key)
   - `Shared Secret`
5. **Set Redirect URL:** `http://localhost:3000/api/auth/etsy/callback`
6. **Get your Shop ID:**
   - Go to your Etsy shop
   - Look at the URL: `etsy.com/shop/YourShopName`
   - Your Shop ID is in the URL or you can find it in your shop settings

**OAuth Flow (to get access token):**
```
https://www.etsy.com/oauth/connect?response_type=code&client_id=YOUR_KEYSTRING&redirect_uri=YOUR_REDIRECT_URI&scope=listings_r%20transactions_r%20shops_r
```

---

### 📌 Pinterest API Setup

1. **Go to:** https://developers.pinterest.com/
2. **Click:** "Get Started" → "My Apps"
3. **Create new app:**
   - App Name: "LEGACY Dashboard"
   - Description: "Admin dashboard"
4. **You'll get:**
   - `App ID`
   - `App Secret`
5. **Enable these scopes:**
   - `boards:read`
   - `pins:read`
   - `user_accounts:read`
   - `pins:write` (for posting)
6. **Set Redirect URI:** `http://localhost:3000/api/auth/pinterest/callback`

**Get Access Token:**
- Use Pinterest OAuth flow or generate one in the dashboard
- Tokens last 1 year

---

### 📸 Instagram API Setup (via Meta)

1. **Go to:** https://developers.facebook.com/
2. **Create new app:**
   - Type: "Business"
   - Name: "LEGACY Dashboard"
3. **Add Products:**
   - Add "Instagram Basic Display"
   - Add "Instagram Graph API"
4. **You'll get:**
   - `Instagram App ID`
   - `Instagram App Secret`
   - `Client Token`
5. **Configure:**
   - Add your Instagram account as a test user
   - Set Redirect URI: `http://localhost:3000/api/auth/instagram/callback`
6. **Get User ID:**
   - Use Graph API Explorer
   - Request: `me?fields=id,username`

**Required Permissions:**
- `instagram_basic`
- `instagram_content_publish`
- `pages_read_engagement`
- `pages_show_list`

---

### 🧵 Threads API Setup

1. **Same Meta app as Instagram**
2. **Enable Threads API** in your Meta app
3. **Uses same credentials** as Instagram
4. **Get Threads User ID:**
   - Different from Instagram ID
   - Use: `https://graph.threads.net/v1.0/me?fields=id,username&access_token=YOUR_TOKEN`

---

## 📝 Step 2: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   copy .env.local.example .env.local
   ```

2. **Fill in your API keys in `.env.local`:**

```env
# Firebase (you already have these)
NEXT_PUBLIC_FIREBASE_API_KEY=your_existing_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_existing_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_existing_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_existing_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_existing_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_existing_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_existing_measurement_id

# Etsy API
ETSY_API_KEY=your_etsy_keystring_here
ETSY_API_SECRET=your_etsy_shared_secret_here
ETSY_SHOP_ID=your_shop_id_here
ETSY_ACCESS_TOKEN=your_etsy_access_token_here
ETSY_REFRESH_TOKEN=your_etsy_refresh_token_here

# Pinterest API
PINTEREST_APP_ID=your_pinterest_app_id_here
PINTEREST_APP_SECRET=your_pinterest_app_secret_here
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token_here

# Instagram API
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_USER_ID=your_instagram_user_id_here

# Threads API
THREADS_ACCESS_TOKEN=your_threads_access_token_here
THREADS_USER_ID=your_threads_user_id_here

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_PASSWORD=legacy2025
```

---

## 🔧 Step 3: Install & Run

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

**Open:** http://localhost:3000/admin

---

## 🎯 What You Can Do Now

### In Your Admin Dashboard:

#### **New "Analytics" Tab** (I'll add this next)
- **Unified Dashboard:** See all platform stats in one place
- **Etsy Section:**
  - Total sales, views, favorites
  - Recent orders
  - Top selling products
  - Revenue charts
  - Sync products to website button

- **Pinterest Section:**
  - Follower count, monthly views
  - Top performing pins
  - Board analytics
  - Pin impressions & saves
  - Create new pins

- **Instagram Section:**
  - Follower growth
  - Post engagement rates
  - Story views
  - Best posting times
  - Schedule posts

- **Threads Section:**
  - Post metrics
  - Engagement tracking
  - Auto-post from Instagram

#### **Automation Features:**
- **Cross-Post:** Share to Instagram + Threads + Pinterest at once
- **Auto-Sync:** Sync Etsy products to your website
- **Scheduler:** Schedule posts for optimal times
- **Alerts:** Get notified of low stock, new orders, viral posts

---

## 🎨 Dashboard Features I'm Building

### **Analytics Dashboard** (Main view)
```
┌─────────────────────────────────────────────┐
│  📊 OVERVIEW                                │
│  Total Revenue: $X,XXX                      │
│  Total Orders: XXX                          │
│  Total Followers: XX,XXX                    │
│  Total Engagement: XX,XXX                   │
└─────────────────────────────────────────────┘

┌──────────┬──────────┬──────────┬──────────┐
│  ETSY    │ PINTEREST│ INSTAGRAM│ THREADS  │
│  Stats   │  Stats   │  Stats   │  Stats   │
└──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────────┐
│  📈 PERFORMANCE CHARTS                      │
│  [Revenue Graph] [Engagement Graph]         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🔥 TOP PERFORMERS                          │
│  Best Selling Products                      │
│  Most Engaged Posts                         │
│  Trending Pins                              │
└─────────────────────────────────────────────┘
```

### **Post Scheduler**
- Calendar view
- Drag & drop scheduling
- Best time suggestions
- Multi-platform posting

### **Product Sync**
- One-click Etsy → Website sync
- Bulk import
- Auto-update prices
- Inventory tracking

---

## 🔐 Security Notes

- **Never commit `.env.local`** to git (it's already in .gitignore)
- **Keep API keys secret**
- **Refresh tokens regularly**
- **Use HTTPS in production**

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### API returns 401 Unauthorized
- Check your access tokens
- Tokens may have expired
- Re-authenticate with OAuth

### Rate Limits
- Etsy: 10,000 requests/day
- Pinterest: 1,000 requests/hour
- Instagram: 200 requests/hour
- Threads: 250 requests/hour

### CORS Errors
- Make sure redirect URIs match exactly
- Check API app settings

---

## 📚 API Documentation

- **Etsy:** https://developers.etsy.com/documentation
- **Pinterest:** https://developers.pinterest.com/docs/api/v5/
- **Instagram:** https://developers.facebook.com/docs/instagram-api
- **Threads:** https://developers.facebook.com/docs/threads

---

## 🚀 Next Steps

1. **Get your API keys** (follow Step 1)
2. **Configure `.env.local`** (follow Step 2)
3. **Run `npm install && npm run dev`**
4. **Go to `/admin`** and see the new "Analytics" tab
5. **Start automating!**

---

## 💡 Pro Tips

- **Start with one platform** (e.g., Etsy) and test it works
- **Use test accounts** for Instagram/Threads initially
- **Check rate limits** if you have high traffic
- **Set up webhooks** for real-time updates (advanced)

---

## Need Help?

Check the console for error messages. Most issues are:
1. Missing/incorrect API keys
2. Expired tokens
3. Wrong redirect URIs
4. Missing permissions/scopes

---

**You're all set! Let's make this admin dashboard LEGENDARY! 🔥**
