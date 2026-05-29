export {};

import type { ProfileSaveData } from "../../shared/types/profileData";
import type { BadgeData } from "../../shared/types/badges";
import type { ImageFileCategory } from "../../shared/types/images";
import type { EnemiesData } from "../../shared/types/enemies";
import type { EncounterData } from "shared/types/encounters";

declare global {
  interface Window {
    api: {
      readProfileSave: () => Promise<ProfileSaveData | null>;
      fetchBadgeData: () => Promise<BadgeData[]>;
      getSteamAvatarURL: () => Promise<string | null>;
      getImageCategoryData: (categoryID: string) => Promise<ImageFileCategory | null>;
      fetchEnemyData: () => Promise<EnemiesData[]>;
      fetchEncounterData: () => Promise<EncounterData[]>;
    };
  }
}