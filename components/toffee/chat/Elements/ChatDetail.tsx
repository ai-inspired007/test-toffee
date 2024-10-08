import { ChatHistory } from "./ChatHistory";
import { Recommended } from "./Recoments";
import { CharacterCard } from "./CharacterCard";
import { AnimatePresence, motion } from "framer-motion";
import { Character, KnowledgePack, Message } from "@prisma/client";
import { Dispatch } from "react";
import { useMediaQuery } from "react-responsive";
import { CandiesCard } from "./CandiesCard";
type Props = {
  isOpen: boolean;
  character: Character & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  openCandy: boolean;
  setCandyOpen: (openCandy: boolean) => void;
  likeCount: number;
  like: boolean | null | undefined;
  star: boolean | null | undefined;
  setReportModal: Dispatch<React.SetStateAction<boolean>>;
  setShareModal: Dispatch<React.SetStateAction<boolean>>;
};

export function ChatDetail({
  isOpen,
  character,
  openCandy,
  setCandyOpen,
  likeCount,
  like,
  star,
  setReportModal,
  setShareModal,
}: Props) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <motion.div
      animate={{ width: isOpen ? (isMobile ? "100%" : "300px") : "0px" }}
      className={`${isOpen ? "h-screen w-[300px] min-w-[300px] overflow-hidden" : "z-10 w-0 overflow-hidden"} ${isMobile ? "absolute top-0 bg-bg-2 p-0" : "bg-black py-2 pr-2"}`}
    >
      <div
        className={`flex h-full w-full translate-x-0 flex-col gap-2 transition-transform delay-100  ${isOpen ? "" : "right-0 w-[300px] translate-x-full"}`}
      >
        <CharacterCard
          character={{
            id: character.id,
            desc: character.description,
            img: character.image,
            name: character.name,
            messages: character.messages,
          }}
          creator="VectorChat"
          numChats={character._count.messages}
          numLikes={200}
          openCandy={openCandy}
          setCandyOpen={setCandyOpen}
          likeCount={likeCount}
          like={like}
          star={star}
          setReportModal={setReportModal}
          setShareModal={setShareModal}
        />

        <CandiesCard />

        <Recommended
          characters={[
            {
              img: "/test-zero-two.png",
              name: "Zero Two",
              desc: "I'm Zero Two",
              id: "1",
            },
            {
              img: "/test-zero-two.png",
              name: "Zero Two",
              desc: "I'm Zero Two",
              id: "1",
            },
            {
              img: "/test-zero-two.png",
              name: "Zero Two",
              desc: "I'm Zero Two",
              id: "1",
            },
            {
              img: "/test-zero-two.png",
              name: "Zero Two",
              desc: "I'm Zero Two",
              id: "1",
            },
          ]}
        />
      </div>
    </motion.div>
  );
}
