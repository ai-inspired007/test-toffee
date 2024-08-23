import { Dispatch, SetStateAction, useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { UserSettings_shared } from "@prisma/client";

export interface SharingProps {
  value: UserSettings_shared;
  label: string;
  icon: React.ElementType;
}

export interface SelectProps {
  options: SharingProps[],
  selectedOption: UserSettings_shared | null,
  setSelectedOption: Dispatch<SetStateAction<UserSettings_shared | null>>;
}

const SelectSharing = ({ options, selectedOption, setSelectedOption }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: SharingProps) => {
    setSelectedOption(option.value);
    setIsOpen(false);
  };

  const selected = options.find(option => option.value === selectedOption);
  const SelectedIconComponent = selected?.icon;
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
      <span className="text-xs font-semibold  text-text-tertiary">{"Sharing"}</span>
      <div className="relative w-full">
        <div
          onClick={toggleDropdown}
          className="w-full flex items-center text-text-sub bg-transparent border border-white/10 outline-none rounded-lg px-4 py-3 gap-2"
        >
          {SelectedIconComponent && <SelectedIconComponent className="w-6 h-6" />}
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
                <option.icon className="w-6 h-6" />
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

export default SelectSharing;