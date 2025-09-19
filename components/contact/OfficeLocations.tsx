import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const offices = [
    {
        city: "New York",
        address: "123 Business Ave, Suite 100",
        zipcode: "New York, NY 10001",
        phone: "+1 (555) 123-4567",
    },
    {
        city: "Los Angeles",
        address: "456 Commerce St, Floor 5",
        zipcode: "Los Angeles, CA 90210",
        phone: "+1 (555) 987-6543",
    },
    {
        city: "Chicago",
        address: "789 Trade Blvd, Suite 200",
        zipcode: "Chicago, IL 60601",
        phone: "+1 (555) 456-7890",
    },
]

export default function OfficeLocations() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Our Offices</CardTitle>
                <CardDescription>Visit us at one of our locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {offices.map((office, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-900">{office.city}</h4>
                                <p className="text-sm text-gray-600">{office.address}</p>
                                <p className="text-sm text-gray-600">{office.zipcode}</p>
                                <p className="text-sm text-gray-900 mt-1">{office.phone}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
