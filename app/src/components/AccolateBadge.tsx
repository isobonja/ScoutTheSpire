import type { CharacterBadgeInfoFull } from "shared/types/badges";
import BadgeBronze from "@/assets/badges/badge_bronze.svg?react";
import BadgeSilver from "@/assets/badges/badge_silver.svg?react";
import BadgeGold from "@/assets/badges/badge_gold.svg?react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


type AccolateBadgeProps = {
  badge: CharacterBadgeInfoFull;
};

function AccolateBadge({ badge }: AccolateBadgeProps) {

  // IMPLEMENT HOVERCARD
  return (
    
    <div className='bg-transparent aspect-square w-14 relative hover:scale-110'>
      <div className='items-center justify-center flex w-full h-full z-1'>
        <img src={badge.image_url} alt={badge.name} className='w-[60%] h-[60%] object-contain z-1' />
      </div>
      
      {badge.rarity === 'bronze' && <BadgeBronze fill="brown" className='absolute inset-0 w-full h-full z-0 -top-1' />}
      {badge.rarity === 'silver' && <BadgeSilver fill="silver" className='absolute inset-0 w-full h-full z-0 -top-1' />}
      {badge.rarity === 'gold' && <BadgeGold fill="gold" className='absolute inset-0 w-full h-full z-0 -top-1 ' />}
    </div>
  );
}

export default AccolateBadge;