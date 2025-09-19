"use client";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderList } from "@/components/orders/list";
import { useEffect, useMemo, useState } from "react";
import { useUpdate } from "@/hooks/useUpdate";
import { useAuthGet } from "@/hooks/useAuthGet";

const ORDER_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [updateOrder, setUpdateOrder] = useState<string | null>(null);
  // Build query parameters for API call
  const queryParams = new URLSearchParams();
  if (searchTerm.trim()) queryParams.append('searchTerm', searchTerm.trim());
  if (statusFilter !== 'all') queryParams.append('status', statusFilter);
  queryParams.append('sortBy', sortField);
  queryParams.append('sortOrder', sortOrder);

  // Fetch orders data with filters
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useAuthGet<any>(
    `/orders?${queryParams.toString()}&page=${pageNumber}`,
    ["orders", searchTerm, statusFilter, sortField, sortOrder, `${pageNumber}`],
    true
  );

  const totalPages = ordersData?.meta
    ? Math.ceil(ordersData?.meta.total / ordersData?.meta.limit)
    : 1;
  // Mutation for updating order status
  const { mutate: updateOrderStatus} = useUpdate(
    `/orders/${updateOrder}/status`,
    () => {
      toast({
        title: "Status updated",
        description: `Order #${updateOrder
          ?.slice(-6)
          .toUpperCase()} is now ${status}`,
      });
      refetch?.();
    }
  );

  const handleStatusUpdate = (newStatus: string) => {
    updateOrderStatus({
      status: newStatus,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Use orders directly from API since filtering is now done on backend
  const filteredOrders = ordersData?.data || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm items-center space-x-2"
        >
          <Input
            placeholder="Search by order #, customer name, phone, or product..."
            className="w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("createdAt")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortField === "createdAt"
              ? sortOrder === "asc"
                ? "Oldest"
                : "Newest"
              : "Sort"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      ) : (
        <OrderList
          refetch={refetch}
          updateOrder={updateOrder}
          setUpdateOrder={setUpdateOrder}
          orders={filteredOrders}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalPages={totalPages}
          loading={isLoading}
          handleStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
