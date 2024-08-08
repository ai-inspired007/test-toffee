import dynamic from "next/dynamic";

const CarouselCharacterCard = dynamic(() => import("./innerCarouselCharacterCard"), {ssr: false});

export default CarouselCharacterCard;