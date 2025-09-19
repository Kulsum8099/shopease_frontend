"use client";

import dynamic from "next/dynamic";
import comingSoonLottie from "../../../../public/lottie/coming_soon.json";
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function ComingSoonLoader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Player
        autoplay
        loop
        src={comingSoonLottie}
        className=" w-[70%] lg:w-[80%]"
      />
    </div>
  );
}
