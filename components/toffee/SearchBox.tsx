import { useState, ChangeEvent, KeyboardEvent } from "react";
import { SearchLineIcon } from "./icons/SearchLineIcon";
export interface AutocompleteItem {
  id: string | number;
  name: string;
  type: string;
}
interface SearchBoxProps {
  query: string;
  setQuery: (query: string) => void;
  autocompleteItems: AutocompleteItem[];
  except?: string;
}

export const SearchBox = ({
  query,
  setQuery,
  autocompleteItems,
  except,
}: SearchBoxProps) => {
  const [autocompleteVisible, setAutocompleteVisible] =
    useState<boolean>(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number>(-1);
  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setAutocompleteVisible(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const dataToFilter = autocompleteItems;

    if (e.key === "ArrowDown") {
      setAutocompleteIndex((prevIndex) =>
        Math.min(prevIndex + 1, dataToFilter.length - 1),
      );
    } else if (e.key === "ArrowUp") {
      setAutocompleteIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (
      e.key === "Enter" &&
      autocompleteIndex >= 0 &&
      autocompleteIndex < dataToFilter.length
    ) {
      const selectedItem = dataToFilter[autocompleteIndex];
      setQuery(selectedItem.name);
      setAutocompleteVisible(false);
      setAutocompleteIndex(-1);
    } else if (e.key === "Tab" && except) {
      e.preventDefault();
      setQuery(
        autocompleteIndex >= 0
          ? dataToFilter[autocompleteIndex]?.name || except
          : except,
      );
      setAutocompleteVisible(false);
      setAutocompleteIndex(-1);
    }
  };

  const handleAutocompleteClick = (item: AutocompleteItem) => {
    setQuery(item.name);
    setAutocompleteVisible(false);
    setAutocompleteIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => setAutocompleteVisible(false), 200);
  };

  const getPlaceholderText = () => {
    const dataToFilter = autocompleteItems;

    if (!query) return "";
    if (autocompleteIndex >= 0 && autocompleteIndex < dataToFilter.length) {
      const highlightedItem = dataToFilter[autocompleteIndex];
      if (
        highlightedItem.name.toLowerCase().indexOf(query.toLowerCase()) === 0
      ) {
        return highlightedItem.name;
      }
    } else if (except?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      return except;
    }
    return "";
  };
  return (
    <label className="sticky top-0 z-50 flex w-full items-center ">
      <SearchLineIcon className="pointer-events-none absolute inset-y-0 -top-0.5 left-0  h-6 w-6 shrink-0 text-toffee-text-additional" />
      <input
        placeholder="What are you looking for?"
        value={query}
        onChange={handleQuery}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        type="text"
        spellCheck="false"
        className="relative z-10 ml-2 block w-full max-w-xs rounded-none bg-transparent pl-6 text-sm text-white transition-colors placeholder:text-toffee-text-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-sm"
      />
      {autocompleteVisible && query && (
        <div className="pointer-events-none absolute top-0 z-0 flex items-center py-5 pl-14">
          <span className="flex h-9 items-center text-sm text-muted-foreground ">
            {/* {query} */}
            {getPlaceholderText().slice(query.length)}
          </span>
        </div>
      )}
      {autocompleteVisible && query && (
        <div className="absolute left-6 top-14 z-10 ml-2 flex flex-col rounded-md bg-bg-3 text-white">
          {autocompleteItems.slice(0, 10).map((item, index) => (
            <div
              key={item.id}
              className={`cursor-pointer rounded-md px-4 py-2 text-sm hover:bg-white/10 ${autocompleteIndex === index ? "bg-white/10" : ""}`}
              onClick={() => handleAutocompleteClick(item)}
            >
              {item.name}{" "}
              <span className="text-xs text-gray-400">({item.type})</span>
            </div>
          ))}
        </div>
      )}
    </label>
  );
};
