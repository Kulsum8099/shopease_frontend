"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  Activity,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d")
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin User</p>
        </div>
        {/* <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳45,231.89</div>
            {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +20.1%
              </span>
              <span>from last month</span>
            </div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +12.2%
              </span>
              <span>from last month</span>
            </div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center text-red-600">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                -2.5%
              </span>
              <span>from last month</span>
            </div> */}
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +4.1%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Charts and Tables */}
      {/* <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Revenue Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-gray-100 mr-3 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Customer #{1000 + i}</p>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="font-medium">${(Math.random() * 100).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Order Status Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Top Products Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">User Growth Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Sales Chart</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Orders Chart</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Users Chart</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}

      {/* Quick Actions */}
      <div className="w-full">
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild className="bg-rose-600 hover:bg-rose-700">
              <Link href="/admin/products/new">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/orders">
                <Package className="mr-2 h-4 w-4" />
                View Recent Orders
              </Link>
            </Button>
          </CardContent>
        </Card> */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {i === 1 ? (
                      <ShoppingCart className="h-4 w-4 text-gray-500" />
                    ) : i === 2 ? (
                      <Users className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Package className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {i === 1
                        ? "New product added"
                        : i === 2
                        ? "New user registered"
                        : "Order #1234 was shipped"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
