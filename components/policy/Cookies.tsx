"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
    Cookie,
    Shield,
    Settings,
    Info,
} from "lucide-react"

export function CookiesPage() {
    const [cookieSettings, setCookieSettings] = useState({
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true,
    })

    const handleCookieToggle = (type: keyof typeof cookieSettings) => {
        if (type === "necessary") return
        setCookieSettings((prev) => ({
            ...prev,
            [type]: !prev[type],
        }))
    }

    const saveCookieSettings = () => {
        localStorage.setItem("cookieSettings", JSON.stringify(cookieSettings))
        alert("Cookie preferences saved successfully!")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Cookie Policy"
                description="Learn about how we use cookies and manage your preferences"
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <Tabs defaultValue="policy" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="policy">Cookie Policy</TabsTrigger>
                        <TabsTrigger value="settings">Cookie Settings</TabsTrigger>
                    </TabsList>

                    {/* Policy Tab */}
                    <TabsContent value="policy" className="space-y-6">
                        {/* What Are Cookies */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Cookie className="h-5 w-5" />
                                    What Are Cookies?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600">
                                    Cookies are small text files placed on your device to help us
                                    improve your experience and track site usage.
                                </p>
                                <p className="text-gray-600">
                                    We use them for analytics, preferences, and marketing
                                    purposes. This page explains the types we use and your control
                                    options.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Types of Cookies */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Types of Cookies We Use</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <CookieCategory
                                    color="red"
                                    badge="Essential"
                                    title="Necessary Cookies"
                                    description="Enable core functionality. Cannot be disabled."
                                    items={[
                                        "Authentication and login status",
                                        "Shopping cart contents",
                                        "Security and fraud prevention",
                                        "Load balancing",
                                    ]}
                                />
                                <CookieCategory
                                    color="blue"
                                    badge="Analytics"
                                    title="Analytics Cookies"
                                    description="Understand how visitors interact with the website."
                                    items={[
                                        "Google Analytics",
                                        "Page views and user behavior",
                                        "Site performance monitoring",
                                        "Error tracking",
                                    ]}
                                />
                                <CookieCategory
                                    color="green"
                                    badge="Preferences"
                                    title="Preference Cookies"
                                    description="Remember choices like language or theme."
                                    items={[
                                        "Language preferences",
                                        "Currency selection",
                                        "Theme preferences",
                                        "Recently viewed products",
                                    ]}
                                />
                                <CookieCategory
                                    color="purple"
                                    badge="Marketing"
                                    title="Marketing Cookies"
                                    description="Track users across websites for advertising."
                                    items={[
                                        "Facebook Pixel",
                                        "Google Ads",
                                        "Retargeting campaigns",
                                        "Social media integration",
                                    ]}
                                />
                            </CardContent>
                        </Card>

                        {/* Third Party Cookies */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Third-Party Cookies</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                {[
                                    {
                                        title: "Google Analytics",
                                        desc: "Helps us understand website usage and improve UX.",
                                    },
                                    {
                                        title: "Facebook Pixel",
                                        desc: "Enables targeted advertising and tracking.",
                                    },
                                    {
                                        title: "Payment Processors",
                                        desc: "Secure payment processing and fraud prevention.",
                                    },
                                    {
                                        title: "Live Chat",
                                        desc: "Customer support and real-time communication.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 border rounded-lg">
                                        <h4 className="font-semibold mb-1">{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Managing Cookies */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Managing Your Cookies</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-600 text-sm">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Use the Cookie Settings tab to manage preferences</li>
                                    <li>Change cookie settings in your browser</li>
                                    <li>Use extensions to block unwanted cookies</li>
                                    <li>Opt out of third-party tracking services</li>
                                </ul>
                                <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <Info className="h-5 w-5 text-yellow-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-yellow-800">
                                            Important Note
                                        </h4>
                                        <p className="text-yellow-700">
                                            Disabling some cookies may affect site functionality.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Cookie Preferences
                                </CardTitle>
                                <CardDescription>
                                    Customize your cookie preferences. Changes apply immediately.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        key: "necessary",
                                        title: "Necessary Cookies",
                                        desc: "Essential for website functionality. Cannot be disabled.",
                                        variant: "destructive",
                                        disabled: true,
                                    },
                                    {
                                        key: "analytics",
                                        title: "Analytics Cookies",
                                        desc: "Improve our site by analyzing usage patterns.",
                                        variant: "secondary",
                                    },
                                    {
                                        key: "marketing",
                                        title: "Marketing Cookies",
                                        desc: "Used for targeted advertising and social media features.",
                                        variant: "outline",
                                    },
                                    {
                                        key: "preferences",
                                        title: "Preference Cookies",
                                        desc: "Remember user choices and preferences.",
                                        variant: "outline",
                                    },
                                ].map(({ key, title, desc, variant, disabled }) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-white"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant={variant as any}>
                                                    {disabled ? "Required" : "Optional"}
                                                </Badge>
                                                <h3 className="font-semibold">{title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600">{desc}</p>
                                        </div>
                                        <Switch
                                            checked={cookieSettings[key as keyof typeof cookieSettings]}
                                            disabled={disabled}
                                            onCheckedChange={() =>
                                                handleCookieToggle(key as keyof typeof cookieSettings)
                                            }
                                        />
                                    </div>
                                ))}

                                <div className="flex gap-4 pt-4 border-t">
                                    <Button onClick={saveCookieSettings} className="flex-1">
                                        Save Preferences
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setCookieSettings({
                                                necessary: true,
                                                analytics: false,
                                                marketing: false,
                                                preferences: false,
                                            })
                                        }
                                    >
                                        Reject All Optional
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Browser Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                {[
                                    ["Chrome", "Settings → Privacy and Security → Cookies"],
                                    ["Firefox", "Options → Privacy & Security → Cookies"],
                                    ["Safari", "Preferences → Privacy → Cookies"],
                                    ["Edge", "Settings → Privacy → Cookies"],
                                ].map(([browser, instructions]) => (
                                    <div key={browser} className="p-3 border rounded">
                                        <h4 className="font-semibold mb-1">{browser}</h4>
                                        <p>{instructions}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Footer Help */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Questions About Cookies?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                        <p>
                            <strong>Email:</strong> privacy@yourstore.com
                        </p>
                        <p>
                            <strong>Phone:</strong> +1 (555) 123-4567
                        </p>
                        <p>
                            <strong>Address:</strong> 123 Commerce Street, NY 10001
                        </p>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-500 mt-8">
                    Last updated: January 2024
                </div>
            </div>
        </div>
    )
}

// Reusable category section
function CookieCategory({
    badge,
    title,
    description,
    items,
    color,
}: {
    badge: string
    title: string
    description: string
    items: string[]
    color: string
}) {
    return (
        <div className={`border-l-4 border-${color}-500 pl-4`}>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{badge}</Badge>
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </div>
    )
}
