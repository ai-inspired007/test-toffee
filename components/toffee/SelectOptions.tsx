import { FC, Dispatch, SetStateAction } from "react";
import { Tag } from "@prisma/client";
export const CategorySection: FC<{
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
      <span className="text-xs text-text-tertiary">
        Personality Type
      </span>
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