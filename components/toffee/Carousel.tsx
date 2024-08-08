import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

type DataProps = {
  title: string;
  children: React.ReactNode;
  className: string;
};

type CarouselHandle = {
  scrollToPrev: () => void;
  scrollToNext: () => void;
};

const Carousel = forwardRef<
  CarouselHandle,
  React.HTMLAttributes<HTMLDivElement> & DataProps
>(({ title, children, className }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  const handlePrevClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleNextClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current!;
    setAtStart(scrollLeft === 0);
    setAtEnd(scrollLeft + clientWidth === scrollWidth);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsScrollable(scrollWidth > clientWidth);
      handleScroll(); // Set initial states
    }
  }, [children]);

  const isMobileScreen = () => window.innerWidth <= 768;

  const handleShowAllClick = () => {
    setShowAll(!showAll);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between text-white">
        <div className={className}>{title}</div>
        {isScrollable && (
          <div className="flex flex-row gap-2 items-center pr-6">
            <span
              className="text-sm font-[500] text-[#BC7F44] cursor-pointer"
              onClick={handleShowAllClick}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </span>
            {!showAll && !isMobileScreen() && (
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
            )}
          </div>
        )}
      </div>
      <div
        className={`flex ${showAll ? 'flex-wrap' : 'flex-row'} gap-4 overflow-auto no-scrollbar`}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </div>
  );
});
Carousel.displayName = "Carousel";
export default Carousel;