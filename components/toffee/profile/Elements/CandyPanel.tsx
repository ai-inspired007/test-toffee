import { KnowledgePack } from "@prisma/client";
import { Empty } from "../../icons/Empty";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CandyCard from "../../CandyCard";
// const CandyCard = ({candy}: {candy: Partial<KnowledgePack>;}) => {
//   return(
//     <div
//       className="relative flex h-32 w-80 min-w-80 items-center justify-center rounded-2xl bg-center cursor-pointer ">
//       <Image
//         src={candy.image || "/default.png"}
//         alt="candy_image"
//         width={0}
//         height={0}
//         sizes="100vw"
//         className="absolute h-full w-full rounded-2xl object-cover"
//       />
//       <div className="left-0 top-0 z-20 flex h-full w-full flex-col justify-end rounded-2xl bg-gradient-to-b from-transparent via-black/60 to-black">
//         <div className="flex h-full flex-col justify-end space-y-1 px-4 pb-2">
//           <div className="self-stretch  font-medium text-white">
//             {candy.name}
//           </div>
//           <div className="inline-flex items-center justify-start gap-2 ">
//             <div className=" text-xs font-normal leading-none text-zinc-400">
//               VectorChat
//             </div>
//             <div className="h-1 w-1 rounded-full bg-zinc-400"></div>
//             <div className="flex items-center justify-start gap-1">
//               <div className="flex h-4 w-4 items-center justify-center px-0.5 py-0.5">
//                 <svg
//                   width="32"
//                   height="32"
//                   viewBox="0 0 16 16"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z"
//                     fill="#B1B1B1"
//                   />
//                 </svg>
//               </div>
//               <div className=" text-xs font-normal leading-none text-zinc-400">
//                 {/* {candy. !== undefined && formatNumber(character._count.messages)} */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
const CandyPanel = ({ candies, type }: { candies: Partial<KnowledgePack>[], type: string }) => {
  const router = useRouter();
  const candy_exs= [
    {
      name: "Haikyu",
      item: "VectorChat",
      links: "635500",
      details: "I'm Zero Two from Darling",
      image: "/candies/candy1.png"
    },
    {
      name: "Haikyu",
      item: "VectorChat",
      links: "635500",
      details: "I'm Zero Two from Darling",
      image: "/candies/candy1.png"
    }
  ]
  return (
    <div className={`flex gap-4 flex-wrap flex-grow min-h-full ${candies.length ? "justify-start" : "justify-center"}`}>
      {candies.length > 0 ? (
        candies.map((candy, index)=>(
          <CandyCard candy={candy} key={index}/>
        ))
      ) : (
        <div className="flex items-center w-full min-h-full justify-center">
          <div className="flex flex-col gap-2 items-center">
            <Empty />
            <span className="text-base  text-text-sub font-medium text-center mt-2">There is no knowledge</span>
            <span className="text-sm text-text-tertiary  text-center">{type==="admin"?"Looks like you still don't have any personal knowledge":"Looks like this auther don't have any knowledges yet"}</span>
            {type==="admin" && <div className="flex flex-row items-center py-1.5 px-4 gap-1 text-white bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full h-9 justify-center cursor-pointer" onClick={()=>router.push("/create/candy")}><span className="text-sm py-1 medium">Add new knowledge</span></div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default CandyPanel;