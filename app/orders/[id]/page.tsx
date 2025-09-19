"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Package,
  Printer,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthGet } from "@/hooks/useAuthGet";
import { toast } from "react-toastify";
import { formatDate } from "@/components/orders/update-status";
import { useUpdate } from "@/hooks/useUpdate";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] =
    useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
    display: none;
  @media print {
    display: block;
  }
  `,
  });

  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useAuthGet<any>(`/orders/${id}`, ["order", id], true);

  console.log("Order Data:", orderData);

  const { mutate: markAsDelivered, isPending } = useUpdate(
    `/orders/${id}/status`,
    () => {
      toast.success("Order marked as delivered successfully");
      refetch();
      setShowDeliveryConfirmation(false);
    }
  );

  const order = orderData?.data;

  // Show error toast if fetching fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load order details");
      router.push("/orders");
    }
  }, [error, router]);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">
            We couldn't find this order
          </h3>
          <p className="mt-2 text-gray-500">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/orders">
            <Button className="mt-6 bg-rose-600 hover:bg-rose-700">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format shipping address
  const formatAddress = (address: any) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  };

  const handleDeliveryConfirmation = () => {
    markAsDelivered({ status: "delivered" });
  };

  const handlePrintInvoice = () => {
    if (contentRef.current) {
      reactToPrintFn();
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    
    try {
      // Create a simple HTML invoice for download
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - Order #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .order-info { margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .total { text-align: right; font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ShopEase</h1>
            <h2>Invoice</h2>
          </div>
          <div class="order-info">
            <p><strong>Order ID:</strong> ${order._id.slice(-6).toUpperCase()}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item: any) => `
                <tr>
                  <td>${item.product?.name || 'Unknown Product'}</td>
                  <td>${item.quantity}</td>
                  <td>৳${item.price?.toFixed(2)}</td>
                  <td>৳${(item.quantity * item.price)?.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p><strong>Total:</strong> ৳${order.total?.toFixed(2)}</p>
          </div>
        </body>
        </html>
      `;
      
      // Create blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order._id.slice(-6).toUpperCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download invoice');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center text-rose-600 hover:text-rose-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => window.print()}
          >
            <Printer size={16} className="mr-2" />
            Print Receipt
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={handlePrintInvoice}
          >
            <Download size={16} className="mr-2" />
            Download Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 " ref={contentRef}>
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Order Summary</CardTitle>
                <Badge className={getStatusBadgeColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Items</h3>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item._id} className="flex items-start space-x-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
                        <Image
                          src={
                            item.product?.images[0]
                              ? `http://localhost:4000/${item.product.images[0]}`
                              : "/placeholder-product.jpg"
                          }
                          alt={item.product?.name || "Product"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product?._id}`}
                          className="hover:text-rose-600 font-medium"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        {item.color && (
                          <p className="text-sm text-gray-500">
                            Color: {item.color}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ৳{item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Totals */}
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>৳{order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>৳{order.shippingFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span>৳{order.tax?.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>৳{order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              {/* {order.status !== "cancelled" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Delivery Information</h3>
                  {order.trackingNumber ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Truck size={18} className="mr-2 text-gray-600" />
                          <span>
                            {order.status === "delivered"
                              ? `Delivered on ${formatDate(order.updatedAt)}`
                              : `Shipped on ${formatDate(order.shippedAt || order.updatedAt)}`}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-sm"
                          onClick={() => window.open(`https://tracking.example.com/?tracking=${order.trackingNumber}`, '_blank')}
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Track Package
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">
                      {order.status === "processing"
                        ? "Your order is being prepared for shipment. Tracking information will be available soon."
                        : "Tracking information not yet available."}
                    </p>
                  )}
                </div>
              )} */}

              {order.status !== "cancelled" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Delivery Information</h3>
                  {order.trackingNumber ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Truck size={18} className="mr-2 text-gray-600" />
                          <span>
                            {order.status === "delivered"
                              ? `Delivered on ${formatDate(order.updatedAt)}`
                              : order.status === "shipped"
                              ? `Shipped on ${formatDate(
                                  order.shippedAt || order.updatedAt
                                )}`
                              : "Your order is on the way"}
                          </span>
                        </div>
                        {order.status === "shipped" && (
                          <Button
                            variant="default"
                            size="sm"
                            className="text-sm"
                            onClick={() => setShowDeliveryConfirmation(true)}
                          >
                            Confirm Delivery
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-sm"
                          onClick={() =>
                            window.open(
                              `https://tracking.example.com/?tracking=${order.trackingNumber}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Track Package
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Tracking Number:{" "}
                        <span className="font-medium">
                          {order.trackingNumber}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">
                      {order.status === "processing"
                        ? "Your order is being prepared for shipment. Tracking information will be available soon."
                        : "Tracking information not yet available."}
                    </p>
                  )}
                </div>
              )}

              {showDeliveryConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-medium mb-4">
                      Confirm Delivery
                    </h3>
                    <p className="mb-6">
                      Have you received your order? Please confirm delivery.
                    </p>
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeliveryConfirmation(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeliveryConfirmation}
                        disabled={isPending}
                      >
                        {isPending ? "Confirming..." : "Yes, I Received It"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation Information */}
              {order.status === "cancelled" && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-red-800">
                    Order Canceled
                  </h3>
                  <p className="text-sm text-red-700">
                    {order.cancellationReason
                      ? `Reason: ${order.cancellationReason}`
                      : "This order has been canceled."}
                  </p>
                  {order.refundStatus && (
                    <p className="text-sm text-red-700 mt-2">
                      Refund Status:{" "}
                      <span className="font-medium">{order.refundStatus}</span>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{formatAddress(order.shippingAddress)}</p>
              <p className="text-sm mt-2">
                <span className="font-medium">Contact:</span>{" "}
                {order.shippingAddress.phone}
              </p>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Method</span>
                <span className="text-sm capitalize">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm capitalize">
                  {order.paymentStatus}
                </span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Transaction ID</span>
                  <span className="text-sm font-mono">
                    {order.transactionId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Support */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">
                For questions about your order, returns, or exchanges, please
                contact our customer support team.
              </p>
              <div className="space-y-2">
                <Button
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  onClick={() => router.push("/contact")}
                >
                  Contact Support
                </Button>
                {order.status !== "cancelled" &&
                  order.status !== "delivered" && (
                    <p className="text-xs text-gray-500 text-center">
                      To request order changes, please contact us within 24
                      hours of purchase.
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
// "use client"

// import { useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import Link from "next/link"
// import Image from "next/image"
// import { ArrowLeft, Download, ExternalLink, Package, Printer, Truck } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { useAuthGet } from "@/hooks/useAuthGet"
// import { toast } from "react-toastify"
// import { formatDate } from "@/components/orders/update-status"

// export default function OrderDetailsPage() {
//   const router = useRouter()
//   const { id } = useParams()

//   const { data: orderData, isLoading, error } = useAuthGet<any>(
//     `/orders/${id}`,
//     ["order", id],
//     true
//   )

//   const order = orderData?.data

//   // Show error toast if fetching fails
//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || "Failed to load order details")
//       router.push("/orders")
//     }
//   }, [error, router])

//   // Get status badge color
//   const getStatusBadgeColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "delivered": return "bg-green-100 text-green-800 hover:bg-green-100"
//       case "shipped": return "bg-blue-100 text-blue-800 hover:bg-blue-100"
//       case "processing": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
//       case "cancelled": return "bg-red-100 text-red-800 hover:bg-red-100"
//       default: return "bg-gray-100 text-gray-800 hover:bg-gray-100"
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
//         </div>
//       </div>
//     )
//   }

//   if (!order) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="text-center py-12">
//           <Package className="mx-auto h-16 w-16 text-gray-400" />
//           <h3 className="mt-4 text-lg font-medium">We couldn't find this order</h3>
//           <p className="mt-2 text-gray-500">The order you're looking for doesn't exist or has been removed.</p>
//           <Link href="/orders">
//             <Button className="mt-6 bg-rose-600 hover:bg-rose-700">Back to Orders</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   // Format shipping address
//   const formatAddress = (address: any) => {
//     return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="mb-6">
//         <Link href="/orders" className="inline-flex items-center text-rose-600 hover:text-rose-700">
//           <ArrowLeft size={16} className="mr-2" />
//           Back to Orders
//         </Link>
//       </div>

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
//           <p className="text-gray-500">
//             Placed on {formatDate(order.createdAt)}
//           </p>
//         </div>
//         <div className="flex items-center space-x-2 mt-4 md:mt-0">
//           <Button variant="outline" size="sm" className="flex items-center">
//             <Printer size={16} className="mr-2" />
//             Print Receipt
//           </Button>
//           <Button variant="outline" size="sm" className="flex items-center">
//             <Download size={16} className="mr-2" />
//             Download Invoice
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Order Summary */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader className="pb-3">
//               <div className="flex justify-between items-center">
//                 <CardTitle>Order Summary</CardTitle>
//                 <Badge className={getStatusBadgeColor(order.status)}>
//                   {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Order Items */}
//               <div>
//                 <h3 className="font-medium mb-3">Items</h3>
//                 <div className="space-y-4">
//                   {order.items.map((item: any) => (
//                     <div key={item._id} className="flex items-start space-x-4">
//                       <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
//                         <Image
//                           src={item.product?.image || "/placeholder-product.jpg"}
//                           alt={item.product?.name || "Product"}
//                           fill
//                           className="object-cover"
//                           sizes="80px"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <Link
//                           href={`/products/${item.product?._id}`}
//                           className="hover:text-rose-600 font-medium"
//                         >
//                           {item.product?.name}
//                         </Link>
//                         <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                         {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
//                         <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <Separator />

//               {/* Order Totals */}
//               <div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Subtotal</span>
//                     <span>${order.subtotal?.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Shipping</span>
//                     <span>${order.shippingFee?.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Tax</span>
//                     <span>${order.tax?.toFixed(2)}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between font-medium">
//                     <span>Total</span>
//                     <span>${order.total?.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Information */}
//               {order.status !== "cancelled" && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium mb-3">Delivery Information</h3>
//                   {order.trackingNumber ? (
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center text-sm">
//                           <Truck size={18} className="mr-2 text-gray-600" />
//                           <span>
//                             {order.status === "delivered"
//                               ? `Delivered on ${formatDate(order.updatedAt)}`
//                               : `Shipped on ${formatDate(order.shippedAt || order.updatedAt)}`}
//                           </span>
//                         </div>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="text-sm"
//                           onClick={() => window.open(`https://tracking.example.com/?tracking=${order.trackingNumber}`, '_blank')}
//                         >
//                           <ExternalLink size={14} className="mr-1" />
//                           Track Package
//                         </Button>
//                       </div>
//                       <p className="text-sm text-gray-500">
//                         Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
//                       </p>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-700">
//                       {order.status === "processing"
//                         ? "Your order is being prepared for shipment. Tracking information will be available soon."
//                         : "Tracking information not yet available."}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Cancellation Information */}
//               {order.status === "cancelled" && (
//                 <div className="bg-red-50 p-4 rounded-lg">
//                   <h3 className="font-medium mb-2 text-red-800">Order Canceled</h3>
//                   <p className="text-sm text-red-700">
//                     {order.cancellationReason
//                       ? `Reason: ${order.cancellationReason}`
//                       : "This order has been canceled."}
//                   </p>
//                   {order.refundStatus && (
//                     <p className="text-sm text-red-700 mt-2">
//                       Refund Status: <span className="font-medium">{order.refundStatus}</span>
//                     </p>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Order Information */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* Shipping Information */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Shipping Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm">{formatAddress(order.shippingAddress)}</p>
//               <p className="text-sm mt-2">
//                 <span className="font-medium">Contact:</span> {order.shippingAddress.phone}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Payment Information */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Payment Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-500">Method</span>
//                 <span className="text-sm capitalize">{order.paymentMethod}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-gray-500">Status</span>
//                 <span className="text-sm capitalize">{order.paymentStatus}</span>
//               </div>
//               {order.transactionId && (
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Transaction ID</span>
//                   <span className="text-sm font-mono">{order.transactionId}</span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Customer Support */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Need Help?</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p className="text-sm text-gray-700">
//                 For questions about your order, returns, or exchanges, please contact our customer support team.
//               </p>
//               <div className="space-y-2">
//                 <Button
//                   className="w-full bg-rose-600 hover:bg-rose-700"
//                   onClick={() => router.push("/contact")}
//                 >
//                   Contact Support
//                 </Button>
//                 {order.status !== "cancelled" && order.status !== "delivered" && (
//                   <p className="text-xs text-gray-500 text-center">
//                     To request order changes, please contact us within 24 hours of purchase.
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
