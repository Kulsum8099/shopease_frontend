"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Download, Package, ShoppingBag } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGet } from "@/hooks/useGet"

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const id = searchParams.get("orderId")
    const method = searchParams.get("method")

    if (!id) {
      router.push("/")
      return
    }

    setOrderId(id)
    setPaymentMethod(method || "")

    toast.success(`Order #${id} placed successfully!`, {
      autoClose: 5000,
      hideProgressBar: true,
    })
  }, [searchParams, router])

  const handleDownloadInvoice = async () => {
    if (!orderId) return

    setIsDownloading(true)
    try {
      // Option 1: Direct PDF download
      const response = await fetch(`/api/invoice/${orderId}`, {
        headers: {
          'Content-Type': 'application/pdf',
          'Accept': 'application/pdf'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to generate invoice')
      }

      // Check if response is a PDF
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Invalid file type received')
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (error) {
      console.error('Download error:', error)

      // Fallback: Open invoice in new tab if download fails
      try {
        window.open(`/api/invoice/${orderId}`, '_blank')
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
        toast.error('Could not download or display invoice')
      }
    } finally {
      setIsDownloading(false)
    }
  }

  // Alternative approach using a separate API route
  const handleDownloadInvoiceAlternative = async () => {
    if (!orderId) return

    setIsDownloading(true)
    try {
      // First request to generate invoice and get download URL
      const generateResponse = await fetch(`/api/generate-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      if (!generateResponse.ok) {
        throw new Error('Failed to generate invoice')
      }

      const { downloadUrl } = await generateResponse.json()

      // Trigger download from the generated URL
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `invoice-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download invoice')
    } finally {
      setIsDownloading(false)
    }
  }

  if (!orderId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-4">
          Your order has been received and is now being processed.
        </p>
        <p className="text-gray-600">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>

        {paymentMethod === "cod" && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left max-w-md mx-auto">
            <p className="text-yellow-700">
              You've selected Cash on Delivery. Please have the exact amount
              ready when your order arrives.
            </p>
          </div>
        )}
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium mb-2">Order Confirmation</h2>
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to your email address with
                all the details of your order.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">What Happens Next?</h3>
              <ol className="space-y-4 mt-4">
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-medium mr-3">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-gray-500">
                      We're preparing your order for shipment. You'll receive an
                      email once your order has been shipped.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-medium mr-3">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-sm text-gray-500">
                      Your order will be shipped via our trusted delivery
                      partners. You'll receive a tracking number to monitor your
                      package.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-medium mr-3">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-500">
                      Your order will be delivered to the shipping address you
                      provided during checkout.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              {/* <Button className="bg-rose-600 hover:bg-rose-700">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button> */}
              {/* <Button
                className="bg-rose-600 hover:bg-rose-700"
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Preparing..." : "Download Invoice"}
              </Button> */}
              <Link href={`/orders/${orderId}`}>
                <Button variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Track Your Order
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <div className="text-center space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} href={`/products/${item}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                  <Image
                    src={`/abstract-geometric-shapes.png?height=200&width=200&query=product ${item}`}
                    alt={`Product ${item}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-medium group-hover:text-rose-600">
                  Product Name {item}
                </h3>
                <p className="text-sm text-gray-500">
                  ৳{(19.99 * item).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <Link href="/products">
            <Button variant="outline" className="mt-4">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div> */}
    </div>
  );
}