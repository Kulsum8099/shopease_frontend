import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="relative h-40 w-40 mx-auto mb-6">
          <Image
            src="/placeholder.svg?height=160&width=160&query=404 error illustration"
            alt="404 Error"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-rose-600 hover:bg-rose-700">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
