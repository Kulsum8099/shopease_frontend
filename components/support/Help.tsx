"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    MessageCircle,
    Phone,
    Mail,
    Clock,
    ShoppingBag,
    CreditCard,
    Truck,
    RotateCcw,
} from "lucide-react"

export function Help() {
    const [searchQuery, setSearchQuery] = useState("")

    const helpCategories = [
        {
            icon: ShoppingBag,
            title: "Orders & Shopping",
            description: "Help with placing orders, tracking, and shopping",
            color: "bg-blue-50 text-blue-600",
        },
        {
            icon: CreditCard,
            title: "Payment & Billing",
            description: "Payment methods, billing issues, and refunds",
            color: "bg-green-50 text-green-600",
        },
        {
            icon: Truck,
            title: "Shipping & Delivery",
            description: "Shipping options, delivery times, and tracking",
            color: "bg-purple-50 text-purple-600",
        },
        {
            icon: RotateCcw,
            title: "Returns & Exchanges",
            description: "Return policy, exchanges, and refund process",
            color: "bg-orange-50 text-orange-600",
        },
    ]

    const faqs = [
        {
            question: "How do I track my order?",
            answer:
                'You can track your order by logging into your account and visiting the "Orders" section. You\'ll find tracking information and real-time updates on your order status.',
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers.",
        },
        {
            question: "How long does shipping take?",
            answer:
                "Standard shipping takes 3-5 business days, Express shipping takes 1-2 business days, and Same-day delivery is available in select areas.",
        },
        {
            question: "What is your return policy?",
            answer:
                "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some restrictions apply to certain categories.",
        },
        {
            question: "How do I cancel my order?",
            answer:
                "You can cancel your order within 1 hour of placing it by visiting your account or contacting customer service. After processing begins, cancellation may not be possible.",
        },
        {
            question: "Do you offer international shipping?",
            answer:
                "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination. Check our shipping page for more details.",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Help Center"
                description="Find answers to your questions and get the support you need"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Box */}
                <div className="mb-12">
                    <Card>
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">How can we help you?</h2>
                                <p className="text-gray-600">Search our help center or browse categories below</p>
                            </div>
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Search for help..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-3 text-lg"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {helpCategories.map((category, index) => {
                            const Icon = category.icon
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div
                                            className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                                        >
                                            <Icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                                        <p className="text-sm text-gray-600">{category.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* FAQs */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <Card>
                        <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Support Options */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SupportCard
                            icon={MessageCircle}
                            title="Live Chat"
                            desc="Chat with our support team"
                            btnLabel="Start Chat"
                            iconColor="text-blue-600"
                        />
                        <SupportCard
                            icon={Phone}
                            title="Phone Support"
                            desc="Call us at 1-800-123-4567"
                            btnLabel="Call Now"
                            iconColor="text-green-600"
                            variant="outline"
                        />
                        <SupportCard
                            icon={Mail}
                            title="Email Support"
                            desc="Get help via email"
                            btnLabel="Send Email"
                            iconColor="text-purple-600"
                            variant="outline"
                        />
                    </div>

                    <Card className="mt-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>Support Hours: Monday - Friday, 9 AM - 6 PM EST</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function SupportCard({
    icon: Icon,
    title,
    desc,
    btnLabel,
    variant = "default",
    iconColor,
}: {
    icon: any
    title: string
    desc: string
    btnLabel: string
    variant?: "default" | "outline"
    iconColor?: string
}) {
    return (
        <Card>
            <CardContent className="p-6 text-center">
                <Icon className={`h-12 w-12 mx-auto mb-4 ${iconColor || ""}`} />
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">{desc}</p>
                <Button variant={variant} className="w-full">
                    {btnLabel}
                </Button>
            </CardContent>
        </Card>
    )
}
