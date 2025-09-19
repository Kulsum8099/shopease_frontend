import dynamic from "next/dynamic"
import type { Metadata } from "next"
import { Loader } from "lucide-react"

export const metadata: Metadata = {
    title: "Help Center | ShopEase",
    description: "Browse FAQs, contact support, and get answers in our help center.",
}

const DynamicHelpPage = dynamic(() => import("@/components/support/Help").then(mod => mod.Help), {
    loading: () => <Loader />
})

export default function Page() {
    return <DynamicHelpPage />
}
