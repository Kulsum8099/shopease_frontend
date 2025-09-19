import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldX, Home, ArrowLeft } from "lucide-react"

export default function NotAuthorizedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardContent className="pt-6">
                    <div className="mb-6">
                        <ShieldX className="mx-auto h-16 w-16 text-red-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>

                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. Please contact an administrator if you believe this is an
                        error.
                    </p>

                    <div className="space-y-3">
                        <Button asChild className="w-full">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Go to Homepage
                            </Link>
                        </Button>

                        <Button variant="outline" asChild className="w-full bg-transparent">
                            <Link href="javascript:history.back()">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need help?{" "}
                            <Link href="/contact" className="text-blue-600 hover:underline">
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
