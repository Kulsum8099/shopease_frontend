"use client"
import { useState, useEffect } from "react"
import { Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserList } from "@/components/users/list"
import { useGet } from "@/hooks/useGet"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [pageNumber, setPageNumber] = useState<number>(1);
  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  // Build query parameters
  const queryParams = new URLSearchParams()
  if (debouncedSearchTerm) queryParams.append('searchTerm', debouncedSearchTerm)
  if (roleFilter !== 'all') queryParams.append('role', roleFilter)
  queryParams.append('sortBy', sortField)
  queryParams.append('sortOrder', sortOrder)

  const { data, isLoading, refetch } = useGet<any>(
    `/auth/users?${queryParams.toString()}&page=${pageNumber}`,
    ["users", debouncedSearchTerm, roleFilter, sortField, sortOrder]
  );

      const totalPages = data?.meta
        ? Math.ceil(data?.meta.total / data?.meta.limit)
        : 1;
  const handleSearch = () => {
    setPageNumber(1); // Reset to first page when searching
    refetch();
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageNumber(1); // Reset to first page when search term changes
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
      setSortOrder(newOrder)
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
    refetch()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search by name, email or phone..."
            className="w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value)
              setPageNumber(1)
              refetch()
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={`${sortField}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortField(field)
              setSortOrder(order as "asc" | "desc")
              setPageNumber(1)
              refetch()
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest first</SelectItem>
              <SelectItem value="createdAt-asc">Oldest first</SelectItem>
              <SelectItem value="fullName-asc">Name (A-Z)</SelectItem>
              <SelectItem value="fullName-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <UserList
        users={data?.data || []}
        loading={isLoading}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        totalPages={totalPages}
      />
    </div>
  );
}