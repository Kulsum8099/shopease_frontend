"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useGet } from "@/hooks/useGet"
import { Product } from "@/components/products/list"
import { usePathname } from "next/navigation";



export default function ProductDetailPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const slug = pathSegments[pathSegments.length - 1];
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)


  const { data, isLoading, refetch, error } = useGet<{ data: Product }>(
    `/product/slug/${slug}`,
    ["product"]
  );

  console.log("data", data);


  const productData: Product | undefined = data?.data;
  console.log("object", productData)

  const incrementQuantity = () => {
    if (quantity < (productData?.stock ?? 0)) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-rose-600">
          Home
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href="/products" className="hover:text-rose-600">
          Products
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-900">{productData?.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={productData?.images?.[selectedImage] ?? ""}
              // src={productData?.images?.[0]??""}
              alt={productData?.name ?? ""}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {productData?.images?.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square overflow-hidden rounded-md border ${
                  selectedImage === index
                    ? "border-rose-600"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={productData?.images?.[index] ?? ""}
                  alt={productData?.name ?? ""}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {productData?.name}
            </h1>
            <p className="text-lg text-gray-500">
              {productData?.category?.name}
            </p>
          </div>

          {/* Price */}
          <div className="text-3xl font-extrabold text-rose-600">
            ৳{productData?.price}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-l-md rounded-r-none"
                >
                  <Minus size={16} />
                </Button>
                <div className="h-10 w-12 flex items-center justify-center border-y">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={
                    quantity >= (productData?.stock ?? 0) || quantity > 9
                  }
                  className="h-10 w-10 rounded-r-md rounded-l-none"
                >
                  <Plus size={16} />
                </Button>
                <span className="ml-4 text-sm text-gray-500">
                  {productData?.stock && productData?.stock > 0
                    ? `${productData?.stock} items available`
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 flex-1"
              onClick={() => {
                // Add to localStorage
                const cartItems = JSON.parse(
                  localStorage.getItem("cartItems") || "[]"
                );
                const existingItem = cartItems.find(
                  (item: any) => item.id === productData?._id
                );

                if (existingItem) {
                  existingItem.quantity += quantity;
                } else {
                  cartItems.push({
                    id: productData?._id,
                    name: productData?.name,
                    price: productData?.price,
                    image: productData?.images?.[0],
                    quantity: quantity,
                  });
                }

                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                window.dispatchEvent(new CustomEvent("cartUpdated"));

                // Show success message or toast
                console.log("Added to cart:", productData?.name);
              }}
              disabled={productData?.stock === 0}
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center text-sm">
              <Truck size={18} className="mr-2 text-gray-600" />
              <span>Free shipping on orders over ৳50</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>In stock, ready to ship</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-rose-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-rose-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
          >
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-4">
          <div
            className="text-gray-700 leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: productData?.description || "" }}
          />
        </TabsContent>

        <TabsContent value="features" className="pt-4">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: productData?.features || "" }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}