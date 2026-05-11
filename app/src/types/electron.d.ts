export {};

import type { ProfileSaveData } from "../../shared/types/profileData";

declare global {
  interface Window {
    api: {
      readProfileSave: () => Promise<ProfileSaveData | null>;
    };
  }
}