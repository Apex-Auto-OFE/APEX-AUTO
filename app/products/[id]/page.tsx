"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { getProduct, logEvent } from "@/lib/firebase-utils"

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

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    
    loadProduct()
    
    return () => clearTimeout(timer)
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const productData = await getProduct(productId)
      setProduct(productData)
      
      logEvent('view_product', {
        item_id: productData.id,
        item_name: productData.name,
        category: productData.category,
        price: productData.price
      })
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = () => {
    if (product?.buyUrl) {
      logEvent('purchase_attempt', {
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price,
        redirect_url: product.buyUrl
      })
      window.open(product.buyUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : product?.image 
      ? [product.image] 
      : []

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-sm font-mono tracking-widest uppercase">LOADING PRODUCT...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest uppercase mb-4">PRODUCT NOT FOUND</h1>
          <Button
            onClick={() => window.location.href = '/products'}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO PRODUCTS
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="products" />

      {/* Product Detail Section */}
      <div className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div
            className={`mb-8 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Button
              variant="outline"
              onClick={() => window.location.href = '/products'}
              className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium tracking-widest uppercase"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO PRODUCTS
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {/* Main Image */}
              <div className="bg-gray-50 dark:bg-gray-900 mb-6 overflow-hidden border-2 border-black dark:border-white">
                <ImageWithLoading
                  src={productImages[selectedImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-[600px] object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImageIndex === index
                          ? "border-black dark:border-white"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <ImageWithLoading
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="space-y-6">
                {/* Category */}
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">
                  {product.category}
                </p>

                {/* Product Name */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-wide leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="py-6 border-y border-gray-200 dark:border-gray-700">
                  {product.originalPrice && product.discountPercentage ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl font-bold text-black dark:text-white">
                          {product.price}
                        </span>
                        <span className="text-2xl text-gray-400 line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                      <div className="inline-block">
                        <span className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-bold tracking-wider">
                          SAVE {product.discountPercentage}% - LIMITED TIME OFFER
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-5xl font-bold">
                      {product.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium tracking-widest uppercase">
                    PRODUCT DETAILS
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Buy Button - Always Visible */}
                <div className="pt-6">
                  <Button
                    onClick={handleBuyNow}
                    disabled={!product.buyUrl}
                    className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed border-0 text-base font-medium tracking-widest uppercase px-8 py-8 transition-all duration-300 hover:scale-105"
                  >
                    {product.buyUrl ? 'BUY NOW' : 'COMING SOON'}
                    {product.buyUrl && <ExternalLink className="ml-3 w-5 h-5" />}
                  </Button>
                  {product.buyUrl && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                      You will be redirected to complete your purchase
                    </p>
                  )}
                  {!product.buyUrl && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                      Purchase link not yet available
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-sm font-medium tracking-widest uppercase mb-2 text-gray-500 dark:text-gray-400">
                      CATEGORY
                    </h3>
                    <p className="text-base font-mono">{product.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium tracking-widest uppercase mb-2 text-gray-500 dark:text-gray-400">
                      PRODUCT ID
                    </h3>
                    <p className="text-base font-mono">#{product.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`border-t border-gray-200 dark:border-gray-800 px-8 py-16 bg-gray-50 dark:bg-black transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "800ms" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-mono tracking-widest uppercase">
            © 2025 APEX AUTO, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
