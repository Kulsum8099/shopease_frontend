import dynamic from "next/dynamic"
import type { Metadata } from "next"
import { Loader } from "lucide-react"

export const metadata: Metadata = {
    title: "Cookie Policy | ShopEase",
    description: "Manage your cookie preferences and understand how ShopEase uses cookies on our platform.",
}

const DynamicCookiesPage = dynamic(() => import("@/components/policy/Cookies").then(mod => mod.CookiesPage), {
    loading: () => <Loader />
})

export default function Page() {
    return <DynamicCookiesPage />
}
