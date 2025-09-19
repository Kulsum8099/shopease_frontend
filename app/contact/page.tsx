import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"

// Dynamically import sections
const ContactForm = dynamic(() => import("@/components/contact/ContactForm"))
const ContactMethods = dynamic(() => import("@/components/contact/ContactMethods"))
const OfficeLocations = dynamic(() => import("@/components/contact/OfficeLocations"))
const BusinessHours = dynamic(() => import("@/components/contact/BusinessHours"))

export const metadata: Metadata = {
    title: "Contact Us | ShopEase",
    description: "Get in touch with ShopEase customer support via phone, email, or chat. We're here to help.",
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader title="Contact Us" description="Get in touch with our team - we're here to help" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                    <div className="space-y-6">
                        <ContactMethods />
                        <OfficeLocations />
                        <BusinessHours />
                    </div>
                </div>
            </div>
        </div>
    )
}
