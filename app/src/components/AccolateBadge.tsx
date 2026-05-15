import type { CharacterBadgeInfoFull } from "shared/types/badges";
import BadgeBronze from "@/assets/badges/badge_bronze.svg?react";
import BadgeSilver from "@/assets/badges/badge_silver.svg?react";
import BadgeGold from "@/assets/badges/badge_gold.svg?react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { capitalize, resolveSTSTextColorFormatTag } from "@/utils/general";


type AccolateBadgeProps = {
  badge: CharacterBadgeInfoFull;
};

function AccolateBadge({ badge }: AccolateBadgeProps) {

  // IMPLEMENT HOVERCARD

  // Change rarity colors to be border of SVG, not fill
  return (
    <HoverCard openDelay={100} closeDelay={20}> 
      <HoverCardTrigger>
        <div className='bg-transparent aspect-square w-14 relative hover:scale-110'>
          <div className='items-center justify-center flex w-full h-full z-1'>
            <img src={badge.image_url} alt={badge.name} className='w-[60%] h-[60%] object-contain z-1' />
          </div>
          
          {badge.rarity === 'bronze' && <BadgeBronze stroke={badge.tiered ? "brown" : "grey"} fill="black" className='absolute inset-0 w-full h-full z-0 ' />}
          {badge.rarity === 'silver' && <BadgeSilver stroke="silver" fill="black" className='absolute inset-0 w-full h-full z-0 -top-1' />}
          {badge.rarity === 'gold' && <BadgeGold stroke="gold" fill="black" className='absolute inset-0 w-full h-full z-0 -top-1 ' />}

          <div className='absolute top-0 right-0 bg-gray-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10 border border-white'>
            {badge.count}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className='p-2 w-full bg-gray-800 text-white rounded-md shadow-lg'>
          <div className='flex justify-between'>
            <h3 className='text-md font-semibold mb-1'>{badge.name}</h3>
            <span className='text-sm italic text-gray-400'>{badge.tiered && capitalize(badge.rarity)}</span>
          </div>
          
          <p className='text-sm text-gray-300'>{resolveSTSTextColorFormatTag(badge.description)}</p>
          <p className='text-xs text-gray-500 mt-1 italic'>
            {badge.multiplayer_only && "Multiplayer Only"}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
    
  );
}

export default AccolateBadge;