import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from "lucide-react";
import { MdiInformationOutline } from '../../../icons/InformationLine';
import { CloseFill } from '../../../icons/CloseFill';
import Image from "next/image";
import { EllipseIcon } from '@/components/toffee/icons/EllipseIcon';

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface Conversation {
  title: string;
  content: QuestionAnswer[];
}

interface ImportConversationProps {
  conversations: Conversation[];
  importedConversations: Conversation[];
  onClose: () => void;
  onImportConversation: (conversation: Conversation) => void;
  onRemoveConversation: (conversationTitle: string) => void;
}

type ItemType = {
  id: string;
  name: string;
};

const arr: ItemType[] = [
  { id: "1", name: "JJK" },
  { id: "2", name: "ReZero" },
  { id: "3", name: "AOT" },
  { id: "4", name: "STF" },
  { id: "5", name: "Death Note" },
];

const ImportConversation: React.FC<ImportConversationProps> = ({
  conversations,
  importedConversations,
  onClose,
  onImportConversation,
  onRemoveConversation
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const filtered = conversations.filter(conversation =>
      conversation.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      conversation.content.some(qa =>
        qa.question.toLowerCase().includes(searchInput.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
    setFilteredConversations(filtered);
  }, [conversations, searchInput]);

  const isImported = (conversation: Conversation) => {
    return importedConversations.some(
      imported => imported.title === conversation.title
    );
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  return (
    <div className="rounded-lg relative py-4 px-6 w-full sm:w-[480px] bg-bg-2 h-full">
      <div className='absolute top-0 left-0 w-full h-1/4 z-0' />
      <div className="flex justify-between items-center z-10 relative">
        <div className='flex items-center gap-2'>
          <div className="text-white text-main font-inter text-[16px] font-medium leading-5 custom-font-settings">Import Conversations</div>
          <MdiInformationOutline className='text-[#787878]' />
        </div>
        <button className="text-[#787878] hover:text-gray-900 transition-colors duration-200" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}>
          <CloseFill className="w-6 h-6" />
        </button>
      </div>
      <div className="flex w-full h-[730px] flex-col items-center z-10 relative">
        <div className="flex flex-col w-full mt-4 h-full overflow-hidden">
          {/* Search Box */}
          <div className="flex items-center justify-between">
            <div className="relative w-full">
              <Search className="absolute ml-2 h-full w-6 text-[#777777]" />
              <input
                type="text"
                className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent py-2 pl-10 pr-4 text-[13px] text-text-sub outline-none placeholder:text-text-tertiary"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                placeholder="Search for conversation"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-row flex-wrap gap-1.5 mt-6">
            {arr.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`cursor-pointer rounded-lg border border-white/10 px-3 py-[5px]  text-sm font-medium ${isSelected ? "bg-white text-black" : "text-[#b1b1b1]"}`}
                  onClick={() => toggleSelectItem(item.id)}
                >
                  {item.name}
                </div>
              );
            })}
          </div>

          {/* Conversations List */}
          <div className="flex w-full flex-wrap mt-4 gap-2 overflow-y-auto no-scrollbar h-full ">
            {filteredConversations.map((conversation, index) => (
              <div key={index} className="relative w-full bg-bg-3 rounded-2xl">
                <div className="flex h-full w-full flex-row px-4 py-3">
                  <div className="flex w-full flex-col justify-between gap-1">
                    <span className="text-sm font-inter font-medium text-text-main leading-[18px] ">
                      {conversation.title}
                    </span>
                    <p className='text-[13px] font-inter font-normal leading-5 text-text-tertiary'>{conversation.content[0].question}</p>
                    <p className='text-[13px] font-inter font-normal leading-5 text-text-tertiary'>{conversation.content[0].answer}</p>
                    <div className='flex flex-row items-center justify-between'>
                      <div className='flex flex-row justify-center items-center gap-[12px] text-sm text-text-additional font-inter font-normal leading-[22px]'>
                        <span >VectorChat</span>
                        <EllipseIcon className="w-[5px] h-[5px] fill-[#B1B1B1] text-text-tertiary" />
                        <span>6.4k used</span>
                      </div>
                      <button
                        className={`mt-auto w-fit rounded-[20px] px-4 py-[6px] font-inter lead-[18px] text-sm font-medium text-text-main ${isImported(conversation)
                          ? "bg-[#2F2F2F]"
                          : "bg-toffee-text-accent"
                          }`}
                        onClick={() => isImported(conversation) ? onRemoveConversation(conversation.title) : onImportConversation(conversation)}
                      >
                        {isImported(conversation) ? 'Imported' : 'Import'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportConversation;