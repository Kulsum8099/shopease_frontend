"use client";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import DrawerComponent from "./DrawerComponent";

interface DrawerControllerProps {
  toggleMenuClose: () => void;
}

const DrawerController = ({ toggleMenuClose }: DrawerControllerProps) => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const handleClick = () => {
    setIsOpenDrawer(!isOpenDrawer);
    toggleMenuClose(); // Close the menu when the drawer is clicked.  (This is a custom hook that toggles the menu open/closed state.)  Note: The toggleMenuClose function is assumed to be passed down to this component via props.  If not, you'll need to provide this function in a parent component.  This is a simplified example and may not be suitable for all use cases.  For a more robust solution, consider using a library like "react-burger-menu" or "react-sidebar".  For a full-featured menu, consider using a full-stack solution like Next.js with a backend and frontend.  These solutions offer more complex features and are typically more resource-intensive.  For a simple, lightweight, and basic menu, a custom solution like this one is sufficient.  This example is just to show how to toggle the drawer open/closed.  The actual implementation may
  };
  return (
    <div>
      <div
        onClick={handleClick}
        className="flex items-center gap-3   font-bold  cursor-pointer hover:text-red-500 "
      >
        <p className="text-base">Search</p> <IoSearch className="text-xl" />
      </div>
      <DrawerComponent
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      />
    </div>
  );
};

export default DrawerController;
