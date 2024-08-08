"use client";  
import { useEffect, useState, useCallback } from "react";  
import Image from "next/image";  
import { useSession } from "next-auth/react";  
import { Search } from "lucide-react";
import ReactPaginate from 'react-paginate';
import axios from "axios";
import { KnowledgePack } from "@prisma/client";

function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number,
): (...args: Parameters<F>) => void {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<F>) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
}

export const CharacterAddons = ({
  name,
  description,
  imageData,
  advanceFunction,
  previousFunction,
  isSubmitLoading,
  connectedCandies,
  setConnectedCandies,
  addons  
}: {
  name: string;
  description: string;
  imageData: string | null;
  advanceFunction: () => void;
  previousFunction: () => void;
  isSubmitLoading: boolean;
  connectedCandies: KnowledgePack[],
    setConnectedCandies: (connectedCandies: KnowledgePack[]) => void;
    addons: KnowledgePack[] 
}) => {  
  const { data: session } = useSession();  
  let user = session?.user;  
  const [searchInput, setSearchInput] = useState("");  
  const [selectedTag, setSelectedTag] = useState("All");

  const [loading, setLoading] = useState(false);

  const [selectedAddons, setSelectedAddons] = useState<{ id: string, name: string, image: string | null, description: string | null }[]>([]);  
  const [connectedPage, setConnectedPage] = useState(0);
  
  // const [filteredtotal, setFilteredTotal] = useState(0);
  const [filteredAddons, setFilteredAddons] = useState<KnowledgePack[]>(addons);
  const [filteredPage, setFilteredPage] = useState(0);

  const [isDebounce, setIsDebounce] = useState(false);
  
  const tags = ["All", "Connected"];  

  // const filteredAddons = addons.filter(pack =>  
  //   (pack.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //     pack.description.toLowerCase().includes(searchInput.toLowerCase())) &&  
  //   // (selectedTags.includes("All") || selectedTags.some(tag => pack.name.includes(tag))) &&  
  //   !selectedAddons.some(selected => selected.id === pack.id)  
  // );

  // const fetchCandies = (page: number, query: string) => {
  //   setLoading(true);
  //   axios.get(`/api/knowledge?page=${page}&itemsPerPage=${5}&query=${query}`)
  //     .then(res => {
  //       setLoading(false);
  //       setFilteredAddons(res.data.knowledgePacks)
  //       setFilteredTotal(res.data.total)
  //     })
  //     .catch(err => {
  
  //     });
  //   }

  // // Using useCallback to ensure stability across renders
  // const debouncedFetchCharacters = useCallback(
  //   debounce((query) => {
  //     fetchCandies(filteredPage, query);
  //   }, 1000),
  //   [],
  // );

  useEffect(() => {
    if (selectedTag === "All") {
      // if (isDebounce) {
      //   debouncedFetchCharacters(searchInput);
      // }
      // else {
      //   fetchCandies(filteredPage, searchInput);
      // }
      setFilteredAddons(addons.filter(item => item.name?.toLowerCase().includes(searchInput.toLowerCase())))
    } else {
      setSelectedAddons(connectedCandies.filter(item => item.name?.toLowerCase().includes(searchInput.toLowerCase())))
    }
  }, [searchInput, selectedTag, filteredPage, connectedPage]);

  const handleConnectAddon = (addon: KnowledgePack) => {  
    setSelectedAddons([...selectedAddons, addon]);
    setConnectedCandies([...connectedCandies, addon]);
  };  

  const handleRemoveAddon = (addonId: string) => {  
    setSelectedAddons(selectedAddons.filter(item => item.id !== addonId));
    setConnectedCandies(connectedCandies.filter(item => item.id !== addonId));
  };  

  return (  
    <div className="flex flex-row mt-[100px] w-full max-w-[1024px]">  
      <div className="flex flex-col items-start">  
        <h1 className="text-white font-inter font-bold text-[32px]">  
          Candies  
        </h1>  
        <p className="text-text-tertiary font-inter text-sm">  
          Take a look on available add-ones and connect it to your character  
        </p>  
        <div className="flex flex-col w-[560px] mt-8 gap-7">  
          <div className="w-full relative">  
            <Search className="text-[#777777] w-6 absolute h-full ml-2" />  
            <input  
              type="text"  
              className="w-full text-[13px] text-text-sub bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg pr-4 pl-10 py-2 placeholder:text-text-tertiary"  
              value={searchInput}  
              onChange={(e) => { setSearchInput(e.target.value); setFilteredPage(0); setConnectedPage(0); setIsDebounce(true); }}  
              placeholder="Search for add-ons"  
            />  
          </div>
          <div className="flex flex-row flex-wrap gap-1">  
            {tags.map((tag) => (  
              <span  
                key={tag}  
                className={`rounded-lg ${selectedTag === tag ? "bg-white text-black":"bg-bg-2 text-text-additional" }  px-3 py-[7px] border border-white/10 text-sm cursor-pointer`}  
                onClick={() => { setSelectedTag(tag); setFilteredPage(0); setConnectedPage(0); }}  
              >  
                {tag}  
              </span>  
            ))}  
          </div>
          <div className="flex flex-col gap-2 w-full">
          {
              selectedTag === "All" ? (
                <>
                  {
                    <div className="flex flex-col gap-2 mb-4 relative">
                      {loading &&
                        <div className="absolute w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                          <Image
                            src={"/loading.svg"}
                            alt="loading_svg"
                            width={50}
                            height={50}
                          />
                        </div>
                      }
                      {
                        filteredAddons.slice(filteredPage * 5, filteredAddons.length - filteredPage * 5 > 4 ? (filteredPage + 1) * 5 : filteredAddons.length).map((pack) => (
                          <div key={pack.id} className="w-full h-40 relative">
                            <div className="absolute flex flex-col z-10 p-5 h-full">
                              <span className="font-inter font-medium text-white">{pack.name}</span>
                              <div className="flex flex-row text-text-additional gap-1 items-center">
                                <span>Ayush</span>
                                <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 1.5C1.72386 1.5 1.5 1.72386 1.5 2C1.5 2.27614 1.72386 2.5 2 2.5C2.27614 2.5 2.5 2.27614 2.5 2C2.5 1.72386 2.27614 1.5 2 1.5ZM0.5 2C0.5 1.17158 1.17158 0.5 2 0.5C2.82842 0.5 3.5 1.17158 3.5 2C3.5 2.65311 3.08259 3.20873 2.5 3.41465V3.5C2.5 4.0523 2.94771 4.5 3.5 4.5H6.5C7.0523 4.5 7.5 4.0523 7.5 3.5V3.41465C6.9174 3.20873 6.5 2.65311 6.5 2C6.5 1.17158 7.17155 0.5 8 0.5C8.82845 0.5 9.5 1.17158 9.5 2C9.5 2.65311 9.0826 3.20873 8.5 3.41465V3.5C8.5 4.60455 7.60455 5.5 6.5 5.5H5.5V6.58535C6.0826 6.79125 6.5 7.3469 6.5 8C6.5 8.82845 5.82845 9.5 5 9.5C4.17155 9.5 3.5 8.82845 3.5 8C3.5 7.3469 3.91741 6.79125 4.5 6.58535V5.5H3.5C2.39543 5.5 1.5 4.60455 1.5 3.5V3.41465C0.917405 3.20873 0.5 2.65311 0.5 2ZM8 1.5C7.72385 1.5 7.5 1.72386 7.5 2C7.5 2.27614 7.72385 2.5 8 2.5C8.27615 2.5 8.5 2.27614 8.5 2C8.5 1.72386 8.27615 1.5 8 1.5ZM5 7.5C4.72385 7.5 4.5 7.72385 4.5 8C4.5 8.27615 4.72385 8.5 5 8.5C5.27615 8.5 5.5 8.27615 5.5 8C5.5 7.72385 5.27615 7.5 5 7.5Z" fill="#B1B1B1" />
                                </svg>
                                <span>635.5k</span>
                              </div>
                              <p className="text-xs text-text-tertiary font-inter">{pack.description}</p> {/* Update description usage here */}
                              {
                                !selectedAddons.map(item => item.id).includes(pack.id) ? (
                                  <button
                                    className="rounded-full py-1.5 px-4 bg-white text-black font-inter text-sm font-medium w-fit mt-auto"
                                    onClick={() => handleConnectAddon(pack)}
                                  >
                                    <span className="px-1 py-[3px]">Connect</span>
                                  </button>
                                ) : (
                                  <button
                                    className="rounded-full py-1.5 px-4 bg-[#2F2F2F] text-text-sub font-inter text-sm font-medium w-fit mt-auto"
                                    onClick={() => handleRemoveAddon(pack.id)}
                                  >
                                    <span className="px-1 py-[3px]">Remove</span>
                                  </button>
                                )
                              }
                            </div>
                            <div className="relative h-full w-full">
                              <div className="absolute z-[1] h-full w-full rounded-2xl bg-gradient-to-l from-transparent to-[#202020F2] via-[#202020a4]" />
                              <Image
                                className="rounded-2xl object-cover w-full h-full"
                                src={pack.image ? pack.image : "/default.jpg"}
                                alt="Pack Image"
                                width={0}
                                height={0}
                                sizes="100vw"
                              />
                            </div>
                          </div>
            
                        ))
                      }
                      
                    </div>
                  }
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={(e) => { setFilteredPage(e.selected); setIsDebounce(false); }}
                    pageCount={Math.ceil(filteredAddons.length / 5)}
                    initialPage={0}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    className="text-white flex gap-4 justify-center"
                    activeClassName="border px-2"
                  />
                  </>
          ) : (
            selectedAddons.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {selectedAddons.slice(connectedPage * 5, selectedAddons.length - connectedPage * 5 > 4 ? (connectedPage + 1) * 5 : selectedAddons.length).map((addon) => (
                  <div key={addon.id} className="w-full h-40 relative">
                    <div className="absolute flex flex-col z-10 p-5 h-full">
                      <span className="font-inter font-medium text-white">{addon.name}</span>
                      <div className="flex flex-row text-text-additional gap-1 items-center">
                        <span>Ayush</span>
                        <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                        <span>635.5k</span>
                      </div>
                      <p className="text-xs text-text-tertiary font-inter">{addon.description}</p>
                      <button
                        className="rounded-full py-1.5 px-4 bg-[#2F2F2F] text-text-sub font-inter text-sm font-medium w-fit mt-auto"
                        onClick={() => handleRemoveAddon(addon.id)}
                      >
                        <span className="px-1 py-[3px]">Remove</span>
                      </button>
                    </div>
                    <div className="relative h-full w-full">
                      <div className="absolute z-[1] h-full w-full rounded-2xl bg-gradient-to-l from-transparent to-[#202020F2] via-[#202020a4]" />
                      <Image
                        className="rounded-2xl object-cover w-full h-full"
                        src={addon.image ? addon.image : "/default.jpg"}
                        alt="Addon Image"
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                  </div>
                ))}
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={(e) => setConnectedPage(e.selected)}
                  pageCount={Math.ceil(selectedAddons.length / 5)}
                  initialPage={0}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                  className="text-white flex gap-4 justify-center"
                  activeClassName="border px-2 "
                />
              </div>
            )
          )
        }
          </div>
          
          <div className="flex flex-row gap-4 mt-8">  
            <div className="w-[220px] bg-bg-3 rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={previousFunction}>  
              {"Previous step"}  
            </div>  
            <div className="w-[220px] bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={advanceFunction}>  
              {"Continue"}  
            </div>  
          </div>  
        </div>  
      </div>  
      <div className="flex flex-col items-center ml-auto">  
        <div className="px-6 w-full">  
          <div className="text-white font-inter text-xs bg-bg-3 w-full text-center py-2 rounded-t-2xl">Bot preview</div>  
        </div>  
        <div className="relative">  
          <div className="absolute bottom-4 z-10 max-w-72 overflow-hidden text-ellipsis pl-4 text-white">  
            <h1 className="mb-1 text-lg tracking-tight text-white font-medium">  
              {name || "Enter character name..."}  
            </h1>  
            <p className="mb-2 max-w-32 overflow-hidden text-ellipsis text-text-additional">  
              {user?.name || user?.id}  
            </p>  
            <p className="mt-2 w-full max-w-full text-wrap text-sm text-[#B9B9B9]">  
              {description.slice(0, Math.min(description.length, 80)) +  
                (description.length > 80 ? "…" : "") ||  
                "Enter character description..."}  
            </p>  
          </div>  
          <div className="relative h-full w-fit">  
            <div className="absolute z-[1] h-full w-full rounded-b-2xl bg-gradient-to-b from-transparent from-10% to-black to-100% lg:from-40%" />  
            <Image  
              className="rounded-2xl object-cover w-[312px] h-[360px]"  
              src={imageData || "/default.png"}  
              alt="Character Image"  
              width={312}  
              height={360}  
            />  
          </div>  
        </div>  
      </div>  
    </div >  
  )  
}