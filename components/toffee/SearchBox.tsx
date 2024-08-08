import { useState, ChangeEvent, KeyboardEvent } from "react";
import { SearchLineIcon } from "./icons/SearchLineIcon";
export interface AutocompleteItem {
  id: string | number;
  name: string;
  type: string;
}
interface SearchBoxProps {
  query: string;
  setQuery: (query: string)=>void;
  autocompleteItems: AutocompleteItem[]
  except?: string;
}

export const SearchBox = ({query, setQuery, autocompleteItems, except}: SearchBoxProps) => {
  const [autocompleteVisible, setAutocompleteVisible] = useState<boolean>(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number>(-1);
  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setAutocompleteVisible(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const dataToFilter = autocompleteItems;

    if (e.key === "ArrowDown") {
      setAutocompleteIndex((prevIndex) =>
        Math.min(prevIndex + 1, dataToFilter.length - 1)
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
          : except
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
      if (highlightedItem.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        return highlightedItem.name;
      }
    } else if (except?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      return except;
    }
    return "";
  };
  return (
    <label className="sticky top-0 z-50 w-full rounded-t-lg bg-opacity-60 py-5 text-gray-400 backdrop-blur-lg backdrop-filter focus-within:text-gray-600 flex items-center border-0 border-b-2 border-[#BC7F44] font-inter">
      <SearchLineIcon className="h-6 w-6 pointer-events-none absolute left-6 text-[#B1B1B1]" />
      <input
        placeholder="What are you looking for?"
        value={query}
        onChange={handleQuery}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        type="text"
        spellCheck="false"
        className="relative h-9 bg-transparent text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 block w-full appearance-none rounded-none pl-14 text-white z-10"
      />
      {autocompleteVisible && query && (
        <div className="absolute flex items-center pointer-events-none pl-14 py-5 top-0 z-0">
          <span className="text-muted-foreground text-sm h-9 items-center flex font-inter">
            {query}{getPlaceholderText().slice(query.length)}
          </span>
        </div>
      )}
      {autocompleteVisible && query && (
        <div className="absolute bg-bg-3 rounded-md text-white top-14 flex flex-col left-10 z-10">
          {autocompleteItems.slice(0, 10).map((item, index) => (
            <div
              key={item.id}
              className={`cursor-pointer hover:bg-white/10 px-4 py-2 text-sm rounded-md ${autocompleteIndex === index ? "bg-white/10" : ""}`}
              onClick={() => handleAutocompleteClick(item)}
            >
              {item.name} <span className="text-xs text-gray-400">({item.type})</span>
            </div>
          ))}
        </div>
      )}
    </label>
  )
}