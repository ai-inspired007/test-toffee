import React, { Dispatch, SetStateAction, useEffect, useState, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { RiCloseCircleLine } from 'react-icons/ri';
import { Category, Tag } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

type Option = {
  id: string;
  name: string;
  tags: Tag[];
};

interface LoadingState {
  category: boolean;
  tag: boolean;
}

type SelectProps = {
  options: Option[];
  setSelectedOption: Dispatch<SetStateAction<string | undefined>>;
  categoryId: string | undefined;
  selectedTags: Set<string>;
  setSelectedTags: (selectedTags: Set<string>) => void;
};

const SelectCategories: React.FC<SelectProps> = ({
  options,
  setSelectedOption,
  categoryId,
  selectedTags,
  setSelectedTags
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    category: false,
    tag: false,
  });

  useEffect(() => {
    if (categoryId) {
      const newSelected = options.find(option => option.id === categoryId);
      setSelected(newSelected);
    }
  }, [categoryId, options]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: Option) => {
    setSelectedOption(option.id);
    setSelected(option);
    setIsOpen(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const removeTag = (tagId: string) => {
    const newTags = new Set<string>(selectedTags);
    newTags.delete(tagId);
    setSelectedTags(newTags);
  };

  const cancelAddTag = () => {
    setShowTagInput(false);
    setNewTag("");
  };

  const handleTagClick = useCallback(
    (tagId: string) => {
      const updatedTags = new Set(selectedTags);
      if (updatedTags.has(tagId)) {
        updatedTags.delete(tagId);
      } else {
        updatedTags.add(tagId);
      }
      setSelectedTags(updatedTags);
    },
    [selectedTags, setSelectedTags],
  );

  const handleAddTag = async () => {
    if (newTag && categoryId) {
      setLoadingState((prev) => ({ ...prev, tag: true }));
      const newTagWithId = {
        id: uuidv4(),
        name: newTag
      };
      const newTags = new Set<string>(selectedTags);
      newTags.add(newTagWithId.id);
      setSelectedTags(newTags);
      console.log(selectedTags)
      setShowTagInput(false);
      setNewTag("");
      setLoadingState((prev) => ({ ...prev, tag: false }));
    }
  };
  console.log(selected?.tags)
  console.log(selectedTags)
  return (
    <div>
      <div className="flex flex-col w-full gap-1 cursor-pointer" ref={dropdownRef}>
        <span className="text-xs font-semibold text-text-tertiary">Category</span>
        <div className="relative w-full">
          <div
            onClick={toggleDropdown}
            className="w-full flex items-center text-text-sub bg-transparent border border-white/10 outline-none rounded-lg px-4 py-3 gap-2"
          >
            <span className="text-[13px]">{selected?.name}</span>
            <span className="ml-auto">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
          </div>

          {isOpen && (
            <div className="relative w-full z-10 bg-[#242424] rounded-lg mt-2">
              {options.map((option, index) => (
                <div
                  key={option.id}
                  onClick={() => selectOption(option)}
                  className={`flex flex-row items-center text-text-sub px-4 py-1.5 cursor-pointer gap-2 hover:bg-[#3a3a3a] ${selected?.id === option.id ? 'bg-[#3a3a3a]' : ''
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                >
                  <span className="text-[13px]">{option.name}</span>
                  {selected?.id === option.id && <Check className="ml-auto w-5 h-5" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedTags.size > 0 && <div className="flex w-full flex-col gap-3 mt-6">
        <span className="text-xs font-semibold text-text-tertiary">{"Tags"}</span>
        <div className="flex flex-row flex-wrap items-center gap-1.5 text-text-sub">
          {selected?.tags.map((tag) => (
            selectedTags.has(tag.id) ? (
              <>
                <div
                  key={tag.id}
                  className={`flex items-center gap-2 cursor-pointer rounded-full px-4 py-[7px] text-xs font-medium bg-bg-3 text-text-sub`}
                  onClick={() => removeTag(tag.id)}
                >
                  <span>{tag.name}</span>
                  <RiCloseCircleLine className={`text-xs font-medium`} />
                </div>

              </>
            ) : null
          ))}

          {showTagInput ? (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                className="w-full resize-none overflow-hidden flex items-center gap-2 cursor-pointer rounded-full px-4 py-[7px] text-xs font-medium bg-bg-3 text-text-sub outline-none"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onBlur={cancelAddTag}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelAddTag();
                  if (e.key === "Enter") handleAddTag();
                }}
                placeholder="New Tag"
                autoFocus
                disabled={loadingState.tag}
              />
            </div>
          ) : (
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-bg-3 p-2 text-xl font-medium text-text-additional"
              onClick={() => setShowTagInput(true)}
            >
              +
            </div>
          )}
        </div>
      </div>}
    </div>
  );
};

export default SelectCategories;