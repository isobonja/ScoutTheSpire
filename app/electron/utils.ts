import { IMAGE_ASSET_CONFIG } from "../shared/constants";
import { AssetCategory } from "../shared/types/images";
import Registry from "winreg";

/**
 * Retrieves the path to the Steam installation directory.
 * 
 * @returns A promise resolving to the Steam path or null if not found.
 */
export function getSteamPath(): Promise<string | null> {
  return new Promise((resolve) => {
    const regKey = new Registry({
      hive: Registry.HKCU,
      key: "\\Software\\Valve\\Steam",
    });

    regKey.get("SteamPath", (err, item) => {
      if (err || !item) {
        resolve(null);
        return;
      }

      resolve(item.value);
    });
  });
}

/**
 * Checks if the given ID corresponds to a required asset category.
 * 
 * @param id The ID to check.
 * @returns A boolean indicating whether the ID corresponds to a required asset category.
 */
export function isRequiredAssetCategory(
  id: string
): id is AssetCategory {
  return id in IMAGE_ASSET_CONFIG;
}