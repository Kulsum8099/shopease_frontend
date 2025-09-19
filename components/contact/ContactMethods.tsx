import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MessageSquare } from "lucide-react"

const contactMethods = [
    {
        icon: Phone,
        title: "Phone Support",
        description: "Speak directly with our support team",
        contact: "1-800-123-4567",
        hours: "Mon-Fri, 9 AM - 6 PM EST",
        color: "text-blue-600",
    },
    {
        icon: Mail,
        title: "Email Support",
        description: "Send us an email and we'll respond within 24 hours",
        contact: "support@yourstore.com",
        hours: "Response within 24 hours",
        color: "text-green-600",
    },
    {
        icon: MessageSquare,
        title: "Live Chat",
        description: "Chat with our team in real-time",
        contact: "Available on website",
        hours: "Mon-Fri, 9 AM - 6 PM EST",
        color: "text-purple-600",
    },
]

export default function ContactMethods() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Choose the best way to reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {contactMethods.map((method, index) => {
                    const Icon = method.icon
                    return (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <Icon className={`h-6 w-6 ${method.color} mt-1`} />
                            <div>
                                <h4 className="font-medium text-gray-900">{method.title}</h4>
                                <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                                <p className="text-sm font-medium text-gray-900">{method.contact}</p>
                                <p className="text-xs text-gray-500">{method.hours}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
