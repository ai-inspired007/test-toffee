"use client";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Category, Tag } from "@prisma/client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { WandDropDown } from "./WandDropDown";
import { WandTagify } from "./WandTagify";
import { X, XCircle } from "lucide-react";
import Tags from './tagify/react.tagify'
import '@yaireo/tagify/dist/tagify.css' // Tagify CSS
import "./tagify.css"
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from "lodash";

export const CharacterInformation = ({
  imageData,
  setName,
  name,
  categories,
  setCategories,
  addedCategory,
  setAddedCategory,
  setDescription,
  description,
  setCategoryId,
  categoryId,
  characterTags,
  setCharacterTags,
  advanceFunction,
  previousFunction,
}: {
  imageData: string | null;
  name: string;
  categories: { id: string, name: string, tags: Tag[] }[];
  addedCategory: {id: string, name: string, tags: Tag[]} | null;
  description: string;
  categoryId?: string;
  characterTags: string[];
  setCharacterTags: (newTags: string[]) => void;
  setCategories: (newCategories: { id: string, name: string, tags: Tag[] }[]) => void;
  setAddedCategory: Dispatch<SetStateAction<{ id: string, name: string, tags: Tag[] } | null>>;
  setName: (newName: string) => void;
  setDescription: (newDescription: string) => void;
  setCategoryId: (newCategoryId: string) => void;
  advanceFunction: () => void;
  previousFunction: () => void;
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isLoadingTag, setIsLoadingTag] = useState(false);
  const { data: session } = useSession();
  let user = session?.user;
  const [isAdd, setIsAdd] = useState(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [tagList, setTagList] = useState<Tag[]>([]);
  const onChange = useCallback((e: any) => {
    const data = e.detail.tagify.getCleanValue();
    setCharacterTags(data.map((item: any) => item.value));
    // console.log("CHANGED:"
    //     , e.detail.tagify.value // Array where each tag includes tagify's (needed) extra properties
    //     , e.detail.tagify.getCleanValue() // Same as above, without the extra properties
    //     , e.detail.value // a string representing the tags
    // )
  }, [])

  return (
    <div className="flex flex-row mt-[100px] w-full max-w-[1024px]">
      <div className="flex flex-col items-start">
        <h1 className="text-white font-inter font-bold text-[32px]">
          General Information
        </h1>
        <p className="text-text-tertiary font-inter text-sm">
          Fill in your character information here!
        </p>
        <div className="flex flex-col w-[456px] mt-8 gap-7">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Name"}</span>
            <div className="relative">
              <input
                type="text"
                className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your character's name."
              />
                <WandDropDown input={name} setInput={setName} setImageData={() => { }} isImage={false} isTextarea={false} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Description"}</span>
            <div className="relative">
              <textarea name="description" id="" className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <WandDropDown input={description} setInput={setDescription} setImageData={() => { }} isImage={false} isTextarea={true} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-text-tertiary">Category</span>
            <div className="flex flex-row flex-wrap gap-1.5">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`gap-1 px-3 py-[7px] font-inter font-medium text-sm rounded-lg cursor-pointer ${categoryId === category.id ? "bg-white text-black" : "bg-bg-3 text-text-additional"}`}
                  onClick={() => {
                    setCategoryId(category.id)
                    setTagList(category.tags);
                    setCharacterTags([]);
                  }}
                >
                  {category.name}
                </div>
              ))}
              {addedCategory && (
                <div
                  key={`new_category`}
                  className={`flex gap-1 px-3 py-[7px] font-inter font-medium text-sm rounded-lg cursor-pointer ${categoryId === addedCategory.id ? "bg-white text-black" : "bg-bg-3 text-text-additional"}`}
                  onClick={() => {
                    setCategoryId(addedCategory.id);
                    setTagList(addedCategory.tags);
                    setCharacterTags([]);
                  }}
                >
                  {addedCategory.name}
                  <X
                    className={`h-5 w-5 p-0 ${categoryId === addedCategory.id ? "text-black" : "text-white"}`}
                    onClick={() => {
                      setAddedCategory(null);
                    }}
                  />
                </div>
              )}
              {
                isAdd &&
                  <input
                    type="text"
                    className="flex w-fit px-3 py-[7px] text-sm font-inter font-medium text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg"
                    value={newCategory}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setAddedCategory({ id: `new_${uuidv4()}`, name: newCategory, tags: [] });
                        setNewCategory("");
                        setIsAdd(false);
                      }
                    }}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category."
                />
              }
              {(!isAdd && !addedCategory) && <div className="p-2 rounded-full text-xl font-inter text-text-additional font-medium bg-bg-3 w-8 h-8 items-center flex justify-center cursor-pointer" onClick={() => setIsAdd(true)}>+</div>
              }
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-text-tertiary">{"Tags"}</span>
            <div className="relative character-tagify text-white">
              <Tags
                disabled={false}
                // whitelist={categories.find((item) => item.id === categoryId)?.tags.filter(item => item.categoryId === categoryId).map(item => item.name)}
                whitelist={tagList.filter(item => item.categoryId === categoryId).map(item => item.name)}
                settings={{
                  blacklist: ["xxx"],
                  maxTags: 30,
                  dropdown: {
                    enabled: 0 // always show suggestions dropdown
                  }
                }}
                value={characterTags}
                defaultValue={tagList.filter(item => item.categoryId === categoryId).map(item => item.name).join(",")} // initial value
                onChange={onChange}
              />
              <span className="flex absloute text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">Generate  your tags with AI</span>
              <WandTagify description={description} category={categories.filter(item => item.id === categoryId)[0]?.name || ""} characterTags={characterTags} setCharacterTags={setCharacterTags} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="w-[220px] bg-bg-3 rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={previousFunction}>
              {"Previous step"}
            </div>
            <div className="w-[220px] bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={advanceFunction}>
              {"Continue"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ml-auto">
        <div className="px-6 w-full">
          <div className="text-white font-inter text-xs bg-bg-3 w-full text-center py-2 rounded-t-2xl">Bot preview</div>
        </div>
        <div className="relative">
          <div className="absolute bottom-4 z-10 max-w-72 overflow-hidden text-ellipsis pl-4 text-white ">
            <h1 className="mb-1 text-lg tracking-tight text-white font-medium">
              {name || "Enter character name..."}
            </h1>
            <p className="mb-2 max-w-32 overflow-hidden text-ellipsis text-text-additional">
              {user?.name || user?.id}
            </p>
            <p className="mt-2 w-full max-w-full text-wrap text-sm text-[#B9B9B9]">
              {description.slice(0, Math.min(description.length, 80)) +
                (description.length > 80 ? "…" : "") ||
                "Enter character description..."}
            </p>
          </div>
          <div className="relative h-full w-fit">
            <div className="absolute z-[1] h-full w-full rounded-b-2xl bg-gradient-to-b from-transparent from-10% to-black to-100% lg:from-40%" />
            <Image
              className="rounded-2xl object-cover w-[312px] h-[360px]"
              src={imageData || "/default.png"}
              alt="Character Image"
              width={312}
              height={360}
            />
          </div>
        </div>
      </div>
    </div>
  );
}