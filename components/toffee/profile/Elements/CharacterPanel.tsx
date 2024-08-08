import { Character } from "@prisma/client";
import CharacterCard from "../../CharacterCard";
import { Empty } from "../../icons/Empty";
import { useRouter } from "next/navigation";
const Characters = ({ characters, type }: { characters: Partial<Character & { _count: { messages: number } }>[], type: string }) => {
  const router = useRouter();
  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center min-h-full w-full">
      {characters.length > 0 ?
        characters.map((character, index) => <CharacterCard key={index} character={character} link={`/character/${character.id}`} />) :
        (
          <div className="flex items-center w-full min-h-full justify-center">
            <div className="flex flex-col gap-2 items-center">
              <Empty />
              <span className="text-base  text-text-sub font-medium text-center mt-2">There is no characters</span>
              <span className="text-sm text-text-tertiary text-center">{type === "admin" ? "Looks like you still don't have any personal character" : "Looks like this auther don't have any characters yet"}</span>
              {type === "admin" && <div className="flex flex-row items-center py-1.5 px-4 gap-1 text-white bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full h-9 justify-center cursor-pointer" onClick={() => router.push("/create/character")}><span className="text-sm py-1 medium">Add new character</span></div>}
            </div>
          </div>
        )}
    </div>
  )
}
export default Characters;