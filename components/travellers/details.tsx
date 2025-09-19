"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TravellerDetailsDialogProps {
  travellerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Sample traveller data for demo
const travellerData = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  destination: "Japan",
  travelDate: "2023-08-15",
  returnDate: "2023-08-30",
  purpose: "Tourism",
  status: "Pending Approval",
  submittedDate: "2023-05-10",
  avatar: "/placeholder.svg?height=80&width=80&query=JD",
  documents: [
    { name: "Passport", status: "Verified" },
    { name: "Visa Application", status: "Pending" },
    { name: "Travel Insurance", status: "Verified" },
  ],
  travelHistory: [
    { destination: "France", date: "2022-06-10", duration: "14 days" },
    { destination: "Italy", date: "2021-09-15", duration: "10 days" },
    { destination: "Spain", date: "2020-07-20", duration: "7 days" },
  ],
}

export function TravellerDetailsDialog({ travellerId, open, onOpenChange }: TravellerDetailsDialogProps) {
  const [traveller, setTraveller] = useState(travellerData)

  // In a real app, you would fetch the traveller data based on the ID
  useEffect(() => {
    // Simulating API fetch
    console.log(`Fetching traveller with ID: ${travellerId}`)
    // setTraveller(fetchedTraveller)
  }, [travellerId])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default"
      case "Pending Approval":
      case "Pending":
        return "warning"
      case "Rejected":
        return "destructive"
      case "Verified":
        return "success"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Traveller Details</DialogTitle>
          <DialogDescription>Detailed information about the traveller and their application.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={traveller.avatar || "/placeholder.svg"} alt={traveller.name} />
            <AvatarFallback>
              {traveller.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">{traveller.name}</h3>
            <p className="text-muted-foreground">{traveller.email}</p>
            <p className="text-muted-foreground">{traveller.phone}</p>
            <div className="mt-2">
              <Badge variant={getStatusBadgeVariant(traveller.status) as any}>{traveller.status}</Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Travel Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">Travel History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Travel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{traveller.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Purpose</p>
                    <p className="text-sm text-muted-foreground">{traveller.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Travel Date</p>
                    <p className="text-sm text-muted-foreground">{traveller.travelDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Return Date</p>
                    <p className="text-sm text-muted-foreground">{traveller.returnDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Application Date</p>
                    <p className="text-sm text-muted-foreground">{traveller.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">15 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
                <CardDescription>Documents provided by the traveller for verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {traveller.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium">{doc.name}</div>
                      <Badge variant={getStatusBadgeVariant(doc.status) as any}>{doc.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Previous Travel History</CardTitle>
                <CardDescription>Record of previous international travel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {traveller.travelHistory.map((trip, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <div className="font-medium">{trip.destination}</div>
                      <div className="text-sm text-muted-foreground">
                        {trip.date} • {trip.duration}
                      </div>
                      {index < traveller.travelHistory.length - 1 && <hr className="my-2" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
