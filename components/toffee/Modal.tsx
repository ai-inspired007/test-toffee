"use client";
import React, { useEffect, useRef } from 'react';
interface IProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<IProps> = ({ children, isOpen, onClose, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Close modal when clicking outside of the modal content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    isOpen && (
      <div 
         className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-[10px] z-50`}
      >
        <div 
          ref={ref} 
          className={className}
        >
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
