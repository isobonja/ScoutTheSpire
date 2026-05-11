import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { capitalize } from "@/utils/general";
import { CHARACTER_COLORS, CHARACTER_ICONS, CHARACTER_RESTS, CHARACTERS } from "@/constants/characters";
import { useEffect, useMemo } from "react";
import { ProfileSaveData } from "shared/types/profileData";
import CharacterInfoBox from "@/components/CharacterInfoBox";

type PlayerInfoPanelProps = {
  active: boolean;
  profileData?: ProfileSaveData | null;
}

function PlayerInfoPanel(
  { active, profileData }: PlayerInfoPanelProps
) {
  const totalWinLoss = useMemo(() => {
    const res = { wins: 0, losses: 0 };
    if (!profileData) return res;

    profileData.character_stats.forEach((c) => {
      res.wins += c.total_wins || 0;
      res.losses += c.total_losses || 0;
    })
    
    return res;
  }, [profileData]);

  useEffect(() => {
    Object.values(CHARACTER_RESTS).forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <div className='h-full' hidden={!active}>
      <ScrollArea className="h-full p-2">
        

        {/* Character Stats */}
        <Tabs defaultValue={CHARACTERS[0].id} className="w-full h-full pb-2">
          <TabsList className='bg-transparent p-0 h-auto gap-2 mb-0'>
            {Object.values(CHARACTERS).map((char) => (
              <TabsTrigger 
                key={char.id} 
                value={char.id} 
                className={`
                  px-4
                  rounded-b-none
                  ring ring-slate-700
                  text-white!
                  animation-none!
                  bg-slate-600
                  ${CHARACTER_COLORS[char.id]?.tabs.activeBg}
                  data-active:ring-0!
                  data-active:border!
                  ${CHARACTER_COLORS[char.id]?.tabs.border}
                  data-active:border-b-0!
                  data-active:-mb-5.25!
                  data-active:shadow-none!
                  z-10
                  mb-0!
                `}
              >
                <img src={CHARACTER_ICONS[char.id]} alt={char.name} className="w-6 h-6" />
                {capitalize(char.name)}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.values(CHARACTERS).map((char) => (
            <TabsContent 
              key={char.id} 
              value={char.id} 
              className={`
                w-full
                h-full 
                info-panel-colorless
                border-2!
                ${CHARACTER_COLORS[char.id]?.light.border}
                ${CHARACTER_COLORS[char.id]?.dark.bg}
                rounded-md
                rounded-tl-none
                mt-0!
                relative
              `}
            >
              <CharacterInfoBox character={char} info={profileData?.character_stats.find((c) => c.id === char.id)} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Overall Stats */}
        {/*<div className="space-y-2 info-panel p-4 ps-6">
          <h1 className='text-4xl text-orange-300 font-extrabold font-heading -ms-2'>Overall Stats</h1>
          <p className='font-mono'>Architect Damage: {profileData?.architect_damage}</p>
          <p className='font-mono'>Floors Climbed: {profileData?.floors_climbed}</p>
          <p className='font-mono'>Total Playtime: {profileData?.total_playtime}</p>
          <p className='font-mono'>Wongo Points: {profileData?.wongo_points}</p>
          <p className='font-mono'>
            W/L Ratio: 
            <span className='text-green-500'>{' ' + totalWinLoss.wins}</span>
            /
            <span className='text-red-500'>{totalWinLoss.losses}</span>
          </p>
        </div>*/}


        <ScrollBar orientation="vertical" className='w-16 bg-scrollbar-bg' />
      </ScrollArea>
    </div>
  )
}

export default PlayerInfoPanel;