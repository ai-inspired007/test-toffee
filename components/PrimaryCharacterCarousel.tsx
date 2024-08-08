"use client";

import { Character } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Children, useEffect, type ReactNode, useState } from "react";

interface PrimaryCharacterCarouselProps {
  autoplayDelay?: number; //ms
  autoplay?: boolean;
  children?: ReactNode;
}

const PrimaryCharacterCarousel = ({
  autoplayDelay,
  autoplay,
  children,
}: PrimaryCharacterCarouselProps) => {
  // const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  // const [sizeClass, setSizeClass] = useState<"default" | "small" | "medium" | "large">("default")

  // useEffect(() => {
  //   const handleResize = () => {
  //     // Your code here, e.g., set state with new viewport size
  //     const newWidth =
  //     setViewportWidth(window.innerWidth);
  //     if ()
  //   };

  //   window.addEventListener("resize", handleResize);

  //   // Cleanup
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <Carousel
      className="mx-16"
      opts={{
        loop: true,
        align: "center",
      }}
      plugins={
        autoplay
          ? [
              Autoplay({
                delay: autoplayDelay || 5000,
              }),
            ]
          : []
      }
    >
      <CarouselContent className={"-ml-4 pb-8"}>
        {Children.map(children, (child, index) => {
          return (
            <CarouselItem
              key={index}
              //   className="flex justify-center items-center p-5 w-60 h-60 sm:w-48 sm:h-48"
              // style={{
              //   flexBasis: `calc(100% / ${numInView || 1})`,
              // }}
              className={
                "relative basis-[100%] pl-4 sm:basis-[40%] md:basis-[70%] lg:basis-[40%] xl:basis-[27%] 2xl:basis-[22%]"
              }
            >
              <div className="aspect flex max-h-full max-w-full items-center justify-center">
                {child}
              </div>
              {/* <div className="px-10 aspect-square">                
              </div> */}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default PrimaryCharacterCarousel;
