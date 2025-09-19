"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/app/components/page-header"
import { ProductCard } from "@/app/components/product-card"

interface WishlistItem {
  id: string
  name: string
  price: number
  stock?: number
  category: string
  image: string
  inStock?: boolean
  slug?: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  console.log("wishlistItems", wishlistItems)

  const removeItem = (id: string) => {
    try {
      const updatedItems = wishlistItems.filter((item) => item.id !== id)
      setWishlistItems(updatedItems)
      localStorage.setItem("wishlistItems", JSON.stringify(updatedItems))
      window.dispatchEvent(new Event("wishlistUpdated"))
      // toast.success("Item removed from wishlist")
    } catch (error) {
      console.error("Error removing item:", error)
      // toast.error("Failed to remove item")
    }
  }

  const moveToCart = (id: string) => {
    try {
      const itemToMove = wishlistItems.find((item) => item.id === id)
      if (!itemToMove) return

      // Get current cart items
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item: { id: string }) => item.id === id
      )

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        cartItems[existingItemIndex].quantity += 1
      } else {
        // Add new item to cart
        cartItems.push({ ...itemToMove, quantity: 1 })
      }

      // Update cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      window.dispatchEvent(new Event("cartUpdated"))

      // Remove from wishlist
      removeItem(id)

      // toast.success("Item moved to cart")
    } catch (error) {
      console.error("Error moving to cart:", error)
      // toast.error("Failed to move item to cart")
    }
  }

  useEffect(() => {
    const updateWishlist = () => {
      try {
        const items = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
        setWishlistItems(items)
      } catch (error) {
        console.error("Error updating wishlist:", error)
        // toast.error("Failed to load wishlist")
      } finally {
        setIsLoading(false)
      }
    }

    // Initial load
    updateWishlist()

    // Set up event listeners
    const handleStorageUpdate = () => updateWishlist()
    window.addEventListener("wishlistUpdated", handleStorageUpdate)
    window.addEventListener("storage", handleStorageUpdate)

    return () => {
      window.removeEventListener("wishlistUpdated", handleStorageUpdate)
      window.removeEventListener("storage", handleStorageUpdate)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader title="Your Wishlist" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader title="Your Wishlist" />

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Heart size={32} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">
            Save items you love to your wishlist and review them anytime.
          </p>
          <Link href="/products">
            <Button className="bg-rose-600 hover:bg-rose-700">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.inStock === false && (
                  <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center rounded-lg">
                    <span className="text-white font-medium px-3 py-1 bg-black/70 rounded">
                      Out of Stock
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>
                </div>
                <ProductCard
                  id={item.id}
                  slug={item.slug || item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  stock={item.stock}
                  image={item.image}
                  onAddToCart={() => moveToCart(item.id)}
                  onAddToWishlist={() => removeItem(item.id)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/products"
              className="text-rose-600 hover:text-rose-700 flex items-center"
            >
              <ChevronLeft size={16} className="mr-1" />
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { ChevronLeft, Heart, Trash2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { PageHeader } from "@/app/components/page-header"
// import { ProductCard } from "@/app/components/product-card"


// export default function WishlistPage() {
//   const [wishlistItems, setWishlistItems] = useState()
//   const [cartItemsCount, setCartItemsCount] = useState(0)
//   const [wishlistCount, setWishlistCount] = useState(0)

//   console.log("wishlistItems", wishlistItems);


//   const removeItem = (id: number) => {
//     setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id))
//   }

//   const moveToCart = (id: number) => {
//     // In a real app, this would add the item to the cart
//     // and then remove it from the wishlist
//     console.log(`Moving item ${id} to cart`)
//     removeItem(id)
//   }

//   useEffect(() => {
//     const updateCounts = () => {
//       try {
//         const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
//         const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
//         setWishlistItems(wishlistItems)
//         setCartItemsCount(cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0))
//         setWishlistCount(wishlistItems.length)
//       } catch (error) {
//         console.error("Error updating counts:", error)
//       }
//     }

//     updateCounts()
//     window.addEventListener("cartUpdated", updateCounts)
//     window.addEventListener("wishlistUpdated", updateCounts)
//     window.addEventListener("storage", updateCounts)
//     window.addEventListener("focus", updateCounts)

//     return () => {
//       window.removeEventListener("cartUpdated", updateCounts)
//       window.removeEventListener("wishlistUpdated", updateCounts)
//       window.removeEventListener("storage", updateCounts)
//       window.removeEventListener("focus", updateCounts)
//     }
//   }, [])


//   // Check if wishlist is empty
//   const isWishlistEmpty = wishlistItems?.length === 0

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <PageHeader title="Your Wishlist" />

//       {isWishlistEmpty ? (
//         <div className="text-center py-12">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//             <Heart size={32} className="text-gray-500" />
//           </div>
//           <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
//           <p className="text-gray-500 mb-6">Save items you love to your wishlist and review them anytime.</p>
//           <Link href="/products">
//             <Button className="bg-rose-600 hover:bg-rose-700">Explore Products</Button>
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {wishlistItems.map((item) => (
//               <div key={item.id} className="relative">
//                 {!item.inStock && (
//                   <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center rounded-lg">
//                     <span className="text-white font-medium px-3 py-1 bg-black/70 rounded">Out of Stock</span>
//                   </div>
//                 )}
//                 <div className="absolute top-2 right-2 z-20">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeItem(item.id)}
//                     className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-600"
//                   >
//                     <Trash2 size={16} />
//                     <span className="sr-only">Remove from wishlist</span>
//                   </Button>
//                 </div>
//                 <ProductCard
//                   id={item.id}
//                   name={item.name}
//                   price={item.price}
//                   category={item.category}
//                   image={item.image}
//                   onAddToCart={() => moveToCart(item.id)}
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-center mt-8">
//             <Link href="/products" className="text-rose-600 hover:text-rose-700 flex items-center">
//               <ChevronLeft size={16} className="mr-1" />
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
