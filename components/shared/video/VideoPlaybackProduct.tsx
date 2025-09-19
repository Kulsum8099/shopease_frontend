import React from 'react'

interface Props{
  title:string,
  firstDescription:string,
  secondDescription:string
}

const VideoPlaybackProduct:React.FC<Props> = ({
  title,
  firstDescription,
  secondDescription
}) => {
    const gif='/images/products/slide.gif'
  return (
    <div>
        {/* <div
        className="relative w-full bg-cover bg-center h-[calc(100vh-160px)]"
        style={{
          backgroundImage: `url(${gif})`,
          backgroundBlendMode: "overlay",
        }}
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, #010202 0%, rgba(1, 2, 2, 0) 40%)",
          }}
        />

        <div className=' relative z-20 flex flex-col gap-10 justify-center items-center h-full'>

        <div className='text-backgroundColor text-7xl font-medium'>
          {title}
        </div> 

        <div className='flex flex-col  lg:justify-center items-center '>
          <div className='text-backgroundColor text-2xl font-normal'>{firstDescription}</div>
          <div className='text-backgroundColor text-2xl font-normal'>{secondDescription}</div>
        </div>

        </div>

      </div> */}

<div
        className="relative w-full bg-cover bg-center h-[calc(100vh-160px)]"
        style={{
          backgroundImage: `url(${gif})`,
          backgroundBlendMode: "overlay",
        }}
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, #010202 0%, rgba(1, 2, 2, 0) 40%)",
          }}
        />

        <div className=' relative z-20 flex flex-col gap-10 justify-center items-center h-full'>

        <div className='text-backgroundColor lg:text-7xl text-5xl lg:px-0 px-2 font-medium'>
          {title}
        </div> 

        <div className='flex flex-col items-start md:items-center  lg:px-0 px-2'>
          <div className='text-backgroundColor md:text-2xl text-lg font-normal'>{firstDescription}</div>
          <div className='text-backgroundColor md:text-2xl text-lg font-normal '>{secondDescription}</div>
        </div>

        </div>

      </div>
    </div>
  )
}

export default VideoPlaybackProduct
