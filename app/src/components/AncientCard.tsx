import { Card, CardContent } from '@/components/ui/card'
import AncientStatsCard from './AncientStatsCard';
import { CHARACTER_COLORS, CHARACTER_ICONS } from '@/constants/characters';
import { extractNameFromSTSID } from '@/utils/general';
import type { AncientStats } from 'shared/types/profileData';
import { useLayoutEffect, useRef, useState } from 'react';
import { ANCIENT_BG_FOCAL_POINTS } from '@/constants/ancients';

type AncientCardProps = {
  as: AncientStats;
  bgURL: string;
  steamAvatarURL: string;
  totalWinsLosses: { wins: number, losses: number };

}

function AncientCard({ as, bgURL, steamAvatarURL, totalWinsLosses }: AncientCardProps) {

  const cardRef = useRef<HTMLDivElement | null>(null);
  const nameplateRef = useRef<HTMLDivElement | null>(null);

  const [bgPosition, setBgPosition] = useState<string>("0px 0px");

  useLayoutEffect(() => {
    function updateBGPosition() {
      if (
        !cardRef.current ||
        !nameplateRef.current
      ) {
        return;
      }

      const containerRect =
        cardRef.current
          .getBoundingClientRect();

      const labelRect =
        nameplateRef.current
          .getBoundingClientRect();

      const labelCenterX =
        labelRect.left +
        labelRect.width / 2;

      const localX = labelCenterX - containerRect.left // px
      const localY = containerRect.height / 2 // px

      const focalX = ANCIENT_BG_FOCAL_POINTS[as.ancient_id].focalX // px
      const focalY = ANCIENT_BG_FOCAL_POINTS[as.ancient_id].focalY // px

      const bgPosX = localX - focalX
      const bgPosY = localY - focalY

      const newPos =
        `${bgPosX}px ${bgPosY}px`;

      console.log({
        localX,
        localY,
        bgPosX,
        bgPosY,
        newPos
      });

      setBgPosition((prev) =>
        prev === newPos
          ? prev
          : newPos
      );

    }

    const observer =
      new ResizeObserver(
        updateBGPosition
      );

    if (cardRef.current) {
      observer.observe(
        cardRef.current
      );
    }

    window.addEventListener(
      "resize",
      updateBGPosition
    );

    updateBGPosition();

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateBGPosition
      );
    };

  }, [])

  return (
    <div ref={cardRef} className='relative overflow-hidden h-120 grow-0 min-w-0'>
      <Card className='h-full'>
        {/* Background image */}
        <div
          className="
            absolute inset-0
            bg-no-repeat
            mask-r-from-60% mask-r-to-90%
          "
          style={{
            backgroundImage: `url(${bgURL})`,
            backgroundPosition: bgPosition,
          }}
        />
        
        <CardContent className="flex items-start justify-start p-2 pe-8 z-1 h-full ">
          {/* Nameplate */}
          <div 
            ref={nameplateRef}
            className='
              flex-5 
              break-all 
              text-center 
              relative
            '
            style= {{ fontFamily: "fangsong" }}
          >
            <div className='relative flex items-center justify-center w-full h-16 text-center overflow-visible select-none'>
              <span className='
                opacity-60
                absolute 
                text-6xl 
                text-transparent
                font-extrabold 
                text-center 
                italic 
                text-shadow-sm
                text-shadow-blue-100
                z-20
              '>
                {extractNameFromSTSID(as.ancient_id)}
              </span>
              <span className='
                absolute 
                px-4
                text-6xl 
                text-gray-300 
                font-extrabold 
                text-center 
                italic 
                text-shadow-md 
                text-shadow-amber-300 
                mask-clip-border
                mask-b-from-60% mask-b-to-90% 
                z-20
                overflow-visible
              '>
                {extractNameFromSTSID(as.ancient_id)}
              </span>
            </div>
            
            <div className='
              absolute 
              top-0
              w-full
              h-[120%]
              bg-black/80 
              mask-y-from-70% mask-y-to-95%
              mask-x-from-70% mask-x-to-95%
              z-10
              drop-shadow-sm drop-shadow-red-700/40
            '/>
            
          </div>
          
          <Card className='flex-7 h-full opacity-80 p-4 min-w-0 rounded-4xl!'>
            <div className='grid grid-cols-2 grid-rows-3 h-full gap-4'>
              {/* Each ancient gets 6 cards made here... maybe it would be better to somehow 
              reuse the same 6 cards for every ancient? */}
              <AncientStatsCard 
                title={'Overall'}
                image={steamAvatarURL}
                wins={totalWinsLosses.wins}
                losses={totalWinsLosses.losses}
                bg="bg-gray-700"
              />
              
              {as.character_stats.map((cs) => (
                <AncientStatsCard
                  key={cs.character}
                  title={extractNameFromSTSID(cs.character)}
                  image={CHARACTER_ICONS[cs.character]}
                  wins={cs.wins}
                  losses={cs.losses}
                  bg={CHARACTER_COLORS[cs.character].dark.bg}
                />
              ))}
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default AncientCard;