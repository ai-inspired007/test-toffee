"use client";
import { Dispatch, SetStateAction, useCallback, useState, FC } from "react";
import { Tag } from "@prisma/client";
import { CategorySection, TagSection } from "@/components/toffee/SelectOptions";
interface CharacterCategoryProps {
  categories: { id: string; name: string; tags: Tag[] }[];
  setCategories: (
    newCategories: { id: string; name: string; tags: Tag[] }[]
  ) => void;
  categoryId?: string;
  setCategoryId: Dispatch<SetStateAction<string | undefined>>;
  selectedTags: Set<string>;
  setSelectedTags: (selectedTags: Set<string>) => void;
}

interface LoadingState {
  category: boolean;
  tag: boolean;
}

const CharacterCategory: FC<CharacterCategoryProps> = ({
  categories,
  setCategories,
  categoryId,
  setCategoryId,
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
    [selectedTags, setSelectedTags]
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
    <div className="mt-5 flex flex-col w-full max-w-[560px] items-start">
      <div className="flex flex-col items-start w-full">
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
      </div>
    </div>
  );
};

export default CharacterCategory;