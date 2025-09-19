"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesReport } from "@/components/reports/sales"
import { ProductsReport } from "@/components/reports/products"
import { CustomersReport } from "@/components/reports/customers"
import { DateRangePicker } from "@/components/reports/date-range-picker"

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <SalesReport dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <ProductsReport dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <CustomersReport dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
