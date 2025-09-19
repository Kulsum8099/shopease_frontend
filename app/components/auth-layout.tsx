import type React from "react"
import Link from "next/link"
import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/Logo.png"
                alt="Logo"
                width={175}
                height={48}
                priority
              />
            </Link>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/sign-up/signUp.jpeg" // Make sure this exists in your public folder
          alt="Shopping experience"
          fill
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-orange-500/10"></div>
        <div className="relative flex h-full items-center justify-center p-8">
          <div className="max-w-md text-center text-gray-900 *:first-letter:first-line:marker:3">
            <h3 className="text-3xl font-bold">Welcome to ShopEase</h3>
            <p className="mt-4 text-lg">Discover amazing products with the best shopping experience.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
