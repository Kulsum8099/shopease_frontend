import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TravellerRegistrationSuccessPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription>Thank you for applying to be a traveller with ShopEase</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your application has been received and is now being reviewed by our team. This process typically takes 2-3
              business days.
            </p>
            <p className="text-gray-600 mb-4">
              We'll notify you by email once your application has been approved or if we need any additional
              information.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
              <p>
                <strong>Application ID:</strong> TRV-{Math.floor(100000 + Math.random() * 900000)}
              </p>
              <p>
                <strong>Submission Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
