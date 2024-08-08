import React, { useEffect, useReducer, useRef, useState } from "react";

interface ICarouselProps {
  slides: React.ReactElement[];
  cachedSlides?: boolean;
  duration?: number;
  animationDuration?: number;
  animationTimingFunction?: string;
  animationType?: "FADE" | "SLIDE" | "ZOOM";
  animationDelay?: number;
  withNavigation?: boolean;
}

interface ICarouselState {
  active: number;
}

interface IAction {
  type: "NEXT" | "PREV" | "CUSTOM";
  index?: number;
}

const initialState: ICarouselState = {
  active: 0,
};

const reducer = (state: ICarouselState, action: IAction): ICarouselState => {
  switch (action.type) {
    case "NEXT":
      return {
        active: (state.active + 1) % action.index!,
      };
    case "PREV":
      return {
        active: (state.active - 1 + action.index!) % action.index!,
      };
    case "CUSTOM":
      if (typeof action.index !== "undefined") {
        return {
          active: action.index,
        };
      }
      return state;
    default:
      return state;
  }
}

const Carousel: React.FC<ICarouselProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { active } = state;
  const { slides, duration = 5000, withNavigation } = props;
  const slidesLength = slides.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const startDragging = (event: MouseEvent | TouchEvent) => {
    setIsDragging(true);
    setStartX(event instanceof MouseEvent ? event.clientX : event.touches[0].clientX);
    setPrevTranslate(currentTranslate);

    if (timerId.current) {
      clearTimeout(timerId.current);
    }
  };

  const onDragging = (event: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      setCurrentTranslate(currentX - startX);
    }
  };

  const endDragging = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const movedBy = currentTranslate;

    if (movedBy < -100) {
      dispatch({ type: "NEXT", index: slidesLength });
    } else if (movedBy > 100) {
      dispatch({ type: "PREV", index: slidesLength });
    }

    setCurrentTranslate(0);
    setPrevTranslate(0);

    timerId.current = setTimeout(() => {
      dispatch({ type: "NEXT", index: slidesLength });
    }, duration);
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("mousedown", startDragging);
      container.addEventListener("mousemove", onDragging);
      container.addEventListener("mouseup", endDragging);
      container.addEventListener("mouseleave", endDragging); // Handle mouse leaving
      container.addEventListener("touchstart", startDragging);
      container.addEventListener("touchmove", onDragging);
      container.addEventListener("touchend", endDragging);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", startDragging);
        container.removeEventListener("mousemove", onDragging);
        container.removeEventListener("mouseup", endDragging);
        container.removeEventListener("mouseleave", endDragging); // Handle mouse leaving
        container.removeEventListener("touchstart", startDragging);
        container.removeEventListener("touchmove", onDragging);
        container.removeEventListener("touchend", endDragging);
      }
    };
  }, [isDragging, currentTranslate]);

  useEffect(() => {
    timerId.current = setTimeout(() => {
      dispatch({ type: "NEXT", index: slidesLength });
    }, duration);

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [active, duration, slidesLength]);

  return (
    <div ref={containerRef} style={styles.container} className="animated-carousel-container rounded-2xl">
      {slides.map((slide, index) => {
        const isCurrent = index === active;
        const isPrevious = (index === (active - 1 + slidesLength) % slidesLength);
        const isNext = (index === (active + 1) % slidesLength);

        return (
          <div
            key={index}
            className="animated-carousel-item rounded-2xl"
            style={{
              ...styles.item,
              ...getAnimationStyle({
                isCurrent,
                isPrevious,
                isNext,
                translate: currentTranslate,
                isDragging
              }),
            }}
          >
            {slide}
          </div>
        );
      })}
      {withNavigation && (
        <div className="animated-carousel-dots flex flex-row gap-1 absolute bottom-5 left-5 sm:bottom-8 sm:left-8" style={{ zIndex: 1 }}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`animated-carousel-dot ${index === active ? "active" : ""}`.trim()}
              onClick={() => dispatch({ type: "CUSTOM", index })}
              style={
                {
                  '--animation-duration': `${duration}ms`,
                } as React.CSSProperties
              }
            >
              {index === active && (
                <svg>
                  <circle cx="10" cy="10" r="8" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    touchAction: "pan-y",
    cursor: 'grab'
  },
  item: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    willChange: "transform",
    transition: "transform 0.3s ease"
  }
};

interface AnimationStyleProps {
  isCurrent: boolean;
  isPrevious: boolean;
  isNext: boolean;
  translate: number;
  isDragging: boolean;
}

const getAnimationStyle = ({ isCurrent, isPrevious, isNext, translate, isDragging }: AnimationStyleProps): React.CSSProperties => {
  const draggingStyle = isDragging ? { transition: "none" } : {};
  
  if (isCurrent) {
    return {
      transform: `translateX(${translate}px)`,
      zIndex: 1,
      ...draggingStyle
    };
  }

  if (isPrevious) {
    return {
      transform: `translateX(calc(-100% + ${translate}px))`,
      zIndex: isDragging ? 1 : 0,
      ...draggingStyle
    };
  }

  if (isNext) {
    return {
      transform: `translateX(calc(100% + ${translate}px))`,
      zIndex: isDragging ? 1 : 0,
      ...draggingStyle
    };
  }

  return {
    transform: "translateX(100%)",
  };
}

export default Carousel;