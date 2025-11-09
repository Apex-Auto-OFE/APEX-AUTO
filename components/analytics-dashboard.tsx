"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ShoppingBag, TrendingUp, Users, DollarSign, Eye, Heart, MessageCircle, Share2, RefreshCw, Send, Calendar } from 'lucide-react'

interface PlatformStats {
  etsy?: {
    shopName: string
    totalSales: number
    totalViews: number
    totalFavorites: number
    activeListings: number
    currency: string
  }
  pinterest?: {
    followers: number
    boardCount: number
    pinCount: number
    monthlyViews: number
  }
  instagram?: {
    followersCount: number
    mediaCount: number
    reach: number
    impressions: number
    engagement: number
  }
  threads?: {
    followersCount: number
    postsCount: number
    totalViews: number
    totalLikes: number
  }
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<PlatformStats>({})
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'post' | 'sync'>('overview')
  
  // Post form state
  const [postData, setPostData] = useState({
    imageUrl: '',
    caption: '',
    platforms: {
      instagram: true,
      threads: true,
      pinterest: false
    }
  })

  useEffect(() => {
    loadAllStats()
  }, [])

  const loadAllStats = async () => {
    setLoading(true)
    try {
      const [etsyRes, pinterestRes, instagramRes, threadsRes] = await Promise.allSettled([
        fetch('/api/integrations/etsy?action=stats').then(r => r.ok ? r.json() : null),
        fetch('/api/integrations/pinterest?action=stats').then(r => r.ok ? r.json() : null),
        fetch('/api/integrations/instagram?action=stats').then(r => r.ok ? r.json() : null),
        fetch('/api/integrations/threads?action=stats').then(r => r.ok ? r.json() : null),
      ])

      setStats({
        etsy: etsyRes.status === 'fulfilled' ? etsyRes.value : undefined,
        pinterest: pinterestRes.status === 'fulfilled' ? pinterestRes.value : undefined,
        instagram: instagramRes.status === 'fulfilled' ? instagramRes.value : undefined,
        threads: threadsRes.status === 'fulfilled' ? threadsRes.value : undefined,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncEtsy = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/integrations/etsy?action=sync')
      const data = await response.json()
      
      if (data.success) {
        alert(`Successfully synced ${data.products.length} products from Etsy!`)
        // Here you would typically save these products to Firebase
      }
    } catch (error) {
      console.error('Error syncing Etsy:', error)
      alert('Failed to sync Etsy products')
    } finally {
      setSyncing(false)
    }
  }

  const handleCrossPost = async () => {
    if (!postData.imageUrl || !postData.caption) {
      alert('Please fill in image URL and caption')
      return
    }

    const selectedPlatforms = Object.entries(postData.platforms)
      .filter(([_, enabled]) => enabled)
      .map(([platform]) => platform)

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    try {
      const promises = []

      if (postData.platforms.instagram) {
        promises.push(
          fetch('/api/integrations/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'publish-post',
              data: { imageUrl: postData.imageUrl, caption: postData.caption }
            })
          })
        )
      }

      if (postData.platforms.threads) {
        promises.push(
          fetch('/api/integrations/threads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'publish-post',
              data: { text: postData.caption, imageUrl: postData.imageUrl }
            })
          })
        )
      }

      if (postData.platforms.pinterest) {
        // You'll need to select a board ID
        promises.push(
          fetch('/api/integrations/pinterest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create-pin',
              data: {
                boardId: 'YOUR_BOARD_ID', // You'll need to get this from boards list
                title: postData.caption.substring(0, 100),
                description: postData.caption,
                link: process.env.NEXT_PUBLIC_APP_URL || 'https://yourwebsite.com',
                imageUrl: postData.imageUrl
              }
            })
          })
        )
      }

      await Promise.all(promises)
      alert(`Successfully posted to ${selectedPlatforms.join(', ')}!`)
      
      // Reset form
      setPostData({
        imageUrl: '',
        caption: '',
        platforms: { instagram: true, threads: true, pinterest: false }
      })
    } catch (error) {
      console.error('Error cross-posting:', error)
      alert('Failed to post to some platforms')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-sm font-mono tracking-widest uppercase text-gray-500">LOADING ANALYTICS...</p>
      </div>
    )
  }

  const totalFollowers = (stats.pinterest?.followers || 0) + (stats.instagram?.followersCount || 0) + (stats.threads?.followersCount || 0)
  const totalRevenue = stats.etsy?.totalSales || 0
  const totalEngagement = (stats.instagram?.engagement || 0) + (stats.threads?.totalLikes || 0)

  return (
    <div className="space-y-8">
      {/* Section Navigation */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
            activeSection === 'overview'
              ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          📊 OVERVIEW
        </button>
        <button
          onClick={() => setActiveSection('post')}
          className={`px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
            activeSection === 'post'
              ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          📤 CROSS-POST
        </button>
        <button
          onClick={() => setActiveSection('sync')}
          className={`px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
            activeSection === 'sync'
              ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          🔄 SYNC
        </button>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 border-2 border-black dark:border-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8" />
                <span className="text-xs font-mono tracking-widest uppercase text-gray-600 dark:text-gray-300">REVENUE</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{totalRevenue}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Total Etsy Sales</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 border-2 border-black dark:border-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <span className="text-xs font-mono tracking-widest uppercase text-gray-600 dark:text-gray-300">FOLLOWERS</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{totalFollowers.toLocaleString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Across All Platforms</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 border-2 border-black dark:border-white">
              <div className="flex items-center justify-between mb-4">
                <Heart className="w-8 h-8" />
                <span className="text-xs font-mono tracking-widest uppercase text-gray-600 dark:text-gray-300">ENGAGEMENT</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{totalEngagement.toLocaleString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Total Interactions</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-6 border-2 border-black dark:border-white">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-8 h-8" />
                <span className="text-xs font-mono tracking-widest uppercase text-gray-600 dark:text-gray-300">VIEWS</span>
              </div>
              <div className="text-3xl font-bold tracking-tight">{((stats.etsy?.totalViews || 0) + (stats.pinterest?.monthlyViews || 0)).toLocaleString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Monthly Total</div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Etsy */}
            {stats.etsy && (
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    ETSY
                  </h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 font-mono">CONNECTED</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Shop Name</span>
                    <span className="font-bold">{stats.etsy.shopName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Total Sales</span>
                    <span className="font-bold">{stats.etsy.totalSales}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Total Views</span>
                    <span className="font-bold">{stats.etsy.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Favorites</span>
                    <span className="font-bold">{stats.etsy.totalFavorites.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Active Listings</span>
                    <span className="font-bold">{stats.etsy.activeListings}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pinterest */}
            {stats.pinterest && (
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
                    📌 PINTEREST
                  </h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 font-mono">CONNECTED</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Followers</span>
                    <span className="font-bold">{stats.pinterest.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Boards</span>
                    <span className="font-bold">{stats.pinterest.boardCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Total Pins</span>
                    <span className="font-bold">{stats.pinterest.pinCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Monthly Views</span>
                    <span className="font-bold">{stats.pinterest.monthlyViews.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instagram */}
            {stats.instagram && (
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
                    📸 INSTAGRAM
                  </h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 font-mono">CONNECTED</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Followers</span>
                    <span className="font-bold">{stats.instagram.followersCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Posts</span>
                    <span className="font-bold">{stats.instagram.mediaCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Reach</span>
                    <span className="font-bold">{stats.instagram.reach.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Impressions</span>
                    <span className="font-bold">{stats.instagram.impressions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Threads */}
            {stats.threads && (
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
                    🧵 THREADS
                  </h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900 px-3 py-1 font-mono">CONNECTED</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Followers</span>
                    <span className="font-bold">{stats.threads.followersCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Posts</span>
                    <span className="font-bold">{stats.threads.postsCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Total Views</span>
                    <span className="font-bold">{stats.threads.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono tracking-wider uppercase text-gray-600 dark:text-gray-400">Total Likes</span>
                    <span className="font-bold">{stats.threads.totalLikes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <div className="text-center">
            <Button
              onClick={loadAllStats}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-8 py-3"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              REFRESH ALL STATS
            </Button>
          </div>
        </>
      )}

      {/* Cross-Post Section */}
      {activeSection === 'post' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-8">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <Send className="w-6 h-6" />
              CROSS-PLATFORM POSTING
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium tracking-widest uppercase mb-2">
                  IMAGE URL
                </label>
                <Input
                  value={postData.imageUrl}
                  onChange={(e) => setPostData({ ...postData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium tracking-widest uppercase mb-2">
                  CAPTION
                </label>
                <Textarea
                  value={postData.caption}
                  onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
                  placeholder="Write your caption here..."
                  rows={6}
                  className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white"
                />
                <p className="text-xs text-gray-500 mt-1">{postData.caption.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium tracking-widest uppercase mb-3">
                  SELECT PLATFORMS
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postData.platforms.instagram}
                      onChange={(e) => setPostData({
                        ...postData,
                        platforms: { ...postData.platforms, instagram: e.target.checked }
                      })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-mono tracking-wider">📸 Instagram</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postData.platforms.threads}
                      onChange={(e) => setPostData({
                        ...postData,
                        platforms: { ...postData.platforms, threads: e.target.checked }
                      })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-mono tracking-wider">🧵 Threads</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postData.platforms.pinterest}
                      onChange={(e) => setPostData({
                        ...postData,
                        platforms: { ...postData.platforms, pinterest: e.target.checked }
                      })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-mono tracking-wider">📌 Pinterest</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleCrossPost}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase py-4"
              >
                <Share2 className="w-4 h-4 mr-2" />
                POST TO SELECTED PLATFORMS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Section */}
      {activeSection === 'sync' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-8">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <RefreshCw className="w-6 h-6" />
              SYNC ETSY PRODUCTS
            </h2>
            
            <div className="space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Automatically import all your active Etsy listings to your website. This will fetch product names, prices, images, and descriptions.
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-3">WHAT WILL BE SYNCED:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Product names and descriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Prices and images
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Product URLs (links back to Etsy)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Active listings only
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleSyncEtsy}
                disabled={syncing}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase py-4"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    SYNCING...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    SYNC NOW
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 font-mono">
                Last synced: Never
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
