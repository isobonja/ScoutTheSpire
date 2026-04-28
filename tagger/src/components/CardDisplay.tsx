import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import ImageWithSpinner from "./ImageWithSpinner";
import { CardClass, CLASS_COLORS, Rarity, RARITY_COLORS } from "@/util/constants";
import { capitalize } from "@/util/utils";
import { Separator } from "@/components/ui/separator";
import { Card } from "../../shared/types";

/*type CardDisplayProps = {
  name?: string;
  description?: string;
  cost?: number;
  cardType?: string;
  rarity?: string;
  cardClass?: string;
  imageUrl?: string;
  keywords?: string[];
}*/

type CardDisplayProps = {
  card: Card | null;
  className?: string;
  size?: "sm" | "lg";
}

function CardDisplay({ 
  card,
  className,
  size = "lg"
}: CardDisplayProps) {
  const isSmall = size === "sm";

  const sizes = {
    container: isSmall ? "p-2 max-h-64" : "p-4 max-h-96",
    title: isSmall ? "text-lg text-[clamp(14px,1.5vw,16px)] whitespace-nowrap" : "text-2xl",
    badge: isSmall ? "w-6 h-6 text-sm -right-3.5" : "w-8 h-8 text-lg -right-4.5",
    description: isSmall ? "text-xs" : "text-sm",
    keyword: isSmall ? "text-xs w-16 h-5" : "text-sm w-20 h-6",
  };

  function renderText(text: string) {
    const parts = text.split(/(\[gold\].*?\[\/gold\])/g);

    return parts.map((part, i) => {
      const match = part.match(/\[gold\](.*?)\[\/gold\]/);

      if (match) {
        return (
          <span key={i} className="text-yellow-400 font-semibold">
            {match[1]}
          </span>
        );
      }

      return <span key={i}>{part}</span>;
    });
  }

  const classKey = (card?.color?.toLowerCase() ?? "colorless") as CardClass;

  const RARITY_ALIASES: Record<string, string> = {
    basic: "common",
  };

  const normalizeRarity = (rarity?: string) => {
    const key = rarity?.toLowerCase() ?? "common";
    return RARITY_ALIASES[key] ?? key;
  };
  
  const rarityKey = normalizeRarity(card?.rarity);

  const safeRarityKey: Rarity =
    rarityKey in RARITY_COLORS ? (rarityKey as Rarity) : "common";

  const classColor = CLASS_COLORS[classKey];
  const rarityBorder = RARITY_COLORS[safeRarityKey];
  
  const BASE_IMAGE_URL = "https://spire-codex.com";


  return (
    <div 
      className={`
        ${className || ""} 
        ${sizes.container} 
        bg-panel-background 
        border 
        border-panel-border 
        rounded-lg 
        h-auto 
      `}
    >
      {/* card */}
      <div 
        className={`
          flex 
          flex-col 
          items-center 
          border-4 
          gap-2 
          relative 
          h-full 
          pt-2 
          max-w-72
          mx-auto
          ${classColor}
          ${rarityBorder}
        `}
      >
        {/* card name */}
        <span className={`${sizes.title} text-white font-bold`}>{card?.name || "Placeholder Name"}</span>

        {/* card image */}
        <div className='w-full flex flex-col items-center'>
          <ImageWithSpinner imageUrl={BASE_IMAGE_URL + card?.image_url} size={size} />
        </div>

        {/* card cost badge */}
        <Badge 
          className={`
            ${sizes.badge}
            bg-gray-950 
            text-white 
            border 
            ${rarityBorder}
            border-2 
            absolute 
            -top-4
            rounded-full 
            p-1 
            flex 
            items-center 
            justify-center
            z-10
          `}
        >
          {card?.is_x_cost ? "X" : card?.cost ?? "-1"}
        </Badge>

        {/* star cost badge */}
        <Badge 
          className={`
            ${sizes.badge}
            bg-gradient-to-r
            from-sky-900
            to-sky-700
            text-white 
            border 
            ${rarityBorder}
            rounded-none
            border-2 
            absolute 
            top-6
            p-1 
            flex 
            items-center 
            justify-center
            rotate-45
            z-10
            ${card?.star_cost ? "visible" : "hidden"}
          `}
        >
          <span className='-rotate-45'>{card?.is_x_star_cost ? "X" : card?.star_cost ?? "-1"}</span>
        </Badge>

        {/* card class/type container */}
        <div className='h-full flex flex-col items-center justify-between gap-2'>
          <Badge 
            className={`
              text-white 
              bg-gray-800/50
              border-2
              ${rarityBorder} 
              font-bold 
              p-1 
              w-14 
              h-6 
              flex 
              items-center 
              justify-center 
              text-xs
              rounded-sm
            `}
          >
            {card?.type ? capitalize(card?.type) : "TYPE"}
          </Badge>
        

          {/* card description */}
          <p className={`${sizes.description} text-white text-sm text-center`}>
            {card?.description && renderText(card?.description) || "This is a placeholder description for the card. It provides details about the card's abilities and effects."}
          </p>
          {/* card keywords */}
          <div className={`flex gap-2 mt-1`}>
            {card?.keywords && card?.keywords.length > 0 && (
              card?.keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  className={`
                    ${sizes.keyword}
                    text-white 
                    font-mono
                    text-sm
                    bg-transparent 
                    border-0 border-y border-white
                    rounded-sm 
                    p-1 
                    mb-4 
                    w-20 
                    h-6 
                    flex 
                    items-center 
                    justify-center 
                  `}
                >
                  {keyword}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDisplay;