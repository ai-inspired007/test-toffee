import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';

type DataProps = {
  children: React.ReactNode;
  showAll: boolean;
};

type CarouselHandle = {
  scrollToPrev: () => void;
  scrollToNext: () => void;
};

const TagCarousel = forwardRef<
  CarouselHandle,
  React.HTMLAttributes<HTMLDivElement> & DataProps
>(({ children, showAll }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToPrev() {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
    },
    scrollToNext() {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  }));

  return (
    <div
      className={`flex ${showAll ? 'flex-wrap' : 'flex-row'} gap-2 overflow-auto no-scrollbar`}
      ref={scrollContainerRef}
    >
      {children}
    </div>
  );
});

TagCarousel.displayName = "TagCarousel";
export default TagCarousel;