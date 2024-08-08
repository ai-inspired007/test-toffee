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
};

export function ChatDetail({ isOpen, character }: Props) {
  // console.log(character)
  return (
    <motion.div
      animate={{ width: isOpen ? "300px" : "0px" }}
      className={isOpen? "w-[300px] overflow-hidden py-2 pr-2": "w-0 overflow-hidden py-2"}
    >
      <div
        className={`flex h-full w-full translate-x-0 flex-col gap-2 bg-black transition-transform delay-100  ${isOpen ? "flex " : "right-0 w-[300px] translate-x-full"}`}
      >
        <CharacterCard
          character={{
            desc: character.description,
            img: character.image,
            name: character.name,
          }}
          creator="VectorChat"
          numChats={character._count.messages}
          numLikes={200}
        />

        <ChatHistory
          messages={character.messages}
        />

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
