"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/order";
import { Eye, Truck, XCircle } from "lucide-react";
import { useState } from "react";
import { formatDate, UpdateOrderStatusDialog } from "./update-status";

interface OrderListProps {
  refetch: any;
  updateOrder: any;
  setUpdateOrder: any;
  orders: Order[];
  pageNumber: number;
  setPageNumber: any;
  loading: boolean;
  totalPages: number;
  handleStatusUpdate: any;
}

export function OrderList({
  refetch,
  updateOrder,
  setUpdateOrder,
  pageNumber,
  setPageNumber,
  totalPages,
  orders,
  handleStatusUpdate,
  loading,
}: OrderListProps) {
  const [currentStatus, setCurrentStatus] = useState<any>("pending");
  const [open, setOpen] = useState(false);
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "info";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Loading orders...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No orders found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  ORD-{order._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>{order.shippingAddress.fullName}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </TableCell>
                <TableCell>৳{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500 font-medium bg-rose-50 hover:text-white hover:bg-rose-500 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 rounded-md shadow-sm"
                      >
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          (window.location.href = `/admin/orders/${order._id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      {order.status !== "cancelled" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setOpen(true);
                              setUpdateOrder(order._id);
                              setCurrentStatus(order?.status);
                            }}
                          >
                            <Truck className="mr-2 h-4 w-4" /> Update Status
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              handleStatusUpdate("cancelled");
                              setUpdateOrder(order._id);
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex gap-3 justify-end items-center mt-4">
          <Button
            variant="outline"
            onClick={() =>
              setPageNumber((prev: number) => Math.max(1, prev - 1))
            }
            disabled={pageNumber === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPageNumber((prev: number) => prev + 1)}
            disabled={pageNumber >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
      {open && (
        <UpdateOrderStatusDialog
          orderId={updateOrder}
          open={open}
          onOpenChange={(isOpen) => setOpen(isOpen)}
          refetch={refetch}
          currentStatus={currentStatus}
        />
      )}
    </>
  );
}
``;
