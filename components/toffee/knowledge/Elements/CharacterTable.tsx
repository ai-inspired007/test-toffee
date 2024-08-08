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
const Characters = ({ characters }: { characters: Partial<Character>[] | undefined }) => {
  return (
    <Table className="overflow-y-auto mr-5">
      <TableHead >
        <TableRow>
          <TableHeaderCell className="text-start text-xs text-[#777777] font-normal">#</TableHeaderCell>
          <TableHeaderCell className="text-start text-xs text-[#777777] font-normal">Name</TableHeaderCell>
          <TableHeaderCell className="text-start text-xs text-[#777777] font-normal">Description</TableHeaderCell>
          <TableHeaderCell className="text-start text-xs text-[#777777] font-normal">Chats</TableHeaderCell>
        </TableRow>
      </TableHead>
      <div className = "mb-3"></div>
      <TableBody>
        {characters?.map((character, index) => (
          <TableRow key={index} className = "hover:bg-[#202020] cursor-pointer">
            <TableCell>
              <span className="text-sm  text-text-sub">{index + 1}</span>
            </TableCell>
            <TableCell className = "p-2.5">
              <div className="flex flex-row gap-4 items-center">
                <Image src={character.image ? character.image : "/default.jpg"} alt={character.name ? character.name : "Character"} width={0} height={0} sizes="100vw" className="h-10 w-10 object-cover rounded-full" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-normal text-[14px] text-white ">{character.name}</span>
                  <span className=" text-xs text-text-tertiary font-light">{character.userId}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className=" text-xs text-text-additional font-light">{character.description}</span>
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