import { CHARACTER_RESTS } from "@/constants/characters";
import type { CharacterID, CharacterName } from "@/types/general";
import { capitalize, formatSecondsToHMS } from "@/utils/general";
import FlameIcon from "@/assets/flame.svg?react";
import type { CharacterStats } from "shared/types/profileData";
import AccolateBadge from "./AccolateBadge";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type { CharacterBadgeInfoFull } from "shared/types/badges";
import { ImageFileCategory } from "shared/types/images";
import { useMemo } from "react";


type CharacterInfoBoxProps = {
  character: {
    id: CharacterID;
    name: CharacterName;
  };
  info: CharacterStats | null;
  badgesInfo: CharacterBadgeInfoFull[];
  badgeImages: ImageFileCategory | null;
};

function CharacterInfoBox({ character, info, badgesInfo, badgeImages }: CharacterInfoBoxProps) {

  const badgeToImageURLMap: Record<string, string> = useMemo(() => {
    if (!badgeImages) return {};

    const imageLookup = new Map(
      badgeImages.images.map((ifd) => [ifd.filename.toLowerCase(), ifd.url])
    );

    return Object.fromEntries(
      badgesInfo.map((bi) => {

        const target =
          `badge_${bi.id.toLowerCase()}.webp`;

        return [
          bi.id,
          imageLookup.get(target) ?? "",
        ];
      })
    );
  }, [badgesInfo, badgeImages])

  const totalRuns = () => {
    if (!info) return 0;
    return info.total_wins + info.total_losses || 0;
  };

  return (
    <div className='space-y-2 p-2'>
      <div className='flex gap-4'>
        {/* Character Image */}
        <div className='flex flex-col gap-2 items-center rounded-lg bg-slate-950 p-2 relative h-80 w-72 shrink-0'>
          <h1 className='text-4xl text-orange-300 font-extrabold font-heading' style= {{ fontFamily: "fangsong" }}>{capitalize(character.name)}</h1>
          <img src={CHARACTER_RESTS[character.id]} alt={character.name} className="max-w-64 max-h-64" />
          {character.id == "CHARACTER.NECROBINDER" && (
            <img src={CHARACTER_RESTS["CHARACTER.OSTY"]} alt="Osty" className="absolute left-2 bottom-0 max-w-32" />
          )}
        </div>

        {/* Character Info */}
        <div className='space-y-2 w-full flex flex-col min-h-0 h-80'>
          <h2 className='text-2xl text-blue-300 font-bold font-heading underline underline-offset-4'>Statistics</h2>
          {/* Character Stats */}
          <div className='grid grid-cols-2 w-full text-xl space-y-2 gap-x-2'>
            <p>
              Total Runs:&nbsp;
              {totalRuns()}&nbsp;
              (
                <span className='text-green-500 font-bold font-mono'>{info?.total_wins} W</span>&nbsp;:&nbsp; 
                <span className='text-red-500 font-bold font-mono'>{info?.total_losses} L</span>
              )
            </p>
            <div className='font-mono'>
              Max Ascension:&nbsp;
              <div className='relative inline'>
                <span className='relative z-10'>{info?.max_ascension}</span>
                {info?.max_ascension == 10 &&
                  <FlameIcon className='absolute inline -left-4.25 -top-6 text-amber-500 fill-amber-700 z-0' />
                }
              </div>
            </div>
            <p className='font-mono'>Total Playtime: {formatSecondsToHMS(info?.playtime ?? 0)}</p>
            <p className='font-mono'>Fastest Win: {formatSecondsToHMS(info?.fastest_win_time ?? 0)}</p>
            <p className='font-mono'>Best Win Streak: {info?.best_win_streak}</p>
            <p className='font-mono'>Current Streak: {info?.current_streak}</p>
          </div>

          {/* Badges */}
          <ScrollArea className='bg-slate-900 rounded-lg p-2 flex-1 min-h-0 overflow-hidden'>
            <h2 className='text-lg font-bold text-blue-300 ps-2 pb-2 underline'>Badges</h2>
            <div className='flex flex-wrap gap-2 overflow-y-visible h-full'>
              {badgesInfo && badgesInfo.map((badge) => (
                <AccolateBadge 
                  key={`${character.id}_${badge.id}_${badge.rarity}`} 
                  badge={badge} 
                  badgeImageURL={badgeToImageURLMap[badge.id]}
                />
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
      
    </div>
  )
}

export default CharacterInfoBox;