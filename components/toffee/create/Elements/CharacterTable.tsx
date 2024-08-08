import { Character } from "@prisma/client";
import Image from "next/image";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";
const Characters = ({ characters }: { characters: Partial<Character>[] }) => {
  return (
    <Table className="overflow-y-auto ">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="text-start  text-xs text-[#777777] font-normal">#</TableHeaderCell>
          <TableHeaderCell className="text-start  text-xs text-[#777777] font-normal">Name</TableHeaderCell>
          <TableHeaderCell className="text-start  text-xs text-[#777777] font-normal">Description</TableHeaderCell>
          <TableHeaderCell className="text-start  text-xs text-[#777777] font-normal">Chats</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {characters.map((character, index) => (
          <TableRow key={index}>
            <TableCell>
              <span className="text-sm  text-text-sub">{index + 1}</span>
            </TableCell>
            <TableCell>
              <div className="flex flex-row gap-4 items-center">
                <Image src={character.image ? character.image : "/default.jpg"} alt={character.name ? character.name : "Character"} width={0} height={0} sizes="100vw" className="h-10 w-10 object-cover rounded-full" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[14px] text-white ">{character.name}</span>
                  <span className=" text-xs text-text-tertiary">{character.userId}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className=" text-xs text-text-additional">{character.description}</span>
            </TableCell>
            <TableCell>
              <span className=" text-xs text-text-additional">{"635.5k"}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
export default Characters