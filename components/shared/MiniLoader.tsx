"use client"
import dynamic from "next/dynamic";
import comingSoonLottie from "../../../public/lottie/loading.json";
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

const MiniLoader = () => {
  return (
    <div className="flex justify-center items-center">
      {/* <Lottie
        animationData={loading}
        loop={true}
        className="w-[25px] h-[25px]"
      /> */}
      <Player autoplay loop src={comingSoonLottie} />
    </div>
  );
};

export default MiniLoader;
