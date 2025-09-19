"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/app/components/product-card"
import { useToast } from "@/components/ui/toast"
import { HeroSlider } from "@/components/home/hero-slider"
import { useGet } from "@/hooks/useGet"
import { productApiResponse } from "@/components/products/list"
import { useMemo } from "react"

interface Category {
  _id: string
  name: string
  description: string
  logo: string
}

// Helper functions outside component
const getCategoryIcon = (name: string): string => {
  const icons: Record<string, string> = {
    'Clothing': '👕',
    'Electronics': '📱',
    'Home & Kitchen': '🏠',
    'Beauty': '💄',
    'Sports': '⚽',
    'Books': '📚',
    '-': '🛍️' // Default for your empty category
  }
  return icons[name] || '🛍️'
}

const getCategoryColor = (name: string): string => {
  const colors: Record<string, string> = {
    'Clothing': 'from-blue-500 to-purple-600',
    'Electronics': 'from-green-500 to-teal-600',
    'Home & Kitchen': 'from-orange-500 to-red-600',
    'Beauty': 'from-pink-300 to-rose-600',
    'Sports': 'from-indigo-500 to-blue-600',
    'Books': 'from-purple-500 to-indigo-600',
    '-': 'from-gray-500 to-gray-600'
  }
  return colors[name] || 'from-gray-500 to-gray-600'
}

const getCategoryHoverColor = (name: string): string => {
  const colors: Record<string, string> = {
    'Clothing': 'hover:from-blue-600 hover:to-purple-700',
    'Electronics': 'hover:from-green-600 hover:to-teal-700',
    'Home & Kitchen': 'hover:from-orange-600 hover:to-red-700',
    'Beauty': 'hover:from-pink-600 hover:to-rose-700',
    'Sports': 'hover:from-indigo-600 hover:to-blue-700',
    'Books': 'hover:from-purple-600 hover:to-indigo-700',
    '-': 'hover:from-gray-600 hover:to-gray-700'
  }
  return colors[name] || 'hover:from-gray-600 hover:to-gray-700'
}

export default function HomePage() {
  const { addToast } = useToast()

  // Fetch categories from API
  const { data: categoriesData } = useGet<{ data: Category[] }>(
    '/category',
    ['categories']
  )

  // Fetch products
  const { data, isLoading, refetch, error } = useGet<productApiResponse>(
    `/product?limit=8`, // Only fetch 8 products for the homepage
    ["homepage-products"]
  )

  // Transform categories data
  const categories = useMemo(() => {
    if (!categoriesData?.data) return []

    return categoriesData.data.map(category => ({
      id: category._id,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, "-"),
      icon: getCategoryIcon(category.name),
      color: getCategoryColor(category.name),
      hoverColor: getCategoryHoverColor(category.name)
    }))
  }, [categoriesData])

  // Transform products data
  const products = useMemo(() => {
    return (
      data?.data?.map((product) => ({
        ...product,
        id: product._id || product.id,
        category: product.category || { name: 'Uncategorized' }
      })) || []
    )
  }, [data])

  const handleAddToCart = (id: string, name: string) => {
    addToast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
      action: (
        <Link href="/cart">
          <Button size="sm" variant="outline">
            View Cart
          </Button>
        </Link>
      ),
    })
  }

  const handleAddToWishlist = (id: string, name: string) => {
    addToast({
      title: "Added to Wishlist",
      description: `${name} has been added to your wishlist.`,
      action: (
        <Link href="/wishlist">
          <Button size="sm" variant="outline">
            View Wishlist
          </Button>
        </Link>
      ),
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlider />

      {/* Categories Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-gray-600">Discover products tailored to your needs</p>
          </div>
          <Link href="/categories" className="text-rose-600 hover:text-rose-700 flex items-center font-medium">
            View All <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br ${category.color} ${category.hoverColor} transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl`}
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <div className="text-7xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-center text-sm lg:text-base leading-tight">
                      {category.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/products" className="text-rose-600 hover:text-rose-700 flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Failed to load products</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard

                  slug={product.slug}
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  category={product.category?.name || "Uncategorized"}
                  image={product.images?.[0] ?? ""}
                  rating={4.5}
                  stock={product?.stock}
                  onAddToCart={() => handleAddToCart(product.id, product.name)}
                  onAddToWishlist={() => handleAddToWishlist(product.id, product.name)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
      {/* <section className="py-12 container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/90 to-orange-500/90 z-10" />
          <div className="relative h-[300px] w-full">
            <Image
              src="/fashion-sale-banner.png"
              alt="Sale Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center container mx-auto px-4">
            <div className="max-w-lg text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale</h2>
              <p className="text-lg mb-6">Get up to 50% off on selected items. Limited time offer.</p>
              <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100">
                Shop the Sale
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
}
