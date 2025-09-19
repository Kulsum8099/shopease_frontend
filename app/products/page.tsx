"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { ChevronDown, ChevronUp, Filter, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PageHeader } from "@/app/components/page-header"
import { ProductCard } from "@/app/components/product-card"
import { useToast } from "@/components/ui/toast"
import { useGet } from "@/hooks/useGet"
import { DualRangeSlider } from "@/components/ui/dualRangeSlider"

interface Category {
  _id: string;
  name: string;
  description: string;
  logo: string;
}

interface ProductApiResponse {
  data: {
    _id?: string;
    id?: string;
    slug: string;
    name: string;
    price: number;
    stock?: number;
    category?: string | {
      _id: string;
      name: string;
    };
    images?: string[];
    rating?: number;
  }[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('search') || searchParams.get('searchTerm')
  const { addToast } = useToast()
  const productsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
  }, [searchParams])

  // Fetch categories separately
  const { data: categoriesData } = useGet<{ data: Category[] }>(
    '/category',
    ['categories']
  );

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: productsPerPage.toString(),
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    });

    if (searchTerm) {
      params.set('searchTerm', searchTerm);
    }

    // Handle both URL params and state
    const categoriesToFilter = selectedCategories.length > 0
      ? selectedCategories
      : searchParams.get('category')
        ? [searchParams.get('category')!]
        : []

    // Fix for multiple category filtering
    if (categoriesToFilter.length > 0) {
      categoriesToFilter.forEach(categoryId => {
        params.append('category', categoryId)
      })
    }

    switch (sortOption) {
      case "price-low-high":
        params.set('sortBy', 'price');
        params.set('sortOrder', 'asc');
        break;
      case "price-high-low":
        params.set('sortBy', 'price');
        params.set('sortOrder', 'desc');
        break;
      case "rating":
        params.set('sortBy', 'rating');
        params.set('sortOrder', 'desc');
        break;
    }

    return params.toString();
  }, [currentPage, priceRange, selectedCategories, sortOption, productsPerPage, searchParams, searchTerm]);
  
  const { data, isLoading, refetch, error } = useGet<ProductApiResponse>(
    `/product/active?${queryParams}`,
    ["products", queryParams]
  );

  // Transform and memoize products data with optimized mapping
  const allProducts = useMemo(() => {
    if (!data?.data) return []
    
    // Create a map for faster category lookup
    const categoryMap = new Map(
      categoriesData?.data?.map(cat => [cat._id, cat.name]) || []
    )
    
    return data.data.map((product) => {
      let categoryName = "Uncategorized";
      let categoryId = "";

      if (typeof product.category === 'object' && product.category !== null) {
        categoryName = product.category.name;
        categoryId = product.category._id;
      } else if (typeof product.category === 'string') {
        categoryName = categoryMap.get(product.category) || "Uncategorized";
        categoryId = product.category;
      }

      return {
        ...product,
        id: product._id || product.id,
        category: categoryName,
        categoryId: categoryId,
        images: product.images || []
      }
    })
  }, [data?.data, categoriesData?.data])

  // Get unique categories from the categories API response with optimized mapping
  const categories = useMemo(() => {
    if (!categoriesData?.data) return []
    
    return categoriesData.data.map(category => ({
      id: category._id,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, "-")
    }))
  }, [categoriesData?.data])

  // Handle add to cart
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

  // Handle add to wishlist
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

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
    setCurrentPage(1); 
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    setCurrentPage(1);
  }

  const clearFilters = () => {
    setPriceRange([0, 200])
    setSelectedCategories([])
    setSortOption("popularity")
    setCurrentPage(1)
  }

  // Calculate total pages from API metadata
  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;
  
  // Lazy loading with intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      // Only auto-increment if user is near the bottom and there are more pages
      if (entries[0].isIntersecting && currentPage < totalPages) {
        // Don't auto-increment - let user manually navigate
        // setCurrentPage(prev => prev + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, currentPage, totalPages]);

  // Filter component for both desktop and mobile
  const FiltersComponent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
        >
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked === true)
                }
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-10">Price Range</h4>
        <DualRangeSlider
          label={(value) => `৳${value}`}
          value={priceRange}
          onValueChange={handlePriceChange}
          min={0}
          max={200}
          step={1}
        />
        {/* <div className="flex items-center justify-between">
          <span className="text-sm">৳{priceRange[0]}</span>
          <span className="text-sm">৳{priceRange[1]}</span>
        </div> */}
      </div>
    </div>
  );

  if (isLoading && !data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader title="All Products" description="Loading products..." />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Skeleton */}
          <div className="hidden lg:block space-y-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                </div>
              ))}
            </div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Products Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader title="All Products" description="Error loading products" />
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Failed to load products</h3>
          <p className="text-gray-500 mb-4">Please try again later.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader 
        title={searchTerm ? `Search Results for "${searchTerm}"` : "All Products"} 
        description={searchTerm ? `Found ${allProducts.length} products matching your search` : "Browse our collection of high-quality products"} 
      />
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          Showing {allProducts.length} of {data?.meta?.total || 0} products
        </div>
                 <div className="flex items-center space-x-2">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Filter size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <FiltersComponent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <FiltersComponent />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between"
            >
              <span className="flex items-center">
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
              </span>
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>

            {showFilters && (
              <div className="mt-4 p-4 border rounded-lg">
                <FiltersComponent />
              </div>
            )}
          </div>

          {/* Products */}
          {allProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to find what you're looking for.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {allProducts.map((product, index) => {
                   const isLastProduct = index === allProducts.length - 1;
                   
                   return (
                     <div
                       key={product._id || product.id}
                       ref={isLastProduct ? lastProductRef : undefined}
                     >
                       <ProductCard
                         slug={product.slug}
                         id={product._id || product.id || ""}
                         name={product.name}
                         price={product.price}
                         category={product.category}
                         stock={product.stock}
                         image={product.images?.[0] || ""}
                         rating={product.rating || 4}
                         onAddToCart={handleAddToCart}
                         onAddToWishlist={handleAddToWishlist}
                       />
                     </div>
                   );
                 })}
               </div>

                             {/* Pagination */}
               {totalPages > 1 && (
                 <>
                   {isLoading && (
                     <div className="flex justify-center mt-4">
                       <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-rose-600"></div>
                     </div>
                   )}
                   <div className="flex justify-center mt-8">
                     <div className="flex items-center space-x-2">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                         disabled={currentPage === 1}
                       >
                         Previous
                       </Button>

                       {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                         let pageNum;
                         if (totalPages <= 5) {
                           pageNum = i + 1;
                         } else if (currentPage <= 3) {
                           pageNum = i + 1;
                         } else if (currentPage >= totalPages - 2) {
                           pageNum = totalPages - 4 + i;
                         } else {
                           pageNum = currentPage - 2 + i;
                         }

                         return (
                           <Button
                             key={pageNum}
                             variant={currentPage === pageNum ? "default" : "outline"}
                             size="sm"
                             onClick={() => setCurrentPage(pageNum)}
                             className={currentPage === pageNum ? "bg-rose-600 hover:bg-rose-700" : ""}
                           >
                             {pageNum}
                           </Button>
                         );
                       })}

                       {totalPages > 5 && currentPage < totalPages - 2 && (
                         <span className="px-2">...</span>
                       )}

                       {totalPages > 5 && currentPage < totalPages - 2 && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setCurrentPage(totalPages)}
                         >
                           {totalPages}
                         </Button>
                       )}

                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                         disabled={currentPage === totalPages}
                       >
                         Next
                       </Button>
                     </div>
                   </div>
                 </>
               )}
             </>
           )}
         </div>
       </div>
     </div>
   )
 }