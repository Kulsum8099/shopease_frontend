"use client"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Package } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { toast } from "react-toastify"

interface ProductCardProps {
  id: string
  slug: string;
  name: string
  price: number
  category: string
  image: string
  rating: number
  isNew?: boolean
  discount?: number
  stock?: number
  onAddToCart?: (id: string, name: string) => void
  onAddToWishlist?: (id: string, name: string) => void
}

export function ProductCard({
  id,
  name,
  price,
  category,
  image,
  stock,
  rating,
  slug,
  isNew = false,
  discount = 0,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const handleAddToCart = () => {
    setIsAddingToCart(true)

    // Check stock before adding to cart
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
    const existingItem = cartItems.find((item: any) => item.id === id.toString())
    
    if (existingItem) {
      // Check if adding one more would exceed stock
      if (existingItem.quantity >= stock) {
        toast.error(`Cannot add more. Only ${stock} items available in stock.`)
        setIsAddingToCart(false)
        return
      }
      existingItem.quantity += 1
    } else {
      // Check if stock is available for new item
      if (stock <= 0) {
        toast.error("This item is out of stock.")
        setIsAddingToCart(false)
        return
      }
      cartItems.push({
        id: id.toString(),
        name,
        price,
        image,
        quantity: 1,
        color: "Default",
        maxStock: stock, // Store max stock for validation
      })
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    window.dispatchEvent(new CustomEvent("cartUpdated"))

    setTimeout(() => {
      if (onAddToCart) {
        onAddToCart(id.toString(), name)
      }
      setIsAddingToCart(false)
    }, 600)
  }

  const handleAddToWishlist = () => {
    setIsAddingToWishlist(true)

    // Add to localStorage
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
    const existingItem = wishlistItems.find((item: any) => item.id === id.toString())

    if (existingItem) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter((item: any) => item.id !== id.toString())
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist))
      setIsInWishlist(false)
    } else {
      // Add to wishlist
      wishlistItems.push({
        id: id.toString(),
        name,
        price,
        image,
        category,
      })
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems))
      setIsInWishlist(true)
    }

    window.dispatchEvent(new CustomEvent("wishlistUpdated"))

    setTimeout(() => {
      if (onAddToWishlist) {
        onAddToWishlist(id.toString(), name)
      }
      setIsAddingToWishlist(false)
    }, 600)
  }

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute top-2 left-2 z-10 space-y-1">
          {isNew && (
            <div className="bg-rose-600 text-white text-xs font-medium px-2 py-1 rounded">
              New
            </div>
          )}
          {discount > 0 && (
            <div className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
          {stock === 0 && (
            <div className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
          {stock <= 5 && stock > 0 && (
            <div className="bg-orange-600 text-white text-xs font-medium px-2 py-1 rounded">
              Low Stock
            </div>
          )}
        </div>
        <Link href={`/products/${slug}`}>
          <Image
            src={image}
            // width={400}
            // height={400}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105 "
          />
        </Link>
        <div className="absolute top-2 right-2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${
                    isInWishlist
                      ? "bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-200"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                >
                  <Heart
                    size={16}
                    className={isInWishlist ? "fill-rose-600" : ""}
                  />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-gray-500">{category}</div>
        <Link href={`/products/${slug}`}>
          <h3 className="font-medium mt-1 hover:text-rose-600">{name}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">৳{price.toFixed(2)}</span>
          {rating && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : i < rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">{rating}</span>
            </div>
          )}
        </div>
        {stock === 0 ? (
          <Button
            className="w-full mt-3 bg-gray-400 cursor-not-allowed"
            disabled={true}
          >
            <Package size={16} className="mr-2" />
            Out of Stock
          </Button>
        ) : (
          <div className="mt-3 space-y-2">
            {stock <= 5 && stock > 0 && (
              <div className="text-xs text-orange-600 font-medium text-center">
                Only {stock} left in stock!
              </div>
            )}
            <Button
              className="w-full bg-rose-600 hover:bg-rose-700"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart size={16} className="mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
