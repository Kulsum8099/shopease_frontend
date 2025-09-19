import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
import "./globals.css";
import Providers from "./Providers";
import { CookiesProvider } from "next-client-cookies/server";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopEase - Your One-Stop Shopping Destination",
  description: "Discover amazing products with the best shopping experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CookiesProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Providers>
              <ClientLayoutWrapper>
                {children}
              </ClientLayoutWrapper>
            </Providers>
          </ThemeProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
