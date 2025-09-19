import Link from "next/link";
import React, { useState, ReactNode, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

type DropdownItem = {
  name: string;
  path?: string;
  isArrow?: boolean;
  children?: DropdownItem[];
};

type MultiLevelDropdownProps = {
  item: any;
  pathName: string;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

function CustomMultiLevelDropDown({
  item,
  pathName,
  isOpen,
  setMobileMenuOpen,
}: MultiLevelDropdownProps) {
  const [openDropDown, setOpenDropDown] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setOpenDropDown([]);
    }
  }, [isOpen]);

  
  const toggleDropDown = (key: string, level: number) => {
    setOpenDropDown((prev) => {
      const updated = [...prev];

      const index = updated.indexOf(key);

      if (index !== -1) {
        return updated.filter((k) => !k.startsWith(`${level}`));
      }

      const filtered = updated.filter((k) => !k.startsWith(`${level}`));
      return [...filtered, key];
    });
  };

  const renderItems = (menuItems: any[], level: number = 0): ReactNode => {
    return menuItems?.map((item, index) => {
      const key = `${level}-${index}`;
      const hasChildren = item?.children && item?.children?.length > 0;
      const isOpen = openDropDown.includes(key);

      return (
        <li key={key} className="relative list-none">
          <Link href={item?.path} key={index + 1}>
            <button
              onClick={() => {
                hasChildren && toggleDropDown(key, level);
                item?.path !== "#" && setMobileMenuOpen(false);
              }}
              className={`w-full flex justify-between items-center pr-3 py-2 font-bold border-b border-b-[#D4D4D4] ${
                pathName === item.path ? "bg-white text-brandColor" : ""
              } hover:text-brandColor hover:bg-white pl-2.5`}
            >
              <p>{item.name}</p>
              {hasChildren && (
                <IoIosArrowDown
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              )}
            </button>
          </Link>
          {hasChildren && isOpen && (
            <ul className="pl-4 bg-white rounded-md">
              {renderItems(item?.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return <div>{renderItems(item)}</div>;
}

export default CustomMultiLevelDropDown;
