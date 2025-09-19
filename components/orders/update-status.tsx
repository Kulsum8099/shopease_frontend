"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useUpdate } from "@/hooks/useUpdate"
import { OrderStatus } from "@/types/order" // Ensure this type is defined

interface UpdateOrderStatusDialogProps {
  orderId: string
  currentStatus: OrderStatus // Explicitly typed as OrderStatus
  open: boolean
  onOpenChange: (open: boolean) => void
  refetch?: () => void
}

export function UpdateOrderStatusDialog({
  orderId,
  currentStatus,
  open,
  onOpenChange,
  refetch
}: UpdateOrderStatusDialogProps) {
  const { toast } = useToast()
  const [status, setStatus] = useState<OrderStatus>(currentStatus)

  const { mutate: updateOrderStatus, isPending } = useUpdate(
    `/orders/${orderId}/status`,
    () => {
      toast({
        title: "Status updated",
        description: `Order #${orderId.slice(-6).toUpperCase()} is now ${status}`,
      })
      refetch?.()
      onOpenChange(false)
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== currentStatus) {
      updateOrderStatus({ status })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription className="flex gap-1">
            <span>Current status:</span>
            <span className="font-medium capitalize">{currentStatus}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              disabled={status==="cancelled"}
              value={status}
              onValueChange={(value: OrderStatus) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {["processing", "shipped", "cancelled", "pending"].map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={status === currentStatus || isPending}
            >
              {isPending ? "Saving..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// formatDate utility (add this to your lib/utils.ts)
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
