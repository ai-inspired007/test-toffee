import Image from "next/image"
const Banner3 = () => {
  return (
    <div className="w-full h-[304px] bg-[#B059CE] rounded-2xl grid sm:grid-cols-2 grid-cols-1 overflow-hidden">
      <div className="w-full h-full absolute z-10" />

      <div className="flex flex-col h-full w-full px-4 pt-4 pb-[50px] sm:px-8 sm:pt-8 sm:pb-16 justify-between">
        <div className="flex flex-col w-full sm:w-[450px] text-start">
          <h1 className="text-white text-[20px] sm:text-[32px] font-medium ">
            Try this out!
          </h1>
          <div className="text-white text-[13px] sm:text-[15px]  leading-5 tracking-[0.25px] mt-2">
            {
              "You are 20 coins away from being able to order your saved product Elgato HD60 Capture Card."
            }
          </div>
        </div>
      </div>
      <div className="relative w-full hidden sm:block">
        <Image src={"/banners/3.png"} alt="Banner3" width={600} height={220} sizes="100vw" className="absolute right-0 object-cover object-center -mt-4" />
      </div>
    </div>
  )
}

export default Banner3