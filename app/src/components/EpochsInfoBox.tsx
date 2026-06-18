import EpochTimelineBox from "./EpochTimelineBox";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type { EpochsData, EpochUnlockType, PlayerEpochDataFull } from '../../shared/types/epochs';
import { useState, useEffect, useMemo } from "react";
import type { PlayerEpochData } from "../../shared/types/profileData";

type EpochsInfoBoxProps= {
  epochsStats: PlayerEpochData[] | null
}

function EpochsInfoBox({ epochsStats }: EpochsInfoBoxProps) {

  const [epochsData, setEpochsData] = useState<EpochsData[]>([]);

  const epochDataFullMap: Record<string, PlayerEpochDataFull> = useMemo(() => {
    if (!epochsStats || !epochsData) return {};

    const map: Record<string, PlayerEpochDataFull> = {}

    epochsData.forEach((epoch) => {
      const epochPlayerStat = epochsStats.find((e) => e.id === epoch.id);

      let unlock_type: EpochUnlockType = 'other'
      let unlocks: string[] = []

      // maybe copy values instead of reassigning unlocks
      if (epoch.unlocks_cards.length > 0) {
        unlock_type = 'card';
        unlocks = epoch.unlocks_cards
      } else if (epoch.unlocks_relics.length > 0) {
        unlock_type = 'relic';
        unlocks = epoch.unlocks_relics
      } else if (epoch.unlocks_potions.length > 0) {
        unlock_type = 'potion';
        unlocks = epoch.unlocks_potions
      } 


      map[epoch.id] = {
        obtain_date: epochPlayerStat?.obtain_date || 0,
        state: epochPlayerStat?.state || 'hidden',
        title: epoch.title || "PLACEHOLDER",
        description: epoch.description,
        unlock_info: epoch.unlock_info,
        unlock_text: epoch.unlock_text,
        unlock_type: unlock_type,
        unlocks: unlocks,
        revealed_epochs: epoch.expands_timeline
      }
      
    })

    return map;
  }, [epochsData, epochsStats])

  // not sure if memo is necessary here
  const epochEras: Record<string, string[]> = useMemo(() => {
    const eraToEpochsMap: Record<string, string[]> = {}

    let currentEra: string = ''
    let currentEraEpochs: string[] = []
    epochsData.forEach((e) => {
      if (currentEra === '' || e.era !== currentEra) {
        eraToEpochsMap[currentEra] = currentEraEpochs
        currentEra = e.era
        currentEraEpochs = []
      }

      currentEraEpochs.push(e.id)
    })

    return eraToEpochsMap;
  }, [epochsData])

  useEffect(() => {
    async function fetchData() {
      try {
        const epochs = await window.api.fetchEpochsData();
        setEpochsData(epochs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [])

  return (
    <div className={`
        w-full
        min-w-0
        h-190
        overflow-hidden 
        info-panel-colorless
        border-2!
        border-slate-300
        bg-black
        rounded-md
        mt-0!
        relative
      `}
    >
      <h1 className='absolute text-4xl top-4 left-6 text-orange-300 font-extrabold font-heading tracking-wide'>Epochs</h1>
      <div className='flex h-full'>
        <ScrollArea className="w-1 flex-1 h-full pt-16 border border-pink-300 flex flex-col">

          <div className='flex-1 h-full w-max flex gap-2 border border-green-300'>
            {Object.keys(epochEras).map((era) => (
              <div key={era} className='min-h-max align-bottom flex flex-col-reverse gap-2'>
                {epochEras[era].map((epochId) => {
                  const epoch = epochDataFullMap[epochId];

                  return (
                    <EpochTimelineBox
                      id={epochId}
                      title={epoch.title}
                      description={epoch.description}
                      unlock_info={epoch.unlock_info}
                      unlock_text={epoch.unlock_text}
                      unlock_type={epoch.unlock_type}
                      unlocks={epoch.unlocks}
                      revealed_epochs={epoch.revealed_epochs}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          <div className='w-full mt-4 px-6'>
            <div className='bg-slate-200 w-full h-0.5' />
          </div>
          
          <ScrollBar orientation="horizontal" className='hidden' />
        </ScrollArea>
      </div>
    </div>
  )
}

export default EpochsInfoBox;

/*
<div className='w-full h-auto info-panel-colorless border-2 border-slate-500 rounded-md p-4'>
        <h2 className='text-xl font-bold mb-4'>Epochs</h2>
        <p className='text-sm text-gray-300'>
          Epochs information will be displayed here. The plan is to have a timeline graphic 
          similar to the one in-game displaying all of the epochs. The user should be 
          able to scroll horizontally by default. Each epoch should be able to be clicked 
          on to show a popup within this EpochsInfoBox with all info about the epoch, 
          including the description, unlock condition, and rewards. Maybe, in the future, 
          filtering options could be added to display only locked/unlocked epochs, 
          epochs that give card rewards, etc.
        </p>
      </div>
      */