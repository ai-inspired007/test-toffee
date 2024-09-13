import Image from "next/image";

const GeneratingVoice = () => {
  return (
    <div className="flex w-full max-w-[560px] flex-col items-start gap-10">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <Image
            src="/generating_voice.svg"
            width={0}
            height={0}
            alt="rule"
            className="h-[100px] w-[100px]"
          />
          <span className="mt-4 text-[32px] font-semibold leading-10 text-white">
            Generating voice
          </span>
          <span className=" text-[14px] font-normal leading-[22px] text-text-tertiary">
            Wait couple of seconds until we have been generated pictures for you
          </span>
        </div>
        <div className="flex w-full flex-col"></div>
      </div>
    </div>
  );
};

export default GeneratingVoice;
