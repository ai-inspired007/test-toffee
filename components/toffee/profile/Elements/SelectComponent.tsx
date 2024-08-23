import { Dispatch, SetStateAction, useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

export interface ItemProps {
  value: string;
  label: string;
}

export interface SelectProps {
  options: ItemProps[],
  selectedOption: string,
  setSelectedOption: Dispatch<SetStateAction<string>>;
  label: string;
}

const SelectComponent = ({ options, selectedOption, setSelectedOption, label }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: ItemProps) => {
    setSelectedOption(option.value);
    setIsOpen(false);
  };

  const selected = options.find(option => option.value === selectedOption);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="flex flex-col w-full gap-1 cursor-pointer" ref={dropdownRef}>
      <span className="text-xs font-semibold text-text-tertiary">{label}</span>
      <div className="relative w-full">
        <div
          onClick={toggleDropdown}
          className="w-full flex items-center text-text-sub bg-transparent border border-white/10 outline-none rounded-lg px-4 py-3 gap-2"
        >
          <span className="text-[13px]">{selected?.label}</span>
          <span className="ml-auto">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
        </div>

        {isOpen && (
          <div className="absolute w-full z-10">
            {options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => selectOption(option)}
                className={`flex flex-row items-center text-text-sub px-4 py-1.5 cursor-pointer gap-2 hover:bg-[#3a3a3a]   
                  ${selectedOption === option.value ? 'bg-[#3a3a3a]' : 'bg-[#242424]'}   
                  ${index === 0 ? 'rounded-t-lg mt-2' : ''}   
                  ${index === options.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <span className="text-[13px]">{option.label}</span>
                {selectedOption === option.value && <Check className="ml-auto w-5 h-5" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectComponent;