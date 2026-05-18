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
import { useMemo } from "react"
import AncientStatsCard from "./AncientStatsCard"
import { CHARACTER_COLORS, CHARACTER_ICONS } from "@/constants/characters"
import { ImageFileCategory } from "shared/types/images"
import { ANCIENT_BG_LAYOUT_VALUES } from "@/constants/ancients"

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
    <div className="info-panel p-4 mb-4 w-full space-y-2">
      <h1 className='text-4xl text-orange-300 font-extrabold font-heading'>Ancients</h1>
      <div className='overflow-hidden rounded-xl p-0 m-0'>
        <Carousel 
          className='w-full items-center max-w-full relative m-0 p-0'
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {ancient_stats && ancient_stats.map((as) => {
              const bgConfig = ANCIENT_BG_LAYOUT_VALUES[as.ancient_id]
              return <CarouselItem key={as.ancient_id}>
                <Card className='relative overflow-hidden h-120  grow-0 min-w-0'>
                  {/* Background image */}
                  <div
                    className="
                      absolute inset-0
                      bg-no-repeat
                    "
                    style={{
                      backgroundImage: `url(${ancientToImageURLMap[as.ancient_id]})`,
                      backgroundSize: bgConfig.backgroundSize,
                      backgroundPosition: bgConfig.backgroundPosition,
                    }}
                  />

                  {/*<CardContent className='relative z-10 min-w-0'>
                    <span className='text-3xl font-semibold break-all'>
                      {"test23fefefefefefe"}
                    </span>
                  </CardContent>*/}

                  
                  <CardContent className="flex items-start justify-start p-2 pe-8 z-1 h-full">
                    <div className='flex-5 text-3xl font-semibold break-all text-center'>
                      {extractNameFromSTSID(as.ancient_id)}
                    </div>
                    
                    <Card className='flex-7 h-full opacity-80 p-4 min-w-0 rounded-4xl!'>
                      <div className='grid grid-cols-2 grid-rows-3 h-full gap-4'>
                        {/* Each ancient gets 6 cards made here... maybe it would be better to somehow 
                        reuse the same 6 cards for every ancient? */}
                        <AncientStatsCard 
                          title={'Overall'}
                          image={steamAvatarURL}
                          wins={totalWinsLosses[as.ancient_id].wins}
                          losses={totalWinsLosses[as.ancient_id].losses}
                          bg="bg-gray-700"
                        />
                        
                        {as.character_stats.map((cs) => (
                          <AncientStatsCard
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