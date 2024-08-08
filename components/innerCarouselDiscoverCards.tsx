import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

import DiscoverCard, { DiscoverCardProps } from "@/components/ui/discover-card";
import { Rotate3D } from "lucide-react";

const discoverCards: DiscoverCardProps[] = [
  {
    buttons: ["Try now"],
    color: "#7046d5",
    title: "Knowledge Packs",
    subtitle:
      "You are 20 coins away from being able to order your saved product Elgato HD60 Capture Card",
    htmlpic: (
      <div className="flex items-center">
        <div className="flex h-[9vh] w-[11vh] -rotate-12 flex-col items-center justify-center rounded-[15px] bg-[#202020]">
          <img
            src="/discover/short-avatar1.png"
            alt="avatar1"
            className="h-10 w-10"
          ></img>
          <div className="text-sm">Sousou no Frieren</div>
          <div className="text-xs font-thin">Knowlege pack</div>
        </div>
        <div
          className="flex h-[19vh] w-[15vh] rotate-12 flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{ backgroundImage: "url(/discover/avatar.png)" }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Friren
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>
        <div className="flex h-[8vh] w-[10vh] flex-col items-center justify-center rounded-[15px] bg-[#202020]">
          <img
            src="/discover/short-avatar2.png"
            alt="avatar1"
            className="h-10 w-10"
          ></img>
          <div className="text-sm">The Ultimate Anime</div>
          <div className="text-xs font-thin">Knowlege pack</div>
        </div>
      </div>
    ),
  },
  {
    buttons: ["Open editor", "Try now"],
    color: "#ce9b59",
    title: "Try this out!",
    subtitle:
      "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext ",
    htmlpic: (
      <div
        className="mt-[3vh] flex items-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="-mr-20 flex h-[21vh] w-[17vh] flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{
            backgroundImage: "url(/discover/avatar.png)",
            transform: "rotate3d(70, -70, 0, 50deg)",
          }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Friren
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>

        <div
          className="-mr-20 flex h-[21vh] w-[17vh] flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{
            backgroundImage: "url(/discover/avatar1.png)",
            transform: "rotate3d(70, -70, 0, 50deg)",
          }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Eren Yeager
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">458.7k</div>
            </div>
          </div>
        </div>

        <div
          className="flex h-[21vh] w-[17vh] flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{
            backgroundImage: "url(/discover/avatar2.png)",
            transform: "rotate3d(70, -70, 0, 50deg)",
          }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Zero Two
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    buttons: ["Open editor", "Try now"],
    color: "#b059ce",
    title: "Try this out!",
    subtitle:
      "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext ",
    htmlpic: (
      <div className="flex items-center">
        <div
          className=" mr-20 flex h-[19vh] w-[15vh] flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{ backgroundColor: "#1F1F1F" }}
        >
          <div className="from-orange via-orange-60 left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-end rounded-[15px] bg-gradient-to-b to-transparent p-5">
            <div className="mb-10">
              <img
                src="/discover/short-avatar3.png"
                alt="avatar1"
                className="h-20 w-20"
              ></img>
            </div>
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Minecraft
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>
        <div
          className="flex h-[19vh] w-[15vh] flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{ backgroundImage: "url(/discover/avatar.png)" }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Friren
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    buttons: ["Try now"],
    color: "#74bd7a",
    title: "Curious about Eren Yeager's opinion on Game of Thrones?",
    subtitle:
      "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext ",
    htmlpic: (
      <div className="flex items-center">
        <div className="-mr-4 flex h-[12vh] w-[15vh] flex-col items-start justify-between rounded-[15px] bg-[#202020] p-4">
          <div className="rounded-[10px] bg-[#2F2F2F] p-2">
            <img
              src="/discover/box.png"
              alt="avatar1"
              className="h-5 w-5"
            ></img>
          </div>
          <div className="text-sm">Game of Thrones</div>
          <div className=" flex flex-col items-center justify-center text-xs font-thin">
            The true lore of ASOIAF. {"("}Book &gt; Show{")"}
          </div>
        </div>
        <div
          className="flex h-[19vh] w-[15vh] flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{ backgroundImage: "url(/discover/avatar1.png)" }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Eren Yeager
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    buttons: ["Try now"],
    color: "#466bd5",
    title: "Ever wanted to code side by side with Mark Zuckerburg?",
    subtitle:
      "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext ",
    htmlpic: (
      <div className="flex items-center">
        <div className="flex h-[9vh] w-[11vh] -rotate-12 flex-col items-center justify-center rounded-[15px] bg-[#202020]">
          <div className="rounded-[10px] bg-[#2F2F2F] p-2">
            <img
              src="/discover/box.png"
              alt="avatar1"
              className="h-5 w-5"
            ></img>
          </div>
          <div className="text-sm">JavaScript</div>
          <div className="text-xs font-thin">Knowlege pack</div>
        </div>
        <div
          className="flex h-[19vh] w-[15vh] rotate-12 flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{ backgroundImage: "url(/discover/avatar3.png)" }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Mark Zuckerberg
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>
        <div className="flex h-[8vh] w-[10vh] flex-col items-center justify-center rounded-[15px] bg-[#202020]">
          <div className="rounded-[10px] bg-[#2F2F2F] p-2">
            <img
              src="/discover/box.png"
              alt="avatar1"
              className="h-5 w-5"
            ></img>
          </div>
          <div className="text-sm">Coding Personality</div>
          <div className="text-xs font-thin">Knowlege pack</div>
        </div>
      </div>
    ),
  },
  {
    buttons: ["Try now"],
    color: "#bd748e",
    title: "Curious about Eren Yeager's opinion on Game of Thrones?",
    subtitle:
      "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext ",
    htmlpic: (
      <div className="flex items-center">
        <div className="-mr-4 flex h-[12vh] w-[15vh] flex-col items-start justify-between rounded-[15px] bg-[#202020] p-4">
          <div className="rounded-[10px] bg-[#2F2F2F] p-2">
            <img
              src="/discover/box.png"
              alt="avatar1"
              className="h-5 w-5"
            ></img>
          </div>
          <div className="text-sm">Darling in the Franxx</div>
          <div className=" flex flex-col items-center justify-center text-xs font-thin">
            Take a look on avaliable add-ons and connect it to your character
          </div>
        </div>
        <div
          className="flex h-[19vh] w-[15vh] flex-col items-center justify-end rounded-[15px] bg-cover bg-center"
          style={{ backgroundImage: "url(/discover/avatar2.png)" }}
        >
          <div className="via-black-60 left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-[15px] bg-gradient-to-b from-transparent to-black p-5">
            <div className="self-stretch font-[Inter] text-xl font-medium leading-normal text-white">
              Zero Two
            </div>
            <div className="flex">
              <div className="text-ml self-stretch font-[Inter] font-thin leading-normal text-white">
                VectorChat
              </div>
              <div className="ml-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
              <div className="font-thin">635.5k</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const InnerCarouselDiscoverCard = () => {
  return (
    <Swiper
      slidesPerView={"auto"}
      centeredSlides={true}
      spaceBetween={10}
      modules={[Pagination]}
      className="mySwiper"
    >
      {discoverCards.map((card, index) => (
        <SwiperSlide key={index}>
          <DiscoverCard
            buttons={card.buttons}
            color={card.color}
            title={card.title}
            subtitle={card.subtitle}
            htmlpic={card.htmlpic}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default InnerCarouselDiscoverCard;
