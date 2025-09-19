import React from "react";

interface Props {
  title: string;
  aboutFirstDescription?: string;
  aboutSecondDescription?: string;
  aboutThirdDescription?: string;
  aboutFourthDescription?: string;
  commonFirstDescription?: string;
  commonSecondDescription?: string;
  commonThirdDescription?: string;
}

const VideoPlaybackAbout: React.FC<Props> = ({
  title,
  aboutFirstDescription,
  aboutSecondDescription,
  aboutThirdDescription,
  aboutFourthDescription,
  commonFirstDescription,
  commonSecondDescription,
  commonThirdDescription,
  
}) => {
  const gif = "/images/about/kitchen.gif";
  return (
    <div>
      <div
        className="relative w-full bg-cover bg-center h-[calc(100vh-160px)]"
        style={{
          backgroundImage: `url(${gif})`,
          backgroundBlendMode: "overlay",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #010202 0%, rgba(1, 2, 2, 0) 40%)",
          }}
        />
        <div className="flex flex-col justify-center items-center lg:items-start lg:left-40 absolute inset-0 ">
          <div>
            <p className="text-2xl md:text-5xl lg:text-7xl text-backgroundColor font-medium ">
              {title}
            </p>
          </div>

          <div className="text-backgroundColor font-normal text-sm md:text-base lg:text-xl mt-2 ">
            {aboutFirstDescription}
            <span className="text-brandColor"> {aboutSecondDescription}</span>
          </div>

          <div className="text-backgroundColor font-normal text-sm md:text-base lg:text-xl">
            {aboutThirdDescription}{" "}
            <span className="text-brandColor">{aboutFourthDescription}</span>
          </div>

          <div className="flex whitespace-nowrap">
            <p className="text-backgroundColor text-sm md:text-base lg:text-xl font-normal">
              {commonFirstDescription}
            </p>
            &nbsp;
            <p className="text-brandColor text-sm md:text-base lg:text-xl font-normal">
              {commonSecondDescription}
            </p>
            &nbsp;
            <p className="text-backgroundColor text-sm md:text-base lg:text-xl font-normal">
              {commonThirdDescription}
            </p>
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaybackAbout;
