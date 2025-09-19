"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, LogOut, Package, Settings } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { isAuthenticated, logout } from "@/lib/auth"
import { useGet } from "@/hooks/useGet"
import { Category } from "@/components/categories/list"
import { jwtDecode } from "jwt-decode"
import { useCookies } from "next-client-cookies";


export function Navbar() {
  
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userData, setUserData] = useState<any>(null)
  const cookies = useCookies();
  const token = cookies.get("accessToken");

useEffect(()=>{
  if(token){
    const data=jwtDecode(token||"");
    setUserData(data);
  }
},[token])

  const { data: categoriesData } = useGet<{ data: Array<Category & { _id?: string }> }>(
    '/category',
    ['categories']
  )

  // Transform categories data
  const categories = useMemo(() => {
    if (!categoriesData?.data) return []

    return categoriesData.data.map(category => ({
      id: category._id || category.id,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, "-"),
      href: `/products?category=${category._id || category.id}`,
    }))
  }, [categoriesData])


  // Search is now handled manually on Enter key press only

  // Scroll effect with optimized throttling for better performance
  useEffect(() => {
    let ticking = false
    let lastScrollY = window.scrollY
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Only update if scroll difference is significant (more than 5px)
      if (Math.abs(currentScrollY - lastScrollY) < 5) return
      
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 10)
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cart and wishlist counts with optimized updates
  useEffect(() => {
    const updateCounts = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
        const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
        const newCartCount = cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0)
        const newWishlistCount = wishlistItems.length
        
        // Only update if counts actually changed
        setCartItemsCount(prev => prev !== newCartCount ? newCartCount : prev)
        setWishlistCount(prev => prev !== newWishlistCount ? newWishlistCount : prev)
      } catch (error) {
        console.error("Error updating counts:", error)
      }
    }

    updateCounts()
    window.addEventListener("cartUpdated", updateCounts)
    window.addEventListener("wishlistUpdated", updateCounts)
    window.addEventListener("storage", updateCounts)
    window.addEventListener("focus", updateCounts)

    return () => {
      window.removeEventListener("cartUpdated", updateCounts)
      window.removeEventListener("wishlistUpdated", updateCounts)
      window.removeEventListener("storage", updateCounts)
      window.removeEventListener("focus", updateCounts)
    }
  }, [])

  const isLoggedIn = isAuthenticated()

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path))

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow duration-150 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      {/* Top bar */}
      <div className="hidden sm:block bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div>Free shipping on orders over ৳50</div>
          <div className="flex items-center space-x-4">
            <Link href="/help" className="hover:text-gray-300">
              Help
            </Link>
            <Link href="/orders" className="hover:text-gray-300">
              Track Order
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu size={24} />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/images/Logo.png"
                      alt="Logo"
                      width={175}
                      height={48}
                    />
                  </Link>
                  <SheetClose className="rounded-full p-2 hover:bg-gray-100">
                    <X size={18} />
                  </SheetClose>
                </div>

                <div className="py-4 flex-1 overflow-auto">
                  {/* <div className="mb-4">
                    <Input
                      placeholder="Search products..."
                      className="w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery) {
                          router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
                          setIsSearchOpen(false)
                        }
                      }}
                    />
                  </div> */}

                  <nav className="space-y-1">
                    <Link
                      href="/"
                      className={`block px-4 py-2 rounded-md ${
                        isActive("/")
                          ? "bg-rose-50 text-rose-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Home
                    </Link>
                    <div className="py-2">
                      <div className="px-4 font-medium mb-1">Categories</div>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.id}`}
                          className={`block px-6 py-2 rounded-md ${
                            isActive(category.href)
                              ? "bg-rose-50 text-rose-600"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/cart"
                      className={`flex items-center justify-between px-4 py-2 rounded-md ${
                        isActive("/cart")
                          ? "bg-rose-50 text-rose-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>Cart</span>
                      {cartItemsCount > 0 && (
                        <Badge className="bg-rose-600">{cartItemsCount}</Badge>
                      )}
                    </Link>
                    <Link
                      href="/wishlist"
                      className={`flex items-center justify-between px-4 py-2 rounded-md ${
                        isActive("/wishlist")
                          ? "bg-rose-50 text-rose-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>Wishlist</span>
                      {wishlistCount > 0 && (
                        <Badge className="bg-rose-600">{wishlistCount}</Badge>
                      )}
                    </Link>
                    <Link
                      href="/orders"
                      className={`block px-4 py-2 rounded-md ${
                        isActive("/orders")
                          ? "bg-rose-50 text-rose-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      My Orders
                    </Link>
                  </nav>
                </div>

                <div className="py-4 border-t">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 rounded-md ${
                          isActive("/profile")
                            ? "bg-rose-50 text-rose-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-red-600"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className={`block px-4 py-2 rounded-md ${
                          isActive("/login")
                            ? "bg-rose-50 text-rose-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className={`block px-4 py-2 rounded-md ${
                          isActive("/register")
                            ? "bg-rose-50 text-rose-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/Logo.png" alt="Logo" width={100} height={100} />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive("/")
                  ? "text-rose-600"
                  : "text-gray-700 hover:text-rose-600"
              }`}
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-rose-600">
                Categories <ChevronDown size={16} className="ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/products"
              className={`text-sm font-medium ${
                isActive("/products")
                  ? "text-rose-600"
                  : "text-gray-700 hover:text-rose-600"
              }`}
            >
              All Products
            </Link>
            <Link
              href="/orders"
              className={`text-sm font-medium ${
                isActive("/orders")
                  ? "text-rose-600"
                  : "text-gray-700 hover:text-rose-600"
              }`}
            >
              My Orders
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-700 hover:text-rose-600">
              <Search size={20} />
              <span className="sr-only">Search</span>
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/wishlist"
                    className="hidden sm:flex text-gray-700 hover:text-rose-600 relative"
                  >
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 flex items-center justify-center bg-rose-600">
                        {wishlistCount}
                      </Badge>
                    )}
                    <span className="sr-only">Wishlist</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wishlist ({wishlistCount} items)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/cart"
                    className="relative text-gray-700 hover:text-rose-600"
                  >
                    <ShoppingCart size={20} />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 flex items-center justify-center bg-rose-600">
                        {cartItemsCount}
                      </Badge>
                    )}
                    <span className="sr-only">Cart</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cart ({cartItemsCount} items)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-gray-700 hover:text-rose-600"
                  >
                    <User size={20} />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {userData?.email || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userData?.role === "admin" ? "Admin" : "Customer"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`${
                        userData?.role === "admin"
                          ? "/admin/profile"
                          : "/profile"
                      }`}
                      className="cursor-pointer flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`${
                        userData?.role === "admin"
                          ? "/admin/orders"
                          : "/profile?tab=orders"
                      }`}
                      className="cursor-pointer flex items-center"
                    >
                      <Package size={16} className="mr-2" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {userData?.role !== "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile?tab=wishlist"
                        className="cursor-pointer flex items-center"
                      >
                        <Heart size={16} className="mr-2" />
                        <span>Wishlist</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {/* <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex items-center">
                      <Settings size={16} className="mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-gray-700 hover:text-rose-600"
                  >
                    <User size={20} />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/login">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Create Account</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="border-t border-b py-4 bg-white">
          <div className="container mx-auto px-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Search for products..."
                className="pl-10 pr-20"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(
                      `/products?search=${encodeURIComponent(searchQuery.trim())}`
                    );
                    setIsSearchOpen(false);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (searchQuery.trim()) {
                    router.push(
                      `/products?search=${encodeURIComponent(searchQuery.trim())}`
                    );
                    setIsSearchOpen(false);
                  }
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
              >
                <Search size={18} />
              </Button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Popular: Headphones, T-shirts, Sneakers
            </div>
          </div>
        </div>
      )}
    </header>
  );
}