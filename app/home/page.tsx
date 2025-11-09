"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Instagram, ShoppingBag, AtSign } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { logEvent, getSocialMediaUrls, getProducts } from '@/lib/firebase-utils'

// Pinterest Icon Component
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
)


interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string
  discountPercentage?: number
  category: string
  image: string
  images?: string[]
  description: string
  buyUrl?: string
}

export default function HomePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [socialMedia, setSocialMedia] = useState({
    instagram: "https://instagram.com/apexauto",
    pinterest: "https://pinterest.com/apexauto",
    etsy: "https://etsy.com/shop/apexauto",
    threads: "https://threads.net/@apexauto"
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    
    loadSocialMedia()
    loadProducts()
    
    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate products every 15 seconds
  useEffect(() => {
    if (products.length === 0) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentProductIndex((prev) => (prev + 1) % products.length)
        setIsTransitioning(false)
      }, 500)
    }, 15000)

    return () => clearInterval(interval)
  }, [products.length])

  const loadProducts = async () => {
    try {
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadSocialMedia = async () => {
    try {
      const urls = await getSocialMediaUrls()
      setSocialMedia(urls)
    } catch (error) {
      console.error('Error loading social media URLs:', error)
    }
  }

  const handleShopNowClick = () => {
    logEvent('cta_click', {
      cta_name: 'shop_now',
      page: 'home'
    })
    window.location.href = '/products'
  }

  const handleAboutClick = () => {
    logEvent('cta_click', {
      cta_name: 'about_us',
      page: 'home'
    })
    window.location.href = '/about'
  }

  const handleSocialClick = (platform: string, url: string) => {
    logEvent('social_click', {
      platform,
      page: 'home'
    })
    window.open(url, '_blank')
  }

  const handleProductClick = () => {
    const product = products[currentProductIndex]
    if (product) {
      logEvent('product_click', {
        item_id: product.id,
        item_name: product.name,
        page: 'home'
      })
      window.location.href = `/products/${product.id}`
    }
  }

  const currentProduct = products[currentProductIndex]

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="home" />

      {/* Main Landing Page Content */}
      <div className="min-h-screen flex items-center justify-center px-8 py-16">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Brand & Info */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <h1 className="text-7xl md:text-9xl font-bold tracking-widest uppercase mb-6 leading-none">
                APEX AUTO
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-mono tracking-wider mb-4 leading-relaxed">
                PREMIUM PRODUCTS.<br />
                EXCEPTIONAL QUALITY.<br />
                TIMELESS STYLE.
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                Discover our curated collection of premium products designed for those who appreciate quality and craftsmanship. Each item is carefully selected to meet our exceptional standards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-8 py-6 transition-all duration-300 hover:scale-105"
                  onClick={handleShopNowClick}
                >
                  SHOP NOW
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-sm font-medium tracking-widest uppercase bg-transparent px-8 py-6 transition-all duration-300 hover:scale-105"
                  onClick={handleAboutClick}
                >
                  ABOUT US
                </Button>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-500 dark:text-gray-400">
                  FOLLOW US
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleSocialClick('instagram', socialMedia.instagram)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleSocialClick('pinterest', socialMedia.pinterest)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Pinterest"
                  >
                    <PinterestIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleSocialClick('etsy', socialMedia.etsy)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Etsy"
                  >
                    <ShoppingBag className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleSocialClick('threads', socialMedia.threads)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Threads"
                  >
                    <AtSign className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Product Showcase */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="bg-gray-50 dark:bg-black p-8 border-2 border-black dark:border-white relative overflow-hidden">
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium tracking-widest uppercase">
                    FEATURED PRODUCT
                  </h2>
                  <div className="flex gap-2">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setCurrentProductIndex(index)
                            setIsTransitioning(false)
                          }, 500)
                        }}
                        className={`h-2 transition-all duration-300 cursor-pointer hover:bg-gray-500 ${
                          index === currentProductIndex
                            ? "bg-black dark:bg-white w-8"
                            : "bg-gray-300 dark:bg-gray-600 w-2"
                        }`}
                        aria-label={`View product ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {currentProduct ? (
                  <div
                    className={`transition-all duration-500 ${
                      isTransitioning
                        ? "opacity-0 translate-y-4 scale-95"
                        : "opacity-100 translate-y-0 scale-100"
                    }`}
                  >
                    <div
                      className="relative mb-6 overflow-hidden cursor-pointer group bg-white dark:bg-black"
                      onClick={handleProductClick}
                    >
                      <ImageWithLoading
                        src={currentProduct.image || "/placeholder.svg"}
                        alt={currentProduct.name}
                        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-lg font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 px-6 py-3">
                          VIEW DETAILS
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-medium tracking-wide mb-2">
                          {currentProduct.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">
                          {currentProduct.category}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {currentProduct.description}
                      </p>

                      <div className="flex items-end justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          {currentProduct.originalPrice && currentProduct.discountPercentage ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-red-600 dark:text-red-500">
                                  {currentProduct.price}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                  {currentProduct.originalPrice}
                                </span>
                              </div>
                              <span className="inline-block text-xs bg-red-600 text-white px-3 py-1 font-bold tracking-wider">
                                SAVE {currentProduct.discountPercentage}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-3xl font-bold">
                              {currentProduct.price}
                            </span>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => {
                            if (currentProduct.buyUrl) {
                              logEvent('purchase_click', {
                                item_id: currentProduct.id,
                                item_name: currentProduct.name,
                                price: currentProduct.price,
                                page: 'home'
                              })
                              window.open(currentProduct.buyUrl, '_blank', 'noopener,noreferrer')
                            } else {
                              handleProductClick()
                            }
                          }}
                          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:scale-105"
                        >
                          {currentProduct.buyUrl ? 'BUY NOW' : 'VIEW PRODUCT'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-mono tracking-widest uppercase">
                      NO PRODUCTS AVAILABLE
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Add products in the admin panel to display them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`border-t border-gray-200 dark:border-gray-800 px-8 py-8 bg-gray-50 dark:bg-black transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-mono tracking-widest uppercase">
            © 2025 APEX AUTO, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
