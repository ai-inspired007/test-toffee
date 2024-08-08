import DiscoverCard, { DiscoverCardProps } from "@/components/ui/discover-card";
import React from "react";
import { SwiperSlide } from "swiper/react";

const discoverCards: DiscoverCardProps[] = [
    {
      buttons: ['Try now'],
      color: "#7046d5",
      title: "Knowledge Packs",
      subtitle: "You are 20 coins away from being able to order your saved product Elgato HD60 Capture Card"
    },
    {
      buttons: ['Open editor','Try now'],
      color: "#ce9b59",
      title: "Try this out!",
      subtitle: "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext "
    },
    {
      buttons: ['Open editor','Try now'],
      color: "#b059ce",
      title: "Try this out!",
      subtitle: "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext "
    },
    {
      buttons: ['Try now'],
      color: "#74bd7a",
      title: "Curious about Eren Yeager's opinion on Game of Thrones?",
      subtitle: "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext "
    },
    {
      buttons: ['Try now'],
      color: "#466bd5",
      title: "Ever wanted to code side by side with Mark Zuckerburg?",
      subtitle: "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext "
    },
    {
      buttons: ['Try now'],
      color: "#bd748e",
      title: "Curious about Eren Yeager's opinion on Game of Thrones?",
      subtitle: "Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext Subtext "
    },
  ]

const DiscoverCardsGenerator = () => {
    return (
        discoverCards.map((card) => 
            <SwiperSlide>
                <DiscoverCard buttons={card.buttons} 
                color={card.color}
                title={card.title} 
                subtitle={card.subtitle}/>
            </SwiperSlide>
            )
          )
}

export default DiscoverCardsGenerator