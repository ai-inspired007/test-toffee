"use client";
import { Dispatch, SetStateAction, useCallback, useState, FC } from "react";
import { Tag } from "@prisma/client";
import { useSession } from "next-auth/react";
import "@yaireo/tagify/dist/tagify.css";
import "../tagify.css";
import TextareaBlock from "@/components/toffee/TextareaBlock";
import BotPreview from "./BotPreview";
import StepButton from "./StepButton";
interface CharacterInformationProps {
  imageData: string | null;
  setName: (newName: string) => void;
  name: string;
  categories: { id: string; name: string; tags: Tag[] }[];
  setCategories: (
    newCategories: { id: string; name: string; tags: Tag[] }[],
  ) => void;
  setDescription: (newDescription: string) => void;
  description: string;
  setCategoryId: Dispatch<SetStateAction<string | undefined>>;
  categoryId?: string;
  advanceFunction: () => void;
  previousFunction: () => void;
  instructions: string;
  setInstructions: (newInstructions: string) => void;
  introduction: string;
  setIntroduction: (newIntroduction: string) => void;
  scenario: string;
  setScenario: (newScenario: string) => void;
  selectedTags: Set<string>;
  setSelectedTags: (selectedTags: Set<string>) => void;
}

interface LoadingState {
  category: boolean;
  tag: boolean;
}

const CharacterInformation: FC<CharacterInformationProps> = ({
  imageData,
  setName,
  name,
  categories,
  setCategories,
  setDescription,
  description,
  setCategoryId,
  categoryId,
  advanceFunction,
  previousFunction,
  instructions,
  setInstructions,
  introduction,
  setIntroduction,
  scenario,
  setScenario,
  selectedTags,
  setSelectedTags,
}) => {
  const [tags, setTags] = useState<Tag[]>(categories[0]?.tags || []);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>({
    category: false,
    tag: false,
  });
  const { data: session } = useSession();
  const user = session?.user || {};
  const [newCategory, setNewCategory] = useState<string>("");

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

  const handleAddCategory = async () => {
    if (newCategory) {
      setLoadingState((prev) => ({ ...prev, category: true }));
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        });
        const data = await response.json();
        setCategories(data);
        setShowCategoryInput(false);
        setNewCategory("");
      } catch (error) {
        console.error("[CATEGORY_ADD]", error);
      } finally {
        setLoadingState((prev) => ({ ...prev, category: false }));
      }
    }
  };

  const handleAddTag = async () => {
    if (newTag && categoryId) {
      setLoadingState((prev) => ({ ...prev, tag: true }));
      try {
        const response = await fetch("/api/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTag, categoryId }),
        });
        const data = await response.json();
        setTags((prevTags) => [...prevTags, data]);
        setShowTagInput(false);
        setNewTag("");
      } catch (error) {
        console.error("[TAG_ADD]", error);
      } finally {
        setLoadingState((prev) => ({ ...prev, tag: false }));
      }
    }
  };

  const cancelAddCategory = () => {
    setShowCategoryInput(false);
    setNewCategory("");
  };

  const cancelAddTag = () => {
    setShowTagInput(false);
    setNewTag("");
  };

  return (
    <div className="mt-5 flex w-full max-w-[1024px] flex-row">
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col gap-4">
          <h1 className="sm:text-[32px] text-[20px] font-semibold tracking-[0.075rem] text-white">
            General Information
          </h1>
          <p className="sm:text-sm text-[13px] text-text-tertiary">
            Fill in your character information here!
          </p>
        </div>
        <div className="mt-8 flex w-full sm:w-[456px] flex-col gap-6">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs text-text-tertiary">
              {"Name"}
            </span>
            <input
              type="text"
              className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent p-1 px-4 py-3 text-[13px] text-text-sub placeholder-[#767676] outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your character's name."
            />
          </div>
          <TextareaBlock
            label="Description"
            name="description"
            value={description}
            onChange={setDescription}
            placeholder="Tips on initiating a conversation with your AI"
          />
          <TextareaBlock
            label="Introduction"
            name="introduction"
            value={introduction}
            onChange={setIntroduction}
            placeholder="Guide your AI on how to initiate the conversation."
          />

          <div className="flex flex-col gap-3">
            <CategorySection
              categories={categories}
              showCategoryInput={showCategoryInput}
              setCategoryId={setCategoryId}
              setShowCategoryInput={setShowCategoryInput}
              setNewCategory={setNewCategory}
              handleAddCategory={handleAddCategory}
              cancelAddCategory={cancelAddCategory}
              newCategory={newCategory}
              loadingState={loadingState.category}
              setTags={setTags}
              categoryId={categoryId}
            />
          </div>
          {categoryId && (
            <div className="mt-2 flex flex-col gap-3">
              <span className="text-xs text-text-tertiary">
                Personality Type
              </span>
              <TagSection
                tags={tags}
                showTagInput={showTagInput}
                selectedTags={selectedTags}
                handleTagClick={handleTagClick}
                setShowTagInput={setShowTagInput}
                setNewTag={setNewTag}
                handleAddTag={handleAddTag}
                cancelAddTag={cancelAddTag}
                newTag={newTag}
                isLoading={loadingState.tag}
              />
            </div>
          )}
          <TextareaBlock
            label="Character Instructions"
            name="instructions"
            value={instructions}
            onChange={setInstructions}
            placeholder="Decide on the best way for your AI to initiate the conversation."
          />
          <TextareaBlock
            label="Scenario (Optional)"
            name="scenario"
            value={scenario}
            onChange={setScenario}
            placeholder="Describe your character scenario in order."
          />
          <div className="w-full mt-[17px]">
            <StepButton onClick={advanceFunction} text="Continue" />
          </div>
        </div>
      </div>
      <div className="ml-[272px] hidden sm:block mt-5">
        <BotPreview
          imageData={imageData}
          user={user}
          name={name}
          description={description}
        />
      </div>
    </div>
  );
};

const CategorySection: FC<{
  categories: { id: string; name: string; tags: Tag[] }[];
  showCategoryInput: boolean;
  setCategoryId: Dispatch<SetStateAction<string | undefined>>;
  setShowCategoryInput: Dispatch<SetStateAction<boolean>>;
  setNewCategory: Dispatch<SetStateAction<string>>;
  handleAddCategory: () => void;
  cancelAddCategory: () => void;
  newCategory: string;
  loadingState: boolean;
  setTags: (tags: Tag[]) => void;
  categoryId?: string;
}> = ({
  categories,
  showCategoryInput,
  setCategoryId,
  setShowCategoryInput,
  setNewCategory,
  handleAddCategory,
  cancelAddCategory,
  newCategory,
  loadingState,
  setTags,
  categoryId,
}) => (
    <>
      <span className="text-xs text-text-tertiary">Category</span>
      <div className="flex flex-row flex-wrap gap-1.5">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`cursor-pointer rounded-lg px-3 py-[7px]  text-sm font-medium ${categoryId === category.id ? "bg-white text-black" : "bg-bg-3 text-text-additional"}`}
            onClick={() => {
              setCategoryId(category.id);
              setTags(category.tags);
            }}
          >
            {category.name}
          </div>
        ))}
        {showCategoryInput ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent p-1 px-4 py-1.5 text-sm text-text-sub outline-none"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onBlur={cancelAddCategory}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelAddCategory();
                if (e.key === "Enter") handleAddCategory();
              }}
              placeholder="New Category"
              autoFocus
              disabled={loadingState}
            />
          </div>
        ) : (
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-bg-3 p-2  text-xl font-medium text-text-additional"
            onClick={() => setShowCategoryInput(true)}
          >
            +
          </div>
        )}
      </div>
    </>
  );

export const TagSection: FC<{
  tags: Tag[];
  showTagInput: boolean;
  selectedTags: Set<string>;
  handleTagClick: (tagId: string) => void;
  setShowTagInput: Dispatch<SetStateAction<boolean>>;
  setNewTag: Dispatch<SetStateAction<string>>;
  handleAddTag: () => void;
  cancelAddTag: () => void;
  newTag: string;
  isLoading: boolean;
}> = ({
  tags,
  showTagInput,
  selectedTags,
  handleTagClick,
  setShowTagInput,
  setNewTag,
  handleAddTag,
  cancelAddTag,
  newTag,
  isLoading,
}) => (
    <>
      <div className="flex flex-row flex-wrap gap-1.5">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`cursor-pointer rounded-lg px-3 py-[7px]  text-sm font-medium ${selectedTags.has(tag.id) ? "bg-white text-black" : "bg-bg-3 text-text-additional"}`}
            onClick={() => handleTagClick(tag.id)}
          >
            {tag.name}
          </div>
        ))}
        {showTagInput ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              className="w-full resize-none overflow-hidden rounded-lg border border-white/10 bg-transparent p-1 px-4 py-1.5 text-sm text-text-sub outline-none"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onBlur={cancelAddTag}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelAddTag();
                if (e.key === "Enter") handleAddTag();
              }}
              placeholder="New Tag"
              autoFocus
              disabled={isLoading}
            />
          </div>
        ) : (
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-bg-3 p-2  text-xl font-medium text-text-additional"
            onClick={() => setShowTagInput(true)}
          >
            +
          </div>
        )}
      </div>
    </>
  );

export default CharacterInformation;
