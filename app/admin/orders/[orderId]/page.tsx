"use client"

import { OrderDetailsView } from "@/app/components/admin/orders/order-details-view"
import { useParams } from "next/navigation"


export default function AdminOrderDetailsPage() {
    const { orderId } = useParams()

    return (
        <div className="container mx-auto py-8 px-4">
            <OrderDetailsView orderId={orderId as string} />
        </div>
    )
}