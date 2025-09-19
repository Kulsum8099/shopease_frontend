"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, ExternalLink, Package, Printer, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-toastify"
import { formatDate, UpdateOrderStatusDialog } from "@/components/orders/update-status"
import { useAuthGet } from "@/hooks/useAuthGet"

interface OrderDetailsViewProps {
    orderId: string
}

export function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
    const [showStatusDialog, setShowStatusDialog] = useState(false)

    const { data: orderData, isLoading } = useAuthGet<any>(
        `/orders/${orderId}`,
        ["orderSingel", orderId],
        true
    )

    const order = orderData?.data

    if (isLoading) return <LoadingState />
    if (!order) return <NotFoundState />

    return (
      <>
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-rose-600 hover:text-rose-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Orders
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Order #{orderId.slice(-6).toUpperCase()}
            </h1>
            <p className="text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusDialog(true)}
            >
              <Truck size={16} className="mr-2" />
              Update Status
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            {/* <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Invoice
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderSummary order={order} />
          <OrderInfoSection
            order={order}
            setShowStatusDialog={setShowStatusDialog}
          />
        </div>

        <UpdateOrderStatusDialog
          orderId={order._id}
          currentStatus={order.status}
          open={showStatusDialog}
          onOpenChange={setShowStatusDialog}
        />
      </>
    );
}

// Sub-components
function LoadingState() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
    )
}

function NotFoundState() {
    return (
        <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Order not found</h3>
            <Link href="/admin/orders">
                <Button className="mt-6 bg-rose-600 hover:bg-rose-700">Back to Orders</Button>
            </Link>
        </div>
    )
}

function OrderSummary({ order }: { order: any }) {
    return (
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Order Summary</CardTitle>
              <Badge variant={getStatusBadgeVariant(order.status)}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Items</h3>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item._id} className="flex items-start space-x-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0">
                      <Image
                        src={item.product?.image || "/placeholder-product.jpg"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{item.product?.name}</h4>
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

            {order.status === "cancelled" ? (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-red-800">
                  Order Canceled
                </h3>
                <p className="text-sm text-red-700">
                  Reason: {order.cancellationReason || "Not specified"}
                </p>
              </div>
            ) : (
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
                            : `Expected delivery soon`}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="text-sm">
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
                      ? "Order is being processed. Tracking will be available once shipped."
                      : "Tracking information not available."}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
}

function OrderInfoSection({ order, setShowStatusDialog }: { order: any, setShowStatusDialog: (value: boolean) => void }) {
    return (
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                    </p>
                    <p className="text-sm mt-2">
                        <span className="font-medium">Contact:</span> {order.shippingAddress?.phone}
                    </p>
                    <p className="text-sm mt-2">
                        <span className="font-medium">Customer:</span> {order.user?.name || "Unknown"}
                    </p>
                    <p className="text-sm mt-2">
                        <span className="font-medium">Email:</span> {order.user?.email || "Unknown"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Method</span>
                        <span className="text-sm capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="text-sm capitalize">{order.paymentStatus}</span>
                    </div>
                    {order.transactionId && (
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Transaction ID</span>
                            <span className="text-sm">{order.transactionId}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowStatusDialog(true)}
                        >
                            Update Order Status
                        </Button>
                        {order.status !== "cancelled" && (
                            <Button
                                variant="outline"
                                className="w-full text-destructive hover:text-destructive"
                                onClick={() => confirm("Are you sure you want to cancel this order?")}
                            >
                                Cancel Order
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function getStatusBadgeVariant(status: string) {
    switch (status?.toLowerCase()) {
        case "delivered": return "default"
        case "shipped": return "secondary"
        case "processing": return "info"
        case "pending": return "warning"
        case "cancelled": return "destructive"
        default: return "outline"
    }
}