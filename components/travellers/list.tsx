"use client"

import { useState } from "react"
import { Eye, CheckCircle, XCircle, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TravellerDetailsDialog } from "./details"
import { ApproveTravellerDialog } from "./approve"
import { RejectTravellerDialog } from "./reject"

// Sample traveller data
const travellers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    destination: "Japan",
    travelDate: "2023-08-15",
    status: "Pending Approval",
    submittedDate: "2023-05-10",
    avatar: "/placeholder.svg?height=40&width=40&query=JD",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    destination: "France",
    travelDate: "2023-09-20",
    status: "Approved",
    submittedDate: "2023-05-05",
    avatar: "/placeholder.svg?height=40&width=40&query=JS",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    destination: "Australia",
    travelDate: "2023-10-10",
    status: "Rejected",
    submittedDate: "2023-05-08",
    avatar: "/placeholder.svg?height=40&width=40&query=RJ",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    destination: "Italy",
    travelDate: "2023-11-05",
    status: "Pending Approval",
    submittedDate: "2023-05-12",
    avatar: "/placeholder.svg?height=40&width=40&query=ED",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    destination: "Spain",
    travelDate: "2023-12-15",
    status: "Approved",
    submittedDate: "2023-05-01",
    avatar: "/placeholder.svg?height=40&width=40&query=MW",
  },
]

export function TravellerList() {
  const [viewTraveller, setViewTraveller] = useState<string | null>(null)
  const [approveTraveller, setApproveTraveller] = useState<string | null>(null)
  const [rejectTraveller, setRejectTraveller] = useState<string | null>(null)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default"
      case "Pending Approval":
        return "warning"
      case "Rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Traveller</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {travellers.map((traveller) => (
              <TableRow key={traveller.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={traveller.avatar || "/placeholder.svg"} alt={traveller.name} />
                      <AvatarFallback>
                        {traveller.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{traveller.name}</div>
                      <div className="text-sm text-muted-foreground">{traveller.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{traveller.destination}</TableCell>
                <TableCell>{traveller.travelDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(traveller.status) as any}>{traveller.status}</Badge>
                </TableCell>
                <TableCell>{traveller.submittedDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setViewTraveller(traveller.id)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      {traveller.status === "Pending Approval" && (
                        <>
                          <DropdownMenuItem onClick={() => setApproveTraveller(traveller.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setRejectTraveller(traveller.id)}>
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" /> Download Documents
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {viewTraveller && (
        <TravellerDetailsDialog
          travellerId={viewTraveller}
          open={!!viewTraveller}
          onOpenChange={(open) => !open && setViewTraveller(null)}
        />
      )}

      {approveTraveller && (
        <ApproveTravellerDialog
          travellerId={approveTraveller}
          open={!!approveTraveller}
          onOpenChange={(open) => !open && setApproveTraveller(null)}
        />
      )}

      {rejectTraveller && (
        <RejectTravellerDialog
          travellerId={rejectTraveller}
          open={!!rejectTraveller}
          onOpenChange={(open) => !open && setRejectTraveller(null)}
        />
      )}
    </>
  )
}
