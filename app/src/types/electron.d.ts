export {};

import type { ProfileSaveData } from "../../shared/types/profileData";
import type { BadgeData } from "../../shared/types/badges";

declare global {
  interface Window {
    api: {
      readProfileSave: () => Promise<ProfileSaveData | null>;
      fetchBadgeData: () => Promise<BadgeData[]>;
      getSteamAvatarURL: () => Promise<string | null>;
    };
  }
}