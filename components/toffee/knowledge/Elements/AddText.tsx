import { Plus } from 'lucide-react';
import { RiDeleteBin6Line } from "../../icons/Files";
import { CandyText } from '../Create';
import React, { useRef, Dispatch, SetStateAction, useState, useEffect } from "react";
import { isEmpty } from 'lodash';

export interface TextProps {
  texts: CandyText[] | undefined;
  setTexts: Dispatch<SetStateAction<CandyText[] | undefined>>;
}

const AddText = ({ texts, setTexts }: TextProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTextContent, setNewTextContent] = useState<string>('');

  const handleAddText = () => {
    setNewTextContent('');
    if (texts) {
      setTexts([...texts, { id: "", content: "", knowledgePackId: "" }]);
    } else {
      setTexts([{id: "", content: "", knowledgePackId: "" }]);
    }
    setEditingIndex(texts ? texts.length : 0);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    if (texts && texts[index].content) {
      setNewTextContent(texts[index].content);
    }
  };

  const handleEditConfirm = (index: number) => {
    if (newTextContent.trim() === '') {
      handleDelete(index);
      return;
    }

    if (texts) {
      const updatedTexts = texts.map((text, idx) =>
        idx === index ? { ...text, content: newTextContent } : text
      );
      setTexts(updatedTexts);
      setEditingIndex(null);
      setNewTextContent(''); // Clear the new text content state
    }
  };

  const handleDelete = (index: number) => {
    if (texts) {
      const updatedTexts = texts.filter((_, idx) => idx !== index);
      setTexts(updatedTexts);
    }
    setEditingIndex(null); // Reset editing index if removed
  };

  useEffect(() => {
    const textArea = document.getElementById(`textArea-${editingIndex}`);
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [newTextContent, editingIndex]);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className='flex flex-row w-full'>
        <span className="text-base font-normal  text-white">Add your text</span>
        <Plus className='h-6 w-6 text-text-tertiary ml-auto cursor-pointer' onClick={handleAddText} />
      </div>
      {texts && texts.map((text, index) => (
        <div key={index} className="flex flex-col gap-1 w-full">
          <span className='text-xs font-light text-text-tertiary'>{"Add your text"}</span>
          <div className='flex flex-row gap-4'>
            <div className="flex flex-col gap-1 border border-[#202020] rounded-[7px] w-full">
              {editingIndex === index ? (
                <textarea
                  id={`textArea-${index}`}
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  onBlur={() => handleEditConfirm(index)}
                  className="text-[13px] text-text-sub  px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden"
                  autoFocus
                />
              ) : (
                <span
                  className="text-[13px] text-text-sub  px-4 pt-3 pb-2 cursor-pointer whitespace-pre-wrap break-words"
                  onClick={() => handleEdit(index)}
                >
                  {text.content}
                </span>
              )}
              <span className="text-xs text-text-tertiary bg-bg-3  px-4 py-1">Enter text manually</span>
            </div>
            <div className="flex flex-row text-text-tertiary gap-6 ml-auto items-start">
              {editingIndex !== index && (
                <RiDeleteBin6Line className="h-6 w-6 cursor-pointer" onClick={() => handleDelete(index)} />
              )}
            </div>
          </div>
        </div>
      ))}
      {isEmpty(texts) && (
        <div className="flex flex-col gap-1 w-full">
          <span className='text-xs  text-text-tertiary'>{"Add your text"}</span>
          <div className='flex flex-row gap-4'>
            <div className="flex flex-col gap-1 border border-[#202020] rounded-[7px] w-full">
              <textarea
                id="textArea-init"
                value={newTextContent}
                onChange={(e) => setNewTextContent(e.target.value)}
                onBlur={() => handleEditConfirm(editingIndex ?? 0)}
                onClick={handleAddText}
                className="text-[13px] text-text-sub  px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none overflow-hidden"
                autoFocus
              />
              <span className="text-xs text-text-tertiary bg-bg-3  px-4 py-1">Enter text manually</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddText;