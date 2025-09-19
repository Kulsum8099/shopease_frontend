import { useEffect } from "react";
import CustomMultiLevelDropDown from "./CustomMultiLevelDropDown";

interface DrawerCompProps {
  isOpen: boolean;
  isNavbarFixed: boolean;
  pathName: string;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const menu = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "#",
    isArrow: true,
    children: [
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
    ],
  },
  {
    name: "Expertise",
    isArrow: true,
    // path: "/expertise/kitchen-area/trending-now",
    path: "#",
    children: [
      {
        name: "Kitchen",
        path: "#",
        isArrow: true,
        children: [
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
        // path: "/expertise/vanities",
        path: "#",
        isArrow: true,
        children: [
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
    ],
  },
  {
    name: "Products",
    path: "/products",
  },
  {
    name: "Sales Point",
    path: "/sales-point",
  },
  {
    name: "Events & News",
    path: "/events-and-news",
  },
  {
    name: "Catalog",
    path: "/catalog",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const ToggleNavbar = ({
  isOpen,
  isNavbarFixed,
  pathName,
  setMobileMenuOpen,
}: DrawerCompProps) => {
  // Prevent body from scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Ensure the body can scroll again when component unmounts
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed w-screen p-4 ${
        isNavbarFixed ? "top-24" : "h-32"
      }  left-0 right-0 z-[999] transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }  lg:bg-black bg-white overflow-y-scroll transition-transform duration-300 ease-in-out text-black lg:text-white border-t border-t-[#E84538] lg:border-t-white`}
      style={{ height: "calc(100vh - 6rem)" }}
    >
      <CustomMultiLevelDropDown
        item={menu}
        pathName={pathName}
        isOpen={isOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </div>
  );
};

export default ToggleNavbar;
