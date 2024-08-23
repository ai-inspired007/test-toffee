import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
export interface PharseProps {
  value: string;
  label: string;
}

export interface SelectProps {
  options: PharseProps[];
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
}

const SelectPharse = ({
  options,
  selectedOption,
  setSelectedOption,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: PharseProps) => {
    setSelectedOption(option.value);
    setIsOpen(false);
  };
  const selected = options.find((option) => option.value === selectedOption);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
  return (
    <div className="flex cursor-pointer flex-col gap-1" ref={dropdownRef}>
      <span className="text-xs font-semibold  text-text-tertiary">
        {"Pharse"}
      </span>
      <div className="relative w-full">
        <div
          onClick={toggleDropdown}
          className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-3 text-text-sub outline-none"
        >
          <span className="text-[13px]">{selected?.label}</span>
          <span className="ml-auto">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </span>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => selectOption(option)}
                className={`flex cursor-pointer flex-row items-center gap-2 px-4 py-1.5 text-text-sub hover:bg-[#3a3a3a] ${
                  selectedOption === option.value
                    ? "bg-[#3a3a3a]"
                    : "bg-[#242424]"
                } ${option.value === "public" ? "mt-2 rounded-t-lg" : ""} ${option.value === "unlisted" ? "rounded-b-lg" : ""}`}
              >
                <span className="text-[13px]">{option.label}</span>
                {selectedOption === option.value && (
                  <Check className="ml-auto h-5 w-5" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectPharse;
