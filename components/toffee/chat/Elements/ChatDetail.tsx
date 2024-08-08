import { ChatHistory } from "./ChatHistory";
import { Recommended } from "./Recoments";
import { CharacterCard } from "./CharacterCard";
import { AnimatePresence, motion } from "framer-motion";
import { Character, Message } from "@prisma/client";
type Props = {
  isOpen: boolean;
  character: Character & {
    messages: Message[]
    _count: {
      messages: number
    }
  };
  openCandy: boolean;
  setCandyOpen: (openCandy: boolean) => void;
};

export function ChatDetail({ isOpen, character, openCandy, setCandyOpen }: Props) {
  const isMobileScreen = () => window.innerWidth <= 768;  
  return (
    <motion.div
      animate={{ width: isOpen ? isMobileScreen()?"100%":"300px" : "0px" }}
      className={`${isOpen? "w-[300px] min-w-[300px] overflow-hidden h-screen": "w-0 overflow-hidden z-10"} ${isMobileScreen()?"absolute top-0 p-0 bg-bg-2":"py-2 pr-2 bg-black"}` }
    >
      <div
        className={`flex h-full w-full translate-x-0 flex-col gap-2 transition-transform delay-100  ${isOpen ? "" : "right-0 w-[300px] translate-x-full"}`}
      >
        <CharacterCard
          character={{
            desc: character.description,
            img: character.image,
            name: character.name,
            messages: character.messages
          }}
          creator="VectorChat"
          numChats={character._count.messages}
          numLikes={200}
          openCandy={openCandy}
          setCandyOpen={setCandyOpen}
        />

        {!isMobileScreen() && <ChatHistory messages={character.messages}/>}

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
