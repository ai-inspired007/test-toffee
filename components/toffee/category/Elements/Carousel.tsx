import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from 'lucide-react';
type DataProps = {
  title: string;
  children: React.ReactNode;
  className: string;
  description?: string;
};

type CarouselHandle = {
  scrollToPrev: () => void;
  scrollToNext: () => void;
};

const CategoryCarousel = forwardRef<
  CarouselHandle,
  React.HTMLAttributes<HTMLDivElement> & DataProps
>(({ title, children, className, description }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  useImperativeHandle(ref, () => ({
    scrollToPrev() {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
      }
    },
    scrollToNext() {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }
  }));

  const handlePrevClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleNextClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current!;
    setAtStart(scrollLeft === 0);
    setAtEnd(scrollLeft + clientWidth === scrollWidth);
  };

  useEffect(() => {
    const { scrollWidth, clientWidth } = scrollContainerRef.current!;
    setIsScrollable(scrollWidth > clientWidth);
    handleScroll(); // Set initial states
  }, [children]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between text-white">
        <div className="flex flex-col gap-1 pb-2">
          <div className="flex flex-row gap-4">
            <div className={className}>{title}</div>
            <div className="flex flex-row gap-1 items-center text-text-additional text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.8 2.59998H9.2C10.473 2.59998 11.6939 3.10569 12.5941 4.00586C13.4943 4.90604 14 6.12694 14 7.39998C14 8.67301 13.4943 9.89391 12.5941 10.7941C11.6939 11.6943 10.473 12.2 9.2 12.2V14.3C6.2 13.1 2 11.3 2 7.39998C2 6.12694 2.50571 4.90604 3.40589 4.00586C4.30606 3.10569 5.52696 2.59998 6.8 2.59998ZM8 11H9.2C9.67276 11 10.1409 10.9069 10.5777 10.7259C11.0144 10.545 11.4113 10.2799 11.7456 9.94556C12.0799 9.61127 12.345 9.21441 12.526 8.77764C12.7069 8.34086 12.8 7.87273 12.8 7.39998C12.8 6.92722 12.7069 6.45909 12.526 6.02232C12.345 5.58554 12.0799 5.18868 11.7456 4.85439C11.4113 4.5201 11.0144 4.25493 10.5777 4.07401C10.1409 3.89309 9.67276 3.79998 9.2 3.79998H6.8C5.84522 3.79998 4.92955 4.17926 4.25442 4.85439C3.57928 5.52952 3.2 6.4452 3.2 7.39998C3.2 9.56598 4.6772 10.9796 8 12.488V11Z" fill="#B1B1B1" />
              </svg>
              <span className = "text-xs">635.5k</span>
            </div>
          </div>
          <span className="text-sm  text-text-tertiary font-light">Take a look on available add-ons and connect it to your character</span>
        </div>
        {isScrollable && (
          <div className="flex flex-row gap-2 items-center pr-6">
            <span className="text-sm font-[500] text-[#BC7F44]">Show All</span>
            <div className="flex flex-row gap-1">
              <span
                className={`cursor-pointer ${atStart ? 'text-gray-500' : ''}`}
                onClick={handlePrevClick}
                aria-disabled={atStart}
              >
                <ArrowLeft className="h-5 w-5" />
              </span>
              <span
                className={`cursor-pointer ${atEnd ? 'text-gray-500' : ''}`}
                onClick={handleNextClick}
                aria-disabled={atEnd}
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        )}
      </div>
      <div
        className="no-scrollbar flex flex-row gap-4 overflow-auto"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </div>
  );
});

CategoryCarousel.displayName = "CategoryCarousel"
export default CategoryCarousel;