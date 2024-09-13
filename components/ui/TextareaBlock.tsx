import React, { useEffect, useRef } from 'react';
import { RiInformationLine } from 'react-icons/ri';

interface TextareaBlockProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxRows?: number;
}

const TextareaBlock: React.FC<TextareaBlockProps> = ({ label, name, value, onChange, placeholder, maxRows = 10 }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      const scrollHeight = textArea.scrollHeight;
      const maxAllowedHeight = parseFloat(getComputedStyle(textArea).lineHeight) * maxRows;

      if (scrollHeight > maxAllowedHeight) {
        textArea.style.height = `${maxAllowedHeight}px`;
        textArea.style.overflowY = 'auto';
      } else {
        textArea.style.height = `${scrollHeight}px`;
        textArea.style.overflowY = 'hidden';
      }
    }
  }, [value, maxRows]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 relative w-full">
      <div className='text-xs text-text-tertiary flex items-center gap-1'>
        <span className="">{label}</span>
        <RiInformationLine />
      </div>

      <div className="flex flex-col w-full">
        <textarea
          ref={textAreaRef}
          name={name}
          className="w-full no-scrollbar text-[13px] text-text-sub bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-t-lg px-4 py-3"
          value={value}
          onChange={handleChange}
          rows={1}
        ></textarea>
        <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">
          {placeholder}
        </span>
      </div>
    </div>
  );
};

export default TextareaBlock;