"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { logEvent, getProducts } from "@/lib/firebase-utils"

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

const categories = ["ALL", "DIGITAL PRODUCTS", "SHOES", "CLOTHING", "ACCESSORIES", "NEW ARRIVALS"]
const sortOptions = [
  { label: "NEWEST FIRST", value: "newest" },
  { label: "PRICE: LOW TO HIGH", value: "price-asc" },
  { label: "PRICE: HIGH TO LOW", value: "price-desc" },
  { label: "NAME: A-Z", value: "name-asc" },
  { label: "NAME: Z-A", value: "name-desc" }
]

export default function ProductsPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showOnSale, setShowOnSale] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category: string) => {
    logEvent('filter_products', {
      filter_type: 'category',
      filter_value: category
    })
    setSelectedCategory(category)
  }

  const parsePrice = (priceString: string): number => {
    return parseFloat(priceString.replace(/[^0-9.]/g, ''))
  }

  const sortProducts = (products: Product[]): Product[] => {
    const sorted = [...products]
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
      case 'price-desc':
        return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return sorted
    }
  }

  let filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "ALL" || 
      product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      product.name.toLowerCase().includes(selectedCategory.toLowerCase())
    
    const searchMatch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const saleMatch = !showOnSale || (product.discountPercentage && product.discountPercentage > 0)
    
    return categoryMatch && searchMatch && saleMatch
  })

  filteredProducts = sortProducts(filteredProducts)

  const categoryCount = (category: string) => {
    if (category === "ALL") return products.length
    return products.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase()) ||
      p.name.toLowerCase().includes(category.toLowerCase())
    ).length
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="products" />

      {/* Header */}
      <section className="px-8 py-16 border-b-2 border-black dark:border-white">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-widest uppercase mb-4">
              PRODUCTS
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
              Explore our curated collection of premium products. Filter, search, and discover your next favorite item.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div
              className={`lg:col-span-1 transition-all duration-700 ${
                isPageLoaded ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="sticky top-24 space-y-8">
                {/* Filter Toggle for Mobile */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden w-full flex items-center justify-between bg-gray-50 dark:bg-black border-2 border-black dark:border-white px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <span className="text-sm font-medium tracking-widest uppercase flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    FILTERS
                  </span>
                  <X className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-0' : 'rotate-45'}`} />
                </button>

                <div className={`space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase mb-4 pb-2 border-b-2 border-black dark:border-white">
                      SEARCH
                    </h3>
                    <div className="flex items-center bg-gray-50 dark:bg-black px-3 py-3 border-2 border-black dark:border-white">
                      <Search className="w-4 h-4 mr-2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm outline-none w-full font-mono"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="ml-2">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase mb-4 pb-2 border-b-2 border-black dark:border-white">
                      CATEGORIES
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryFilter(category)}
                          className={`w-full text-left px-4 py-3 text-sm tracking-wider transition-all duration-300 border-2 ${
                            selectedCategory === category
                              ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white font-bold"
                              : "bg-transparent border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category}</span>
                            <span className="text-xs">{categoryCount(category)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase mb-4 pb-2 border-b-2 border-black dark:border-white">
                      SORT BY
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-black border-2 border-black dark:border-white text-sm font-mono tracking-wider outline-none cursor-pointer"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Special Filters */}
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase mb-4 pb-2 border-b-2 border-black dark:border-white">
                      SPECIAL
                    </h3>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showOnSale}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowOnSale(e.target.checked)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-sm tracking-wider group-hover:translate-x-1 transition-transform">
                        ON SALE ONLY
                      </span>
                    </label>
                  </div>

                  {/* Active Filters Summary */}
                  {(searchQuery || selectedCategory !== "ALL" || showOnSale) && (
                    <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold tracking-widest uppercase">
                          ACTIVE FILTERS
                        </h3>
                        <button
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedCategory("ALL")
                            setShowOnSale(false)
                          }}
                          className="text-xs underline hover:no-underline"
                        >
                          CLEAR ALL
                        </button>
                      </div>
                      <div className="space-y-2">
                        {searchQuery && (
                          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-3 py-2 text-xs">
                            <span>Search: "{searchQuery}"</span>
                            <button onClick={() => setSearchQuery("")}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {selectedCategory !== "ALL" && (
                          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-3 py-2 text-xs">
                            <span>{selectedCategory}</span>
                            <button onClick={() => setSelectedCategory("ALL")}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {showOnSale && (
                          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-3 py-2 text-xs">
                            <span>ON SALE</span>
                            <button onClick={() => setShowOnSale(false)}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div
                className={`flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 transition-all duration-700 ${
                  isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 tracking-wider">
                  SHOWING <span className="font-bold text-black dark:text-white">{filteredProducts.length}</span> PRODUCTS
                </p>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
                  <p className="text-sm font-mono tracking-widest uppercase text-gray-500 dark:text-white">
                    LOADING PRODUCTS...
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-lg font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-4">
                    NO PRODUCTS FOUND
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("ALL")
                      setShowOnSale(false)
                    }}
                    variant="outline"
                    className="border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                  >
                    CLEAR FILTERS
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`group cursor-pointer transition-all duration-700 ${
                        isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                      style={{ transitionDelay: `${500 + index * 50}ms` }}
                      onClick={() => window.location.href = `/products/${product.id}`}
                    >
                      <div className="border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black hover:shadow-2xl transition-shadow duration-300">
                        {/* Product Image */}
                        <div className="relative overflow-hidden bg-gray-50 dark:bg-black aspect-square">
                          <ImageWithLoading
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {product.discountPercentage && (
                            <div className="absolute top-4 right-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-bold tracking-wider">
                              -{product.discountPercentage}%
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-5 space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono mb-2">
                              {product.category}
                            </p>
                            <h3 className="text-lg font-bold tracking-wide mb-2 line-clamp-1 group-hover:underline">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            {product.originalPrice && product.discountPercentage ? (
                              <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-bold text-black dark:text-white">
                                  {product.price}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                  {product.originalPrice}
                                </span>
                              </div>
                            ) : (
                              <div className="mb-4">
                                <span className="text-2xl font-bold">
                                  {product.price}
                                </span>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation()
                                  window.location.href = `/products/${product.id}`
                                }}
                                className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-xs font-medium tracking-widest uppercase py-4 transition-all duration-300"
                              >
                                VIEW
                              </Button>
                              {product.buyUrl && (
                                <Button
                                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation()
                                    logEvent('purchase_click', {
                                      item_id: product.id,
                                      item_name: product.name,
                                      page: 'products'
                                    })
                                    window.open(product.buyUrl, '_blank', 'noopener,noreferrer')
                                  }}
                                  variant="outline"
                                  className="flex-1 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-xs font-medium tracking-widest uppercase py-4 transition-all duration-300"
                                >
                                  BUY
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t-2 border-black dark:border-white px-8 py-16 bg-gray-50 dark:bg-black transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
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
