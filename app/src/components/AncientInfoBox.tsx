import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"

import darv from "@/assets/ancients/darv.png"
import type { AncientStats, AncientStatsOverallData } from "shared/types/profileData"
import { extractNameFromSTSID } from "@/utils/general"
import { Separator } from "./ui/separator"
import { useMemo, useRef } from "react"
import AncientStatsCard from "./AncientStatsCard"
import { CHARACTER_COLORS, CHARACTER_ICONS } from "@/constants/characters"
import { ImageFileCategory } from "shared/types/images"
import { ANCIENT_BG_LAYOUT_VALUES } from "@/constants/ancients"
import AncientCard from "./AncientCard"

type AncientInfoBoxProps = {
  ancient_stats: AncientStats[] | null;
  steamAvatarURL: string;
  ancientsBackgroundImageData: ImageFileCategory | null;
}

function AncientInfoBox({ ancient_stats, steamAvatarURL, ancientsBackgroundImageData }: AncientInfoBoxProps) {




  const ancientToImageURLMap: Record<string, string> = useMemo(() => {
    if (!ancientsBackgroundImageData || !ancient_stats) return {};

    const imageLookup = new Map(
      ancientsBackgroundImageData.images.map((ifd) => [ifd.filename.toLowerCase(), ifd.url])
    );

    return Object.fromEntries(
      ancient_stats.map((as) => {

        const target =
          `${as.ancient_id.toLowerCase().split('.')[1]}.png`;

        return [
          as.ancient_id,
          imageLookup.get(target) ?? "",
        ];
      })
    );
  }, [ancient_stats, ancientsBackgroundImageData])

  const totalWinsLosses: AncientStatsOverallData = useMemo(() => {
    const res: AncientStatsOverallData = {}
    ancient_stats?.forEach((as) => {
      const winsLosses = { wins: 0, losses: 0 }
      as.character_stats.forEach((cs) => {
        winsLosses.wins += cs.wins;
        winsLosses.losses += cs.losses;
      })
      res[as.ancient_id] = winsLosses
    })
    return res;
  }, [ancient_stats])

  return (
    <div 
      className="p-4 mb-4 w-full space-y-2 relative"
    >
      <div className='absolute -m-4 w-full h-full border border-white rounded-xl mask-intersect mask-[var(--hidden-center-y-mask),var(--hidden-center-x-mask)]' />
      <h1 className='text-4xl ms-8 text-orange-300 font-extrabold font-heading tracking-wide'>Ancients</h1>
      <div className='overflow-hidden rounded-xl p-0 pt-1 m-0'>
        <Carousel 
          className='w-full items-center max-w-full relative m-0 p-0 overflow-visible '
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {ancient_stats && ancient_stats.map((as) => {
              const bgConfig = ANCIENT_BG_LAYOUT_VALUES[as.ancient_id]
              return <CarouselItem key={as.ancient_id} className=''>
                <AncientCard
                  key={as.ancient_id}
                  as={as}
                  bgURL={ancientToImageURLMap[as.ancient_id]}
                  steamAvatarURL={steamAvatarURL}
                  totalWinsLosses={totalWinsLosses[as.ancient_id]}
                />
              </CarouselItem>
            })}
          </CarouselContent>
          <CarouselPrevious variant='ghost' className='absolute inset-s-0! h-full active:-translate-y-1/2! active:scale-90! -translate-y-1/2'/>
          <CarouselNext variant='ghost' className='absolute inset-e-0! h-full active:-translate-y-1/2! active:scale-90! -translate-y-1/2' />
        </Carousel>
      </div>
    </div>
  )
}

export default AncientInfoBox;