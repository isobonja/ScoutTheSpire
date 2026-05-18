import { AssetCategory } from "./types/images";

export const SPIRE_CODEX_BASE_URL = "https://www.spire-codex.com"
export const SPIRE_CODEX_API_URL = "https://www.spire-codex.com/api"
export const SPIRE_CODEX_RATE_LIMIT = 1000 // 1 req per second

// Tracks categories of necessary image assets from spire-codex's `/api/images`
//
// `eager`: If true, images in category are cached on app startup. If false, 
//   images are retrieved from the external link when necessary
// 'excludedFiles': List of file names of specific assets from groups in 
//   REQUIRED_IMAGE_ASSET_CATEGORIES that should NOT be cached and/or are not 
//   used in the app.

// excludedFiles should be switched to Set if large amounts of exclusions
//   (O(1) lookup)
export const IMAGE_ASSET_CONFIG: Record<
  AssetCategory,
  { eager: boolean, excludedFiles: string[] }
> = {
  badges: {
    eager: true,
    excludedFiles: []
  },

  backgrounds: {
    eager: true,
    excludedFiles: [
      "main_menu.png",
      "main_menu_bg.png",
      "merchant.png",
      "relic_inspect_frame.png",
      "relic_inspect_inner.png",
      "reward_panel.png",
      "sts2_logo.png",
    ]
  },
};

