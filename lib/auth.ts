import { accessIdDelete, accessRoleDelete, accessTokenDelete, refreshDelete } from "@/actions/cookiesAction"
import { jwtDecode } from "jwt-decode"
import { redirect } from "next/navigation"

interface DecodedToken {
    id: string
    email: string
    role: "admin" | "customer"
    iat: number
    exp: number
}

export function getTokenFromCookies(): string | null {
    if (typeof window === "undefined") return null

    const cookies = document.cookie.split(";")
    const accessTokenCookie = cookies.find((cookie) => cookie.trim().startsWith("accessToken="))

    return accessTokenCookie ? accessTokenCookie.split("=")[1] : null
}

export function getUserFromToken(): DecodedToken | null {
    const token = getTokenFromCookies()
    if (!token) return null

    try {
        const decoded = jwtDecode<DecodedToken>(token)

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            return null
        }

        return decoded
    } catch {
        return null
    }
}

export function isAuthenticated(): boolean {
    return getUserFromToken() !== null
}

export function isAdmin(): boolean {
    const user = getUserFromToken()
    return user?.role === "admin"
}

export function isCustomer(): boolean {
    const user = getUserFromToken()
    return user?.role === "customer"
}

export function logout1() {
    // Clear cookies
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // Redirect to login
    window.location.href = "/login"
}

export async function logout() {
    // Delete the refresh token from cookies
    await refreshDelete();
    await accessTokenDelete();
    await accessIdDelete();
    await accessRoleDelete();

    // Remove user-specific information from localStorage
    //   removeUserInfo("accessToken"); // Replace "userInfo" with the actual key you use

    // Redirect to the home page
    redirect("/");
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
    // Set cookies with proper expiration
    const accessTokenExpiry = new Date()
    accessTokenExpiry.setHours(accessTokenExpiry.getHours() + 1) // 1 hour

    const refreshTokenExpiry = new Date()
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7) // 7 days

    document.cookie = `accessToken=${accessToken}; expires=${accessTokenExpiry.toUTCString()}; path=/; secure; samesite=strict`
    document.cookie = `refreshToken=${refreshToken}; expires=${refreshTokenExpiry.toUTCString()}; path=/; secure; samesite=strict`
}
