import dynamic from "next/dynamic";

const CarouselDiscoverCard = dynamic(() => import("./innerCarouselDiscoverCards"), { ssr: false });

export default CarouselDiscoverCard