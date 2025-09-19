"use client";
import React, { useState } from "react";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiCategoryAlt } from "react-icons/bi";
import { FaHourglassEnd } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { TbBrandDatabricks } from "react-icons/tb";
import { useCookies } from "next-client-cookies";

const KitchenLogoWhite = "/images/navbar/whiteLogo.png";

export function SidebarM({ children }: { children: React.ReactNode }) {
  const cookies = useCookies();

  const links = [
    {
      label: "Brand",
      href: "/admin/brand",
      icon: <TbBrandDatabricks className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Category",
      href: "/admin/category",
      icon: <BiCategoryAlt className=" h-5 w-5 flex-shrink-0" />,
    },
    // {
    //     label: "Color",
    //     href: "/admin/color",
    //     icon: (
    //         <IoIosColorPalette className=" h-5 w-5 flex-shrink-0" />
    //     ),
    // },
    {
      label: "Finish",
      href: "/admin/finish",
      icon: <FaHourglassEnd className=" h-5 w-5 flex-shrink-0" />,
    },
    // {
    //     label: "Installation Type",
    //     href: "/admin/installation-type",
    //     icon: (
    //         <MdOutlineInstallDesktop className=" h-5 w-5 flex-shrink-0" />
    //     ),
    // },
    // {
    //     label: "Material",
    //     href: "/admin/material",
    //     icon: (
    //         <GiMaterialsScience className=" h-5 w-5 flex-shrink-0" />
    //     ),
    // },
    // {
    //     label: "Styles",
    //     href: "/admin/style",
    //     icon: (
    //         <MdOutlineStyle className=" h-5 w-5 flex-shrink-0" />
    //     ),
    // },
    {
      label: "Product ",
      href: "/admin/product",
      icon: (
        <MdOutlineProductionQuantityLimits className=" h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Logout",
    //   href: "#",
    //   icon: <FiLogOut className=" h-5 w-5 flex-shrink-0" />,
    // },
  ];

  const logout = {
    label: "Logout",
    href: "/",
    icon: <FiLogOut className=" h-5 w-5 flex-shrink-0" />,
  };

  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-brandColorLs w-full h-screen flex-1"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={`hover:text-primary text-white ${
                    pathName === link.href && "text-brandColor"
                  }`}
                />
              ))}
              {/* ======= logout button ======== */}
              <div
                onClick={() => {
                  cookies.remove("myKitchenAccessToken");
                  cookies.remove("myKitchenRefreshToken");
                }}
              >
                <SidebarLink
                  link={logout}
                  className={`hover:text-primary text-white`}
                />
              </div>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "My Kitchen",
                href: "#",
                icon: (
                  <Image
                    src={"/images/vai.jfif"}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-Tertiary bg-backgroundColor flex flex-col gap-2 flex-1 w-full h-full overflow-hidden overflow-y-scroll text-brandColorSecondary">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <Image
        src={KitchenLogoWhite}
        alt="kitchen logo"
        width={100}
        height={100}
      />
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <Image src={KitchenLogoWhite} alt="kitchen logo" width={60} height={60} />
    </Link>
  );
};
