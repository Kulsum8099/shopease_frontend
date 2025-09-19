"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown, IoIosHeartEmpty } from "react-icons/io";
import { TfiClose } from "react-icons/tfi";
import DrawerController from "./DrawerController";
import ToggleNavbar from "./ToggleNavbar";
import { BiSolidOffer } from "react-icons/bi";

const expertiseInfo = [
  {
    name: "Kitchen",
    path: "/expertise/kitchen-area",
    submenu: [
      {
        name: "Trending Now",
        path: "/expertise/kitchen-area/trending-now",
      },
      {
        name: "Standard Kitchen",
        path: "/expertise/kitchen-area/standard-kitchen",
      },
      {
        name: "Luxury Kitchen",
        path: "/expertise/kitchen-area/luxury-kitchen",
      },
      {
        name: "Economy Kitchen",
        path: "/expertise/kitchen-area/economy-kitchen",
      },
      {
        name: "Couple Kitchen",
        path: "/expertise/kitchen-area/couple-kitchen",
      },
      {
        name: "Parallel Kitchen",
        path: "/expertise/kitchen-area/parallel-kitchen",
      },
    ],
  },
  {
    name: "Counter Top",
    path: "",
    submenu: [
      {
        name: "Granite",
        path: "/expertise/counter-top/granite",
      },
      {
        name: "Acrylic Solid Surface",
        path: "/expertise/counter-top/acrylic-solid-surface",
      },
      {
        name: "Sintered",
        path: "/expertise/counter-top/sintered",
      },
      {
        name: "HPL",
        path: "/expertise/counter-top/hpl",
      },
      {
        name: "CPL",
        path: "/expertise/counter-top/cpl",
      },
    ],
  },
  {
    name: "Wardrobes",
    path: "/expertise/wardrobes",
  },
  {
    name: "Walk-In Closets",
    path: "/expertise/walk-in-closets",
  },
  {
    name: "Vanities",
    path: "/expertise/vanities",
  },
  {
    name: "Accessories",
    path: "/expertise/accessories",
  },
];

const aboutInfo = [
  {
    name: "Company Profile",
    path: "/company-profile",
  },
  {
    name: "MK-History",
    path: "/mk-History",
  },
  {
    name: "Factory",
    path: "/factory",
  },
  {
    name: "Technology/Our Procedure & Processing of work",
    path: "/technology-our-procedure-processing-of-work",
  },
  {
    name: "Software",
    path: "/software",
  },
  {
    name: "What We Do",
    path: "/what-we-do",
  },
  {
    name: "Certification",
    path: "/certification",
  },
  {
    name: "R&D",
    path: "/r&d",
  },
  {
    name: "OEM/ODM",
    path: "/oem-odm",
  },
];

const KitchenLogoColored = "/images/navbar/colorLogo.png";
const KitchenLogoWhite = "/images/navbar/whiteLogo.png";
const kitchenLogo = "/images/navbar/colorLogo.png";
const Navbar = () => {
  const [isNavbarFixed, setNavbarFixed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathName = usePathname();

  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  const handleMouseEnter = (productName: string) => {
    setActiveProduct(productName);
  };

  const handleMouseLeave = () => {
    setActiveProduct(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const topbarHeight = 80;
      setNavbarFixed(window.scrollY > topbarHeight);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="print:hidden">
      <div className="bg-brandColorLs text-white py-3 ">
        <div className="container mx-auto w-full flex justify-end items-center px-10 xl:px-0">
          <div className="flex items-center justify-end  gap-4 text-sm">
            {/* ======== offer ========== */}
            <div className="flex-shrink-0 flex items-center justify-end gap-1 text-backgroundColor">
              <BiSolidOffer />
              <p className="text-sm font-bold">Offer</p>
            </div>

            {/* ======= find a store ========== */}
            <Link
              href={"/find-store"}
              className="flex-shrink-0 flex items-center justify-end gap-1"
            >
              <FaLocationDot className="text-brandColor" />
              <p className="text-sm font-bold text-backgroundColor">
                Find a Store
              </p>
            </Link>

            {/*=========== wishlist ==========  */}
            <div className="flex justify-center items-center gap-1">
              {/* <FaGlobe className="text-brandColor" />
              <div>WhisList</div> */}
              <Link href={"#"}>
                <IoIosHeartEmpty className="text-brandColor cursor-pointer " />
              </Link>
              {/* <Link href={"/wishlist"}>
                <IoIosHeartEmpty className="text-brandColor cursor-pointer " />
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`navbar font-semibold bg-white  text-black h-24 ${
          // className={`navbar font-semibold hover:bg-white bg-black duration-300 hover:text-black text-white  h-24 hover:border-b hover:border-b-brandColor ${
          isNavbarFixed
            ? // "fixed top-0 left-0 w-full z-[100] shadow-md bg-opacity-70 backdrop-blur"
              "fixed top-0 left-0 w-full z-40 shadow-md bg-opacity-70 backdrop-blur"
            : ""
        }`}
      >
        <div className="relative h-full">
          <div className="container h-full  flex justify-between gap-5 px-10 2xl:px-0">
            <div className="flex items-center h-full">
              {/* ====== big screen ======= */}
              <Link href={"/"}>
                <div className="hidden lg:flex items-center my-5">
                  <Image
                    alt="Kitchen Logo"
                    src={KitchenLogoColored}
                    height={150}
                    width={150}
                    className=""
                  />
                </div>
              </Link>

              {/* ====== small screen ======= */}
              <Link href={"/"}>
                <div className="flex lg:hidden items-center my-5">
                  <Image
                    alt="Kitchen Logo"
                    src={kitchenLogo}
                    height={150}
                    width={150}
                    className=""
                  />
                </div>
              </Link>

              <div className="w-[1px] h-[50px] bg-[#939393] mx-10 my-5"></div>

              {/* ============ navigations ========== */}
              <NavigationMenu className="hidden lg:block">
                <NavigationMenuList className="gap-7">
                  {/* home part */}
                  {/* <NavigationMenuItem className="py-10">
                    <Link
                      href="/"
                      className={`hover:text-brandColor ${
                        pathName === "/" && "text-brandColor"
                      }`}
                    >
                      Home
                    </Link>
                  </NavigationMenuItem> */}

                  {/*======= about part =========== */}
                  <NavigationMenuItem className="py-10">
                    <NavigationMenuTrigger className="py-10">
                      <Link
                        href=""
                        className={`hover:text-brandColor ${
                          pathName === " " && "text-brandColor"
                        }`}
                      >
                        About
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                      // onMouseEnter={() => handleMouseEnter("Products")}
                      onMouseLeave={handleMouseLeave}
                      className="absolute top-0 left-0 h-auto "
                    >
                      <div className="flex items-start pl-[240px] 2xl:pl-[360px] p-10 h-full">
                        <div className="w-80 border-r border-r-brandColor pr-5">
                          {aboutInfo.map((product) => (
                            <Link key={product.name} href={`${product.path}`}>
                              <div
                                className="flex justify-between items-center  hover:bg-brandColor hover:text-white  transition-transform duration-300 cursor-pointer group p-2.5"
                                onMouseEnter={() =>
                                  handleMouseEnter(product.name)
                                }
                              >
                                {product.name}
                                {/* {product?.submenu &&
                                  product?.submenu.length > 0 && (
                                    <IoIosArrowDown className="text-brandColor group-hover:text-white transition-transform duration-300 group-hover:-rotate-90 tran" />
                                  )} */}
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="h-full pl-[50px]">
                          {activeProduct &&
                            expertiseInfo
                              .find((product) => product.name === activeProduct)
                              ?.submenu?.map((submenuItem) => (
                                <Link
                                  key={submenuItem.name}
                                  href={submenuItem.path}
                                >
                                  <div className="p-2 hover:text-brandColor cursor-pointer">
                                    {submenuItem.name}
                                  </div>
                                </Link>
                              ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/*======= expertise ======*/}
                  <NavigationMenuItem className="py-10">
                    <NavigationMenuTrigger className="py-10">
                      <Link
                        href=""
                        className={`hover:text-brandColor ${
                          pathName === " " && "text-brandColor"
                        }`}
                      >
                        Expertise
                      </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                      // onMouseEnter={() => handleMouseEnter("Products")}
                      onMouseLeave={handleMouseLeave}
                      className="absolute top-0 left-0 h-auto "
                    >
                      <div className="flex items-start pl-[240px] 2xl:pl-[360px] p-10 h-full">
                        <div className="w-80 border-r border-r-brandColor pr-5">
                          {expertiseInfo.map((product) => (
                            <Link key={product.name} href={`${product.path}`}>
                              <div
                                className="flex justify-between items-center  hover:bg-brandColor hover:text-white  transition-transform duration-300 cursor-pointer group p-2.5"
                                onMouseEnter={() =>
                                  handleMouseEnter(product.name)
                                }
                              >
                                {product.name}
                                {product.submenu &&
                                  product.submenu.length > 0 && (
                                    <IoIosArrowDown className="text-brandColor group-hover:text-white transition-transform duration-300 group-hover:-rotate-90 tran" />
                                  )}
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="h-full pl-[50px]">
                          {activeProduct &&
                            expertiseInfo
                              .find((product) => product.name === activeProduct)
                              ?.submenu?.map((submenuItem) => (
                                <Link
                                  key={submenuItem.name}
                                  href={submenuItem.path}
                                >
                                  <div className="p-2 hover:text-brandColor cursor-pointer">
                                    {submenuItem.name}
                                  </div>
                                </Link>
                              ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/*====== products ===== */}
                  <NavigationMenuItem>
                    <Link
                      href="/products"
                      className={`hover:text-brandColor ${
                        pathName === "/products" && "text-brandColor"
                      }`}
                    >
                      Products
                    </Link>
                  </NavigationMenuItem>

                  {/*============ sales point ============ */}
                  <NavigationMenuItem>
                    <Link
                      href="/sales-point"
                      className={`hover:text-brandColor ${
                        pathName === "/sales-point" && "text-brandColor"
                      }`}
                    >
                      Sales Point
                    </Link>
                  </NavigationMenuItem>

                  {/*========= events and news =======*/}
                  <NavigationMenuItem>
                    <Link
                      href="/events-and-news"
                      className={`hover:text-brandColor ${
                        pathName === "/events-and-news" && "text-brandColor"
                      }`}
                    >
                      Events & News
                    </Link>
                  </NavigationMenuItem>

                  {/*========== catalog ============*/}
                  <NavigationMenuItem>
                    <Link
                      href="/catalog"
                      className={`hover:text-brandColor ${
                        pathName === "/catalog" && "text-brandColor"
                      }`}
                    >
                      Catalog
                    </Link>
                  </NavigationMenuItem>

                  {/* contact */}
                  <NavigationMenuItem>
                    <Link
                      href="/contact"
                      className={`hover:text-brandColor ${
                        pathName === "/contact" && "text-brandColor"
                      }`}
                    >
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/*  */}
            <div className="flex items-center gap-3 ">
              {/* search drawer */}
              <DrawerController
                toggleMenuClose={() => setMobileMenuOpen(false)}
              />

              {/* b2b / oem button */}
              <button className="w-[86px] h-[40px] bg-[#010202] text-backgroundColor hidden sm:flex justify-center items-center text-sm font-bold">
                B2B/OEM
              </button>

              {/* side drawer after search clicked */}
              <div className="transition-all duration-300">
                {isMobileMenuOpen ? (
                  <TfiClose
                    className="text-xl md:text-2xl lg:text-3xl xl:text-4xl hover:text-brandColor"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ) : (
                  <FaBars
                    className="lg:hidden cursor-pointer hover:text-brandColor"
                    size={24}
                    onClick={toggleMobileMenu}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToggleNavbar
        isOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isNavbarFixed={isNavbarFixed}
        pathName={pathName}
      />

      {isNavbarFixed && <div className="h-20"></div>}
    </div>
  );
};

export default Navbar;
