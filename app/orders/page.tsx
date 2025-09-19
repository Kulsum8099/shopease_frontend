"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Package, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/app/components/page-header"
import { toast } from "react-toastify"
import { useCookies } from "next-client-cookies"
import { useAuthGet } from "@/hooks/useAuthGet"

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)


  const cookies = useCookies();
  const id = cookies.get("id");

  // const { data: orders, isLoading, error } = useOrders()

  const { data, isLoading, error, refetch } = useAuthGet<{ data?: any }>(
    `/orders`,
    ["orderInfo",], true
  );


  const orderInfo = data?.data;

  console.log("userInfo", orderInfo);


  // Show error toast if fetching fails
  if (error) {
    toast.error(error.message)
  }

  // Filter orders based on active tab and search query
  const filteredOrders = orderInfo?.filter((order) => {
    const matchesTab = activeTab === "all" || order.status.toLowerCase() === activeTab.toLowerCase()
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  }) || []

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader title="Order History" description="Loading your orders..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader title="Order History" description="Track and manage your orders" />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search orders by ID or product name"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4 mx-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="m-0">
                <CardContent className="p-0">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
                      </p>
                      <div className="mt-6">
                        <Link href="/products">
                          <Button className="bg-rose-600 hover:bg-rose-700">Browse Products</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredOrders.map((order) => (
                        <div
                          key={order._id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedOrder === order._id ? "bg-gray-50" : ""
                            }`}
                          onClick={() => setSelectedOrder(order._id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">ORD-{order._id.slice(-6).toUpperCase()}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                            <Link href={`/orders/${order._id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-0"
                              >
                                <ChevronRight size={18} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Order Details Preview */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Order Preview</CardTitle>
                  <Link href={`/orders/${selectedOrder}`}>
                    <Button variant="outline" size="sm">
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Select an order to view details or click "View Full Details" to see complete information.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an order to view details</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Click on an order from the list to view detailed information including items, shipping details, and
                  tracking information.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { ChevronRight, ExternalLink, Package, Search, Truck } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { PageHeader } from "@/app/components/page-header"

// // Sample order data
// const orders = [
//   {
//     id: "ORD-1001",
//     date: "May 15, 2023",
//     total: 249.97,
//     status: "Delivered",
//     items: [
//       {
//         id: 1,
//         name: "Wireless Headphones",
//         price: 99.99,
//         quantity: 1,
//         image: "headphones",
//       },
//       {
//         id: 3,
//         name: "Smart Watch",
//         price: 149.98,
//         quantity: 1,
//         image: "watch",
//       },
//     ],
//     paymentStatus: "Paid",
//     paymentMethod: "Credit Card",
//     trackingNumber: "TRK123456789",
//     deliveryDate: "May 20, 2023",
//     shippingAddress: "123 Main St, Anytown, USA",
//   },
//   {
//     id: "ORD-1002",
//     date: "June 2, 2023",
//     total: 89.99,
//     status: "Shipped",
//     items: [
//       {
//         id: 6,
//         name: "Denim Jacket",
//         price: 89.99,
//         quantity: 1,
//         image: "jacket",
//       },
//     ],
//     paymentStatus: "Paid",
//     paymentMethod: "PayPal",
//     trackingNumber: "TRK987654321",
//     deliveryDate: "June 7, 2023 (Expected)",
//     shippingAddress: "456 Oak Ave, Somewhere, USA",
//   },
//   {
//     id: "ORD-1003",
//     date: "June 10, 2023",
//     total: 169.98,
//     status: "Processing",
//     items: [
//       {
//         id: 7,
//         name: "Coffee Maker",
//         price: 129.99,
//         quantity: 1,
//         image: "coffee",
//       },
//       {
//         id: 12,
//         name: "Water Bottle",
//         price: 19.99,
//         quantity: 2,
//         image: "bottle",
//       },
//     ],
//     paymentStatus: "Paid",
//     paymentMethod: "Credit Card",
//     trackingNumber: null,
//     deliveryDate: "June 15, 2023 (Expected)",
//     shippingAddress: "789 Pine St, Elsewhere, USA",
//   },
//   {
//     id: "ORD-1004",
//     date: "June 15, 2023",
//     total: 59.99,
//     status: "Canceled",
//     items: [
//       {
//         id: 5,
//         name: "Bluetooth Speaker",
//         price: 59.99,
//         quantity: 1,
//         image: "speaker",
//       },
//     ],
//     paymentStatus: "Refunded",
//     paymentMethod: "Credit Card",
//     trackingNumber: null,
//     deliveryDate: null,
//     shippingAddress: "123 Main St, Anytown, USA",
//     cancellationReason: "Item out of stock",
//   },
// ]

// export default function OrderHistoryPage() {
//   const [activeTab, setActiveTab] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

//   // Filter orders based on active tab and search query
//   const filteredOrders = orders.filter((order) => {
//     const matchesTab = activeTab === "all" || order.status.toLowerCase() === activeTab.toLowerCase()
//     const matchesSearch =
//       order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     return matchesTab && matchesSearch
//   })

//   // Get the selected order details
//   const orderDetails = selectedOrder ? orders.find((order) => order.id === selectedOrder) : null

//   // Get status badge color
//   const getStatusBadgeColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "delivered":
//         return "bg-green-100 text-green-800 hover:bg-green-100"
//       case "shipped":
//         return "bg-blue-100 text-blue-800 hover:bg-blue-100"
//       case "processing":
//         return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
//       case "canceled":
//         return "bg-red-100 text-red-800 hover:bg-red-100"
//       default:
//         return "bg-gray-100 text-gray-800 hover:bg-gray-100"
//     }
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <PageHeader title="Order History" description="Track and manage your orders" />

//       <div className="mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <Input
//             placeholder="Search orders by ID or product name"
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Order List */}
//         <div className="lg:col-span-1">
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Your Orders</CardTitle>
//             </CardHeader>
//             <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid grid-cols-4 mb-4 mx-4">
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="processing">Processing</TabsTrigger>
//                 <TabsTrigger value="shipped">Shipped</TabsTrigger>
//                 <TabsTrigger value="delivered">Delivered</TabsTrigger>
//               </TabsList>

//               <TabsContent value={activeTab} className="m-0">
//                 <CardContent className="p-0">
//                   {filteredOrders.length === 0 ? (
//                     <div className="text-center py-8 px-4">
//                       <Package className="mx-auto h-12 w-12 text-gray-400" />
//                       <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
//                       <p className="mt-1 text-sm text-gray-500">
//                         {searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
//                       </p>
//                       <div className="mt-6">
//                         <Link href="/products">
//                           <Button className="bg-rose-600 hover:bg-rose-700">Browse Products</Button>
//                         </Link>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="divide-y">
//                       {filteredOrders.map((order) => (
//                         <div
//                           key={order.id}
//                           className={`p-4 cursor-pointer hover:bg-gray-50 ${
//                             selectedOrder === order.id ? "bg-gray-50" : ""
//                           }`}
//                           onClick={() => setSelectedOrder(order.id)}
//                         >
//                           <div className="flex justify-between items-start mb-2">
//                             <div>
//                               <h3 className="font-medium">{order.id}</h3>
//                               <p className="text-sm text-gray-500">{order.date}</p>
//                             </div>
//                             <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <p className="font-medium">${order.total.toFixed(2)}</p>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-0"
//                             >
//                               <ChevronRight size={18} />
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </TabsContent>
//             </Tabs>
//           </Card>
//         </div>

//         {/* Order Details */}
//         <div className="lg:col-span-2">
//           {selectedOrder ? (
//             <Card>
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle>Order Details</CardTitle>
//                   <Badge className={getStatusBadgeColor(orderDetails?.status || "")}>{orderDetails?.status}</Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Order Summary */}
//                 <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Order ID</p>
//                     <p className="font-medium">{orderDetails?.id}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Date Placed</p>
//                     <p className="font-medium">{orderDetails?.date}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Total</p>
//                     <p className="font-medium">${orderDetails?.total.toFixed(2)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Payment</p>
//                     <p className="font-medium">{orderDetails?.paymentStatus}</p>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Order Items */}
//                 <div>
//                   <h3 className="font-medium mb-3">Items</h3>
//                   <div className="space-y-4">
//                     {orderDetails?.items.map((item) => (
//                       <div key={item.id} className="flex items-start space-x-4">
//                         <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
//                           <Image
//                             src={`/abstract-geometric-shapes.png?height=64&width=64&query=${item.image} product`}
//                             alt={item.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="text-sm font-medium">{item.name}</h4>
//                           <p className="text-sm text-gray-500">
//                             Qty: {item.quantity} × ${item.price.toFixed(2)}
//                           </p>
//                         </div>
//                         <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Shipping Information */}
//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                   <div>
//                     <h3 className="font-medium mb-3">Shipping Address</h3>
//                     <p className="text-sm text-gray-700">{orderDetails?.shippingAddress}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-medium mb-3">Payment Method</h3>
//                     <p className="text-sm text-gray-700">{orderDetails?.paymentMethod}</p>
//                   </div>
//                 </div>

//                 {/* Tracking Information */}
//                 {orderDetails?.status !== "Canceled" && (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-medium mb-3">Delivery Information</h3>
//                     {orderDetails?.trackingNumber ? (
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center text-sm">
//                             <Truck size={18} className="mr-2 text-gray-600" />
//                             <span>
//                               {orderDetails.status === "Delivered"
//                                 ? `Delivered on ${orderDetails.deliveryDate}`
//                                 : `Expected delivery by ${orderDetails.deliveryDate}`}
//                             </span>
//                           </div>
//                           <Button variant="outline" size="sm" className="text-sm">
//                             <ExternalLink size={14} className="mr-1" />
//                             Track Package
//                           </Button>
//                         </div>
//                         <p className="text-sm text-gray-500">
//                           Tracking Number: <span className="font-medium">{orderDetails.trackingNumber}</span>
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-700">
//                         {orderDetails?.status === "Processing"
//                           ? "Your order is being processed. Tracking information will be available once shipped."
//                           : "Tracking information not available."}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Cancellation Information */}
//                 {orderDetails?.status === "Canceled" && (
//                   <div className="bg-red-50 p-4 rounded-lg">
//                     <h3 className="font-medium mb-2 text-red-800">Order Canceled</h3>
//                     <p className="text-sm text-red-700">Reason: {orderDetails.cancellationReason || "Not specified"}</p>
//                   </div>
//                 )}

//                 {/* Need Help Section */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium mb-2">Need Help?</h3>
//                   <p className="text-sm text-gray-700 mb-3">
//                     If you need to make changes to your order or have any questions, please contact our customer service
//                     team.
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     <Button variant="outline" size="sm">
//                       Contact Support
//                     </Button>
//                     <Button variant="outline" size="sm">
//                       Return Items
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardContent className="flex flex-col items-center justify-center py-12">
//                 <Package className="h-16 w-16 text-gray-400 mb-4" />
//                 <h3 className="text-lg font-medium mb-2">Select an order to view details</h3>
//                 <p className="text-gray-500 text-center max-w-md">
//                   Click on an order from the list to view detailed information including items, shipping details, and
//                   tracking information.
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
