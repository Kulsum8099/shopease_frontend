"use client"
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useGet } from '@/hooks/useGet';
import { useCookies } from 'next-client-cookies';
import React from 'react'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from '@/lib/auth';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
const Navbar = ({children}:any) => {
      const cookies = useCookies();
      const id = cookies.get("id");
      type UserInfo = {
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        address?: string;
      };
const router = useRouter();
      const { data} = useGet<{ data?: UserInfo }>(`/auth/userInfo/${id}`, [
        "userInfoNav",
      ]);
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <SidebarTrigger />
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">
                  {data?.data?.fullName ?? "Admin User"}
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
    </div>
  );
}

export default Navbar
