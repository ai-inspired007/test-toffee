"use client";
import { useState } from 'react';
import { Character, KnowledgeFile, KnowledgeText, KnowledgeLink } from "@prisma/client";
import Image from "next/image";
import { VerifiedFill } from "../icons/Badge";
import { Plus, Edit3Icon } from 'lucide-react';
import { GitForkOutline } from "../icons/Fork";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import Characters from './Elements/CharacterTable';
import Files from './Elements/FilesPanel';
import clsx from 'clsx';
import EditCandy from './Elements/EditCandy'

const DiscoverPage = ({ data }: {
  data: {
    name: string | undefined;
    type: string | undefined;
    isPersonal: boolean;
    knowledgeId: string;
    conns: number | undefined;
    image: string | null | undefined;
    characters: Partial<Character>[] | undefined;
    files: Partial<KnowledgeFile>[] | undefined;
    texts: Partial<KnowledgeText>[] | undefined;
    links: Partial<KnowledgeLink>[] | undefined;
  }
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [files, setFiles] = useState(data.files);
  const [texts, setTexts] = useState(data.texts);
  const [links, setLinks] = useState(data.links);
  const categories = {
    Characters: <Characters characters={data.characters} />,
    Files: <Files files={files} setFiles={setFiles} texts={texts} setTexts={setTexts} links={links} setLinks={setLinks} />
  }
  const [isEdit, setIsEdit] = useState(false);

  const selectedButton = () => {
    if (data.isPersonal) {
      return (
        <div className="flex flex-row items-center py-1.5 px-4 gap-2 text-text-sub bg-bg-3 rounded-full w-24 h-9 justify-center cursor-pointer" onClick={() => setIsEdit(true)}>
          <Edit3Icon className="h-4 w-4" />
          <button className="text-sm py-1 font-medium">Edit</button>
        </div>
      )
    } else {
      return (
        <div className="flex flex-row items-center py-1.5 px-4 gap-1 text-white bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full w-24 h-9 justify-center">
          <Plus className="h-6 w-6" />
          <button className="text-sm py-1 medium">Add</button>
        </div>
      )
    }
  }

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      {isEdit ?
        <EditCandy knowledgeId={data.knowledgeId} setIsEdit={setIsEdit} image={data.image} files={data.files} texts={data.texts} links={data.links} />
        :
        <div className="flex flex-col rounded-lg bg-bg-2 w-full min-h-full pb-10">
          <div className={`h-[200px] w-full relative`}>
            <div className="z-10 bg-gradient-to-b from-[#12121280] to-[#121212] h-[200px] w-full absolute flex flex-row justify-start items-end px-6 rounded-t-lg">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-white text-2xl font-medium">{data.name}</p>
                  <VerifiedFill className="h-5 w-5" />
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="text-sm  text-text-additional">{Number(data.conns).toLocaleString('en')} Connections</span>
                  <div className="h-1.5 w-1.5 bg-[#474747] rounded-full mx-0.5" />
                  <span className="text-sm  text-[#777777]">Take a look on available add-ones and connect it to your character</span>
                </div>
              </div>
              <div className="flex flex-row items-center ml-auto gap-2">
                <div className="flex flex-row items-center py-1.5 px-4 gap-2 text-text-sub bg-bg-3 rounded-full w-24 h-9 justify-center"><GitForkOutline className="h-4 w-4" /><span className="text-sm py-1 font-medium">Fork</span>
                </div>
                {selectedButton()}
              </div>
            </div>
            <Image src={data.image ? data.image : ""} className="h-[200px] w-full object-cover rounded-t-lg" alt="Pack Background" height={0} width={0} sizes="100vw" />
          </div>
          <div className='px-6'>
            <div className="w-full h-[1px] bg-white/10 mt-8" />
          </div>
          <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex} className="flex flex-col gap-8 w-full px-6 mt-8 flex-grow">
            <TabList className="flex bg-black rounded-full p-0.5 w-60 h-10">
              {Object.keys(categories).map((category) => (
                <Tab key={category} className={({ selected }) => clsx(' w-full text-center', selected ? 'text-white rounded-full bg-bg-2 border-none outline-none' : 'text-text-tertiary')}>
                  {category}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="w-full overflow-y-auto flex-grow flex flex-col">
              {Object.values(categories).map((content, idx) => (
                <TabPanel key={idx} className={"flex-grow flex flex-col"}>
                  {content}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      }
    </div>
  )
}

export default DiscoverPage;