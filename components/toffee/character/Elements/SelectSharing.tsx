import React, { Dispatch, SetStateAction, useEffect, useState, useCallback, useRef } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

export interface SharingProps {
  value: 'Public' | 'Sharing' | 'Private';
  label: string;
  icon: React.FC<any>;
}

export interface SelectProps {
  options: SharingProps[];
  selectedOption: 'Public' | 'Sharing' | 'Private' | null;
  setSelectedOption: Dispatch<SetStateAction<'Public' | 'Sharing' | 'Private' | null>>;
}

const SelectSharing: React.FC<SelectProps> = ({ options, selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: SharingProps) => {
    setSelectedOption(option.value);
    setIsOpen(false);
  };

  const selected = options.find(option => option.value === selectedOption);
  const SelectedIconComponent = selected?.icon;

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div className="flex flex-col w-full gap-1 cursor-pointer" ref={dropdownRef}>
      <span className="text-xs font-semibold text-text-tertiary">{"Sharing"}</span>
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
          <div className="absolute w-full z-10 bg-[#242424] rounded-lg mt-2">
            {options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => selectOption(option)}
                className={`flex flex-row items-center text-text-sub px-4 py-1.5 cursor-pointer gap-2 hover:bg-[#3a3a3a]  
                  ${selectedOption === option.value ? 'bg-[#3a3a3a]' : ''}  
                  ${index === 0 ? 'rounded-t-lg' : ''}  
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
  );
};

export default SelectSharing;