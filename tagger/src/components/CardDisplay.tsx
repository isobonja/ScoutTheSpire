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
}

function CardDisplay({ 
  card
}: CardDisplayProps) {

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

  /*const TAG_STYLES: Record<string, string> = {
    gold: "text-yellow-400",
    red: "text-red-400",
    green: "text-green-400",
    blue: "text-blue-400",
  };

  const TEST_DESCRIPTION = "This is a [gold]formatted[/gold] description with [red]multiple[/red] tags and [green]colors[/green].";

  function parseFormattedText(text: string): React.ReactNode {
    const stack: { tag: string; children: React.ReactNode[] }[] = [];
    const root: React.ReactNode[] = [];

    const regex = /\[(\/?)(\w+)\]/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [full, closing, tag] = match;

      // Push text before this tag
      const content = text.slice(lastIndex, match.index);
      if (content) {
        (stack[stack.length - 1]?.children ?? root).push(content);
      }

      if (!closing) {
        // Opening tag
        stack.push({ tag, children: [] });
      } else {
        // Closing tag
        const node = stack.pop();

        if (node) {
          const element = (
            <span
              key={match.index}
              className={TAG_STYLES[node.tag] || ""}
            >
              {node.children}
            </span>
          );

          (stack[stack.length - 1]?.children ?? root).push(element);
        }
      }

      lastIndex = match.index + full.length;
    }

    // Remaining text
    if (lastIndex < text.length) {
      (stack[stack.length - 1]?.children ?? root).push(
        text.slice(lastIndex)
      );
    }

    return root;
  }*/

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
    <div className=" bg-panel-background border border-panel-border rounded-lg p-4 h-auto min-h-0 ">
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
          ${classColor}
          ${rarityBorder}
        `}
      >
        {/* card name */}
        <span className="text-white font-bold 2xl:text-4xl xl:text-3xl text-2xl">{card?.name || "Placeholder Name"}</span>

        {/* card image */}
        <div className='w-full flex flex-col items-center'>
          <ImageWithSpinner imageUrl={BASE_IMAGE_URL + card?.image_url} />
          {/*<img src={imageUrl || "https://via.placeholder.com/150"} alt="Card Image" className="aspect-2/1 object-cover rounded-md" />*/}
          {/*<span className='text-white'>{imageUrl}</span>*/}
        </div>

        {/* card cost badge */}
        <Badge 
          className={`
            bg-gray-950 
            text-lg 
            text-white 
            border 
            ${rarityBorder}
            border-2 
            absolute 
            -top-4
            -right-4.5
            rounded-full 
            p-1 
            w-8 
            h-8 
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
            bg-gradient-to-r
            from-sky-900
            to-sky-700
            text-lg 
            text-white 
            border 
            ${rarityBorder}
            rounded-none
            border-2 
            absolute 
            top-6
            -right-4
            p-1 
            w-7 
            h-7 
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
          <p className="text-white text-sm text-center">
            {card?.description && renderText(card?.description) || "This is a placeholder description for the card. It provides details about the card's abilities and effects."}
          </p>
          {/* card keywords */}
          <div className='flex gap-2 mt-1'>
            {card?.keywords && card?.keywords.length > 0 && (
              card?.keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  className="
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
                  "
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