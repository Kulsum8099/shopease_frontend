"use client"

import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface CustomersReportProps {
  dateRange: DateRange
}

// Sample data for the charts
const customerAcquisition = [
  { name: "Jan", total: 400 },
  { name: "Feb", total: 300 },
  { name: "Mar", total: 200 },
  { name: "Apr", total: 278 },
  { name: "May", total: 189 },
  { name: "Jun", total: 239 },
  { name: "Jul", total: 349 },
]

const customerSegmentation = [
  { name: "New", value: 400 },
  { name: "Returning", value: 300 },
  { name: "Loyal", value: 300 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function CustomersReport({ dateRange }: CustomersReportProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Customer Acquisition</CardTitle>
          <CardDescription>
            New customers from {dateRange.from?.toLocaleDateString()} to {dateRange.to?.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={customerAcquisition}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation</CardTitle>
          <CardDescription>Distribution of customer types</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerSegmentation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerSegmentation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Customer Spending by Age Group</CardTitle>
          <CardDescription>Average purchase value by customer age group</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "18-24", value: 120 },
                { name: "25-34", value: 180 },
                { name: "35-44", value: 210 },
                { name: "45-54", value: 190 },
                { name: "55-64", value: 150 },
                { name: "65+", value: 110 },
              ]}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
