"use client";
import React, { useEffect, useState, useRef } from "react";
import Banner1 from "./Banner1";
import Banner2 from "./Banner2";
import Banner3 from "./Banner3";
import Banner4 from "./Banner4";
import Banner5 from "./Banner5";
import Banner6 from "./Banner6";
import Slide from "./Slide";
const banners = [<Banner1 key="1" />, <Banner2 key="2" />, <Banner3 key="3" />, <Banner4 key="4" />, <Banner5 key="5" />, <Banner6 key="6" />];

const BannersSlide: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="carousel-content h-[304px] rounded-2xl">
        <Slide
          slides={banners}
          animationType="SLIDE"
          duration={4500}
          withNavigation
        />
      </div>
    </div>
  );
};

export default BannersSlide;
