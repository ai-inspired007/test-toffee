import Image from "next/image";
const Banner1 = () => {
  return (
    <div className="w-full h-[304px] bg-[#7046D5] rounded-2xl grid sm:grid-cols-2 grid-cols-1 overflow-hidden">
      <div className="w-full h-full absolute z-10" />
      <div className="flex flex-col h-full w-full px-4 pt-4 pb-[50px] sm:px-8 sm:pt-8 sm:pb-16 justify-between">
        <div className="flex flex-col w-full sm:w-[450px] text-start">
          <h1 className="text-black text-[20px] sm:text-[32px] font-medium ">
            Knowledge Packs
          </h1>
          <div className="text-black text-[13px] sm:text-[15px]  leading-5 tracking-[0.25px] mt-2">
            {
              "You are 20 coins away from being able to order your saved product Elgato HD60 Capture Card."
            }
          </div>
        </div>
      </div>
      <div className="relative w-full hidden sm:block">
        <Image
          src={"/banners/1.png"}
          alt="Banner1"
          width={420}
          height={304}
          className="absolute right-0 object-cover object-center align-middle -mt-8 mr-4"
        />
      </div>
    </div>
  );
};

export default Banner1;
