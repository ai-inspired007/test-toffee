import React, { useEffect, useRef } from 'react';

interface TextareaBlockProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const TextareaBlock: React.FC<TextareaBlockProps> = ({ label, name, value, onChange, placeholder }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 relative w-full">
      <span className="text-xs text-text-tertiary">{label}</span>
      <div className="flex flex-col w-full">
        <textarea
          ref={textAreaRef}
          name={name}
          className="w-full text-[13px] text-text-sub bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-t-lg px-4 py-3"
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