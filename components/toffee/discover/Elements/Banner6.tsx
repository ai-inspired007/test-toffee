import Image from "next/image"
const Banner6 = () => {
  return (
    <div className="w-full h-[304px] bg-[#BD748E] rounded-2xl grid sm:grid-cols-2 grid-cols-1 overflow-hidden">
      <div className="w-full h-full absolute z-10" />

      <div className="flex flex-col h-full w-full px-4 pt-4 pb-[50px] sm:px-8 sm:pt-8 sm:pb-16 justify-between">
        <div className="flex flex-col w-full sm:w-[450px] text-start">
          <h1 className="text-black text-[20px] sm:text-[32px] font-medium ">
            {"Curious about Eren Yeager's opinion on Game of Thrones?"}
          </h1>
          <div className="text-black text-[13px] sm:text-[15px]  leading-5 tracking-[0.25px] mt-2">
            {
              "Connect the game of Thrones candy to enhance your character with all of ASOIAF!"
            }
          </div>
        </div>
      </div>
      <div className="relative w-full hidden sm:block">
        <Image src={"/banners/6.png"} alt="Banner6" width={700} height={304} sizes="100vw" className="absolute right-0 object-cover object-center -mt-4 -mr-[60px]" />
      </div>
    </div>
  )
}

export default Banner6