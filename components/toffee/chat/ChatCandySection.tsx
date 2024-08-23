import { useState } from "react";
import Image from "next/image";
import { SearchLineIcon } from "../icons/SearchLineIcon";
import { GitForkOutline } from "../icons/Fork";
const ChatCandySection = () => {
  type ItemType = {
    id: number;
    name: string;
  };
  const arr: ItemType[] = [
    { id: 1, name: "Haikyu" },
    { id: 2, name: "One Punch Man" },
    { id: 3, name: "Naruto" },
    { id: 4, name: "JJK" },
    { id: 5, name: "ReZero" },
    { id: 6, name: "AOT" },
    { id: 7, name: "JJK" }
  ];
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const toggleSelectItem = (id: number) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };
  const handleSelectAll = () => {
    if (selectedItemIds.length === arr.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(arr.map(item => item.id));
    }
  };
  const cards = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    title: "One Punch Man",
    subtitle: "VectorChat",
    description: "Capable of defeating any enemy",
    image: "/candies/candy1.png",
    count: "635.5k"
  }));
  const isAllSelected = selectedItemIds.length === arr.length;
  return (
    <div className="h-screen flex-grow p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col rounded-lg bg-bg-2 w-full min-h-full">
        <label className="sticky top-0 z-50 w-full rounded-t-lg bg-opacity-60 py-5 text-gray-400 backdrop-blur-lg backdrop-filter focus-within:text-gray-600 flex items-center border-0 border-b-2 border-white/10 ">
          <SearchLineIcon className="h-6 w-6 pointer-events-none absolute left-6 text-[#B1B1B1]" />
          <input className="relative h-9 bg-transparent text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 block w-full appearance-none rounded-none pl-14 text-white z-10" placeholder="What are you looking for?" />
        </label>
        <div className="flex flex-col gap-3 w-full p-6">
          <span className="pr-4 pl-2 text-text-additional text-xs ">Connected candies</span>
          {/* Connected candies example list */}
          <div className="flex flex-row flex-wrap gap-4">
            <div className="flex flex-col relative rounded-2xl overflow-hidden w-[389px] h-40">
              <div className="absolute w-full h-full bg-gradient-to-r gap-1 from-[#202020] via-[#121212A6] to-[#12121200] p-5 flex flex-col" >
                <span className="text-white font-medium ">One Punch Man</span>
                <div className="text-text-additional flex flex-row gap-2 mb-1 items-center text-xs">
                  <span className = "text-xs">VectorChat</span>
                  <div className="w-1 h-1 bg-[#b1b1b1] rounded-full" />
                  <GitForkOutline />
                  <span className = "text-xs">635.5k</span>
                </div>
                <span className="text-xs text-text-tertiary ">Capable of defeating any enemy</span>
                <div className="bg-[#2F2F2F] px-4 py-1.5 text-[#DDDDDD]  rounded-full w-fit mt-auto">
                  <span className="py-[3px] px-1 text-sm">Remove</span>
                </div>
              </div>
              <Image src={"/candies/candy1.png"} alt="" className="w-full h-full object-cover" width={0} height={0} sizes="100vw" />
            </div>
            <div className="flex flex-col relative rounded-2xl overflow-hidden w-[389px] h-40">
              <div className="absolute w-full h-full bg-gradient-to-r gap-1 from-[#202020] via-[#121212A6] to-[#12121200] p-5 flex flex-col" >
                <span className="text-white font-medium ">One Punch Man</span>
                <div className="text-text-additional flex flex-row gap-2 mb-1 items-center text-xs">
                  <span className = "text-xs">VectorChat</span>
                  <div className="w-1 h-1 bg-[#b1b1b1] rounded-full" />
                  <GitForkOutline />
                  <span className = "text-xs">635.5k</span>
                </div>
                <span className="text-xs text-text-tertiary ">Capable of defeating any enemy</span>
                <div className="bg-[#2F2F2F] px-4 py-1.5 text-[#DDDDDD]  rounded-full w-fit mt-auto">
                  <span className="py-[3px] px-1 text-sm">Remove</span>
                </div>
              </div>
              <Image src={"/candies/candy1.png"} alt="" className="w-full h-full object-cover" width={0} height={0} sizes="100vw" />
            </div>
          </div>

          {/* Tab line example */}
          <div className="flex flex-row flex-wrap gap-1.5 mt-6 mb-2">
            <div
              className={`px-3 py-[5px] text-sm  font-medium cursor-pointer rounded-lg border border-white/10 ${isAllSelected ? 'bg-white text-black' : 'text-[#b1b1b1]'}`}
              onClick={handleSelectAll}
            >
              All
            </div>
            {arr.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`px-3 py-[5px] text-sm  font-medium cursor-pointer rounded-lg border border-white/10 ${isSelected ? 'bg-white text-black' : 'text-[#b1b1b1]'}`}
                  onClick={() => toggleSelectItem(item.id)}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
          {/* Avaliable list example */}
          <div className="w-full overflow-hidden">
            <div className="flex flex-row flex-wrap gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col relative rounded-2xl overflow-hidden w-[389px] h-40"
                >
                  <div className="absolute w-full h-full bg-gradient-to-r from-[#202020] via-[#121212A6] to-[#12121200] p-5 flex flex-col">
                    <span className="text-white font-medium ">{card.title}</span>
                    <div className="text-text-additional flex flex-row gap-2 mb-1 items-center text-xs">
                      <span>{card.subtitle}</span>
                      <div className="w-1 h-1 bg-[#b1b1b1] rounded-full" />
                      <GitForkOutline />
                      <span>{card.count}</span>
                    </div>
                    <span className="text-xs text-text-tertiary ">{card.description}</span>
                    <div className="bg-white px-4 py-1 text-black  rounded-full w-fit mt-auto">
                      <span className="py-[3px] px-1 text-sm">Connect</span>
                    </div>
                  </div>
                  <Image
                    src={card.image}
                    alt="Card Image"
                    className="w-full h-full object-cover"
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ChatCandySection;