"use client";

import React from "react";
import Link from "next/link";
import { XCircle, Home, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FailedPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-red-600">Payment Failed</h1>
        <p className="text-gray-600 mb-4">
          Unfortunately, your payment could not be processed.
        </p>
        <p className="text-gray-600">
          Please try again or choose a different payment method.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6 space-y-6 text-center">
          <h2 className="text-lg font-medium">What Can You Do?</h2>
          <ul className="space-y-3 text-sm text-gray-500 text-left max-w-md mx-auto">
            <li>• Double-check your payment details and try again.</li>
            <li>
              • Ensure your card or payment method has sufficient balance.
            </li>
            <li>• Try a different payment method if available.</li>
          </ul>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
