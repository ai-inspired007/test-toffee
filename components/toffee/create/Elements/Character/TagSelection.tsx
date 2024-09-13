import { FC, Dispatch, SetStateAction } from "react";
import { Tag } from "@prisma/client";

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