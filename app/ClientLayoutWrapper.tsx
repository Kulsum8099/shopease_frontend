"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { ToastProvider } from "@/components/ui/toast";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isAdminRoute && <Footer />}
      </div>
    </ToastProvider>
  );
}
