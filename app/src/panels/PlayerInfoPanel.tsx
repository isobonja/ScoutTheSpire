import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { capitalize, formatSecondsToHMS } from "@/utils/general";
import { CHARACTER_COLORS, CHARACTER_ICONS, CHARACTER_RESTS, CHARACTERS } from "@/constants/characters";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProfileSaveData } from "shared/types/profileData";
import CharacterInfoBox from "@/components/CharacterInfoBox";
import { BadgeData, CharacterBadgeInfoFull } from "shared/types/badges";
import AncientInfoBox from "@/components/AncientInfoBox";
import { AssetCategory, ImageFileCategory } from "shared/types/images";
import { Separator } from "@/components/ui/separator";

const PANEL_ASSET_CATEGORIES: AssetCategory[] = [
  "badges",
  "backgrounds"
]

type PlayerInfoPanelProps = {
  active: boolean;
  profileData?: ProfileSaveData | null;
}

function PlayerInfoPanel(
  { active, profileData }: PlayerInfoPanelProps
) {
  const [badgeData, setBadgeData] = useState<BadgeData[]>([]);
  const [steamAvatarURL, setSteamAvatarURL] = useState<string | null>(null);
  const [assetCategories, setAssetCategories] =
    useState<
      Partial<
        Record<
          AssetCategory,
          ImageFileCategory
        >
      >
    >({});

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

    async function fetchBadgeData() {
      try {
        const data = await window.api.fetchBadgeData();
        setBadgeData(data);
      } catch (error) {
        console.error('Error fetching badge data:', error);
      }
    }

    async function fetchSteamAvatar() {
      try {
        const url = await window.api.getSteamAvatarURL();
        if (url) {
          //console.log("PFP URL:", url)
          //const img = new Image();
          //img.src = url;
          setSteamAvatarURL(url);
        }
      } catch (error) {
        console.error('Error fetching Steam avatar:', error);
      }
    }

    async function fetchAssetData() {
      try {
        const res = await Promise.all(
          PANEL_ASSET_CATEGORIES.map(
            async (categoryID) => {
              const data = await window.api.getImageCategoryData(categoryID);
              return [categoryID, data] as const
            }
          )
        )

        setAssetCategories(Object.fromEntries(res))
      } catch (error) {
        console.error('Error fetching asset data:', error);
      }
    }

    fetchBadgeData();
    fetchSteamAvatar();
    fetchAssetData();
  }, [])

  const characterBadges: Record<string, CharacterBadgeInfoFull[]> = useMemo(() => {
    if (!profileData) return {};

    /*
     Each character_stats has list of badges of type CharacterBadgeData
        { count, id, rarity }
    For each character, we want to filter badgeData to only include badges 
    that have been achieved by each character, including the rarities.

    I created a new type CharacterBadgeInfoFull that combines CharacterBadgeData 
    and BadgeData. 

    We will construct a map of character ID to list of CharacterBadgeInfoFull, 
    which will be used to display badge info in the CharacterInfoBox for each 
    character.
    */

    const charBadgeMap: Record<string, CharacterBadgeInfoFull[]> = {};
    CHARACTERS.forEach((char) => {
      const charStats = profileData.character_stats.find((c) => c.id === char.id);
      if (!charStats) {
        charBadgeMap[char.id] = [];
        return;
      }

      const charBadges = charStats.badges.flatMap((cb) => {
        const currBadgeData = badgeData.find((bd) => bd.id === cb.id)
        if (!currBadgeData) {
          return [] 
        }
        const tier = currBadgeData.tiers.find((t) => t.rarity === cb.rarity)
        if (!tier) {
          console.warn("No badge tier")
          return []
        }

        return {
          ...currBadgeData,
          ...cb,
          tier_info: tier,
          description: tier.description, // Override description to be tier-specific
        }
      })
      charBadgeMap[char.id] = charBadges.sort((a, b) => {
        // Sort by ID, then rarity
        if (a.id !== b.id) {
          return a.id.localeCompare(b.id);
        }
        // Bronze < Silver < Gold

        const rarityOrder: Record<string, number> = {
          'bronze': 0,
          'silver': 1,
          'gold': 2
        };
        return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
      });

    });

    return charBadgeMap;
  
  }, [profileData, badgeData]);

  return (
    <div className='h-full' hidden={!active}>
      <ScrollArea className="h-full p-2 pt-0 pe-4">
        {/* Overall Stats */}
        <div className="space-y-2 info-panel p-4 mb-4 mt-4">
          <div className='flex gap-8'>
            {steamAvatarURL && 
              <div className='border border-white'>
                <img src={steamAvatarURL} alt="Steam PFP" />
              </div>
            }
            <div className='flex-1'>
              <h1 className='text-4xl text-orange-300 font-extrabold font-heading -ms-2'>Overall Stats</h1>
              <p className='font-mono'>Architect Damage: {profileData?.architect_damage}</p>
              <p className='font-mono'>Floors Climbed: {profileData?.floors_climbed}</p>
              <p className='font-mono'>Total Playtime: {formatSecondsToHMS(profileData?.total_playtime ?? 0)}</p>
              <p className='font-mono'>Wongo Points: {profileData?.wongo_points}</p>
              <p className='font-mono'>
                W/L Ratio: 
                <span className='text-green-500'>{' ' + totalWinLoss.wins}</span>
                /
                <span className='text-red-500'>{totalWinLoss.losses}</span>
              </p>
            </div>
          </div>
          
        </div>
        
        <Separator className='bg-slate-500 mask-x-from-90% mask-x-to-95% mb-4' />

        {/* Character Stats */}
        <Tabs defaultValue={CHARACTERS[0].id} className="w-full h-full pb-2 mb-2">
          <TabsList className='bg-transparent p-0 h-auto gap-2 mb-0 ps-4'>
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
                {/* Should consider maybe moving icons to backend cache instead of frontend assets */}
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
                mt-0!
                relative
              `}
            >
              <CharacterInfoBox 
                character={char} 
                info={profileData?.character_stats.find((c) => c.id === char.id) || null} 
                badgesInfo={characterBadges[char.id]}
                badgeImages={assetCategories.badges || null}
              />
            </TabsContent>
          ))}
        </Tabs>

        <Separator className='bg-slate-500 mask-x-from-90% mask-x-to-95% mb-4' />

        {/* Ancient Stats */}
        <AncientInfoBox 
          ancient_stats={profileData?.ancient_stats || null} 
          steamAvatarURL={steamAvatarURL || ""}
          ancientsBackgroundImageData={assetCategories.backgrounds || null}
        />

        <ScrollBar orientation="vertical" className='w-16 bg-scrollbar-bg' />
      </ScrollArea>
    </div>
  )
}

export default PlayerInfoPanel;