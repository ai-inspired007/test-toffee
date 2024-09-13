import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { RiChat1Line } from "./icons/ChatLineIcon";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
type DataProps = {
  title: string;
  children: React.ReactNode;
  className: string;
  link: string;
  description?: string;
  totChats: number;
  isMobile?: boolean;
};

type CarouselHandle = {
  scrollToPrev: () => void;
  scrollToNext: () => void;
};

const TagCarousel = forwardRef<
  CarouselHandle,
  React.HTMLAttributes<HTMLDivElement> & DataProps
>(
  (
    { title, children, className, totChats = 0, link, isMobile = false },
    ref,
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    useImperativeHandle(ref, () => ({
      scrollToPrev() {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            left: -300,
            behavior: "smooth",
          });
        }
      },
      scrollToNext() {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
          });
        }
      },
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
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current!;
      setAtStart(scrollLeft === 0);
      setAtEnd(scrollLeft + clientWidth === scrollWidth);
    };

    useEffect(() => {
      const { scrollWidth, clientWidth } = scrollContainerRef.current!;
      setIsScrollable(scrollWidth > clientWidth);
      handleScroll(); // Set initial states
    }, [children]);

    return (
      <div className="mb-3 flex flex-col gap-2">
        <div className="flex flex-row justify-between text-white">
          <div className="flex flex-col gap-1 pb-2">
            <div className="flex flex-row gap-4">
              <Link className={className} href={link} target="_blank">
                {title}
              </Link>
              <div className="flex flex-row items-center gap-1 text-xs text-text-additional">
                <RiChat1Line className="h-3 w-3 text-[#B1B1B1]" />
                <span>{formatNumber(totChats)}</span>
              </div>
            </div>
            {!isMobile && (
              <span className="text-sm  font-light text-text-tertiary">
                Take a look on available add-ons and connect it to your
                character
              </span>
            )}
          </div>
          {isScrollable && (
            <div className="flex flex-row items-center gap-2 pr-4 sm:pr-6">
              <span className="text-sm font-[500] text-[#BC7F44]">
                Show All
              </span>
              {!isMobile && (
                <div className="flex flex-row gap-1">
                  <span
                    className={`cursor-pointer ${atStart ? "text-gray-500" : ""}`}
                    onClick={handlePrevClick}
                    aria-disabled={atStart}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </span>
                  <span
                    className={`cursor-pointer ${atEnd ? "text-gray-500" : ""}`}
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
        {isMobile && (
          <span className="text-sm  font-light text-text-tertiary">
            Take a look on available add-ons and connect it to your character
          </span>
        )}
        <div
          className="no-scrollbar flex flex-row gap-2 overflow-auto"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {children}
        </div>
      </div>
    );
  },
);
TagCarousel.displayName = "TagCarousel";
export default TagCarousel;
