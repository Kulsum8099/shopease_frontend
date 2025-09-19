"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductList } from "@/components/products/list"
import { AddProductDialog } from "@/components/products/add"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGet } from "@/hooks/useGet"
import { CategoryApiResponse } from "@/components/categories/list"

export default function AdminProductsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const { data, isLoading, error } = useGet<CategoryApiResponse>(
    `/category`,
    ["categories"]
  );

  const categories = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((category) => ({
      ...category,
      id: category._id || category.id,
    }));
  }, [data]);

  const handleSearch = () => {
    // Trigger refetch in ProductList through the changed props
  }

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search products..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            disabled={isLoading || !!error}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={
                isLoading ? "Loading..." :
                  error ? "Error loading" :
                    "Filter by category"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSort}
            disabled={isLoading}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      <ProductList
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        sortField={sortField}
        sortOrder={sortOrder}
      />
      <AddProductDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
