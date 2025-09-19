'use client'
import { TfiClose } from "react-icons/tfi";
import { useEffect } from "react";

interface DrawerCompProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerComponent = ({ isOpen, onClose }: DrawerCompProps) => {
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
      className={`fixed w-screen h-screen top-0 left-0 right-0 z-[9999] transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } bg-gray-800 bg-opacity-85 transition-transform duration-300 ease-in-out`}
    >
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-white top-10 right-[calc(80%+40px)]"
        >
          <TfiClose className="text-xl md:text-2xl lg:text-3xl xl:text-4xl hover:text-red-700" />
        </button>
      </div>

      {/* Drawer */}
      <div className="fixed h-screen right-0 w-[80%] bg-white  p-5 lg:p-10 shadow-lg ">
        <div className="w-full">
          <input
            className={`w-full py-2 lg:py-4 bg-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl  xl:text-7xl font-extralight text-black px-1 outline-none placeholder-gray-500 border-b-[2px] 
               border-b-brandColorSecondary`}
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="mt-6 md:mt-10 lg:mt-16 xl:mt-20 text-textOptional">
          <p className="text-base">Popular Services</p>
          <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl space-y-2 md:space-y-4 mt-2 font-bold md:font-normal">
            <h1 className="">Luxury Kitchen</h1>
            <h1 className=" ">Sintered Counter Top</h1>
            <h1 className=" ">Economy Kitchen</h1>
            <h1 className=" ">Granite Counter Top</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerComponent;
