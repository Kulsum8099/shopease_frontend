import React from "react";

const RedButtonComp = ({ name }: { name: string }) => {
  return (
    <div
      className="bg-brandColor flex justify-center items-center py-3 px-8 
        transition duration-500 lg:hover:scale-95 cursor-pointer "
    >
      <p className="text-base text-backgroundColor font-medium leading-6">
        {name}
      </p>
    </div>
  );
};

export default RedButtonComp;
