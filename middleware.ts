import { jwtDecode } from "jwt-decode"
import { type NextRequest, NextResponse } from "next/server"

interface DecodedToken {
    id: string
    email: string
    role: "admin" | "customer"
    iat: number
    exp: number
}

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value
    const refreshToken = req.cookies.get("refreshToken")?.value
    const pathname = req.nextUrl.pathname

    const publicRoutes = [
        "/",
        "/ad/login",
        "/login",
        "/register",
        "/forgot-password",
        "/products",
        "/help",
        "/contact",
        "/shipping",
        "/returns",
        "/privacy",
        "/terms",
        "/cookies",
        "/traveller-registration",
        "/cart"
    ]

    const adminRoutes = [
        "/admin",
        "/admin/orders",
        "/admin/products",
        // ... other admin routes
    ]

    // ✅ Allow public routes and product pages
    if (publicRoutes.includes(pathname) || pathname.startsWith("/products/")) {
        return NextResponse.next()
    }

    // 🔐 No token? Redirect to appropriate login based on route
    if (!accessToken) {
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/ad/login", req.url))
        }
        return NextResponse.redirect(new URL("/login", req.url))
    }

    let user: DecodedToken
    try {
        user = jwtDecode<DecodedToken>(accessToken)
    } catch {
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/ad/login", req.url))
        }
        return NextResponse.redirect(new URL("/login", req.url))
    }

    const isTokenExpired = user.exp * 1000 < Date.now()

    // ❌ Expired token and no refresh — logout
    if (isTokenExpired && !refreshToken) {
        const redirectUrl = pathname.startsWith("/admin") ? "/ad/login" : "/login"
        const res = NextResponse.redirect(new URL(redirectUrl, req.url))
        res.cookies.delete("accessToken")
        res.cookies.delete("refreshToken")
        return res
    }

    // ✅ Role-based access
    if (pathname.startsWith("/admin") && user.role !== "admin") {
        return NextResponse.redirect(new URL("/not-authorized", req.url))
    }

    if (pathname.startsWith("/profile") && user.role !== "customer") {
        return NextResponse.redirect(new URL("/not-authorized", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|images).*)",
    ],
}


