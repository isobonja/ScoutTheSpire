import axios from "axios";
import fs from "fs";
import path from "path";
import { app } from "electron";
import type { BadgeData } from "shared/types/badges";
import { SPIRE_CODEX_BASE_URL } from "../shared/constants";

export async function ensureBadgeCache(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function cacheAllBadgeImages(
  badges: BadgeData[]
) {
  const badgeCacheDir = path.join(
    app.getPath("userData"),
    "cache",
    "badges"
  );

  await ensureBadgeCache(badgeCacheDir);

  return Promise.all(
    badges.map(async (badge) => {
      try {
        const imgUrl = `${SPIRE_CODEX_BASE_URL}${badge.image_url}`;
        //console.log(`Caching badge ${badge.id} from ${imgUrl}`);
        const ext =
          path.extname(imgUrl) || ".png";

        const localPath = path.join(
          badgeCacheDir,
          `${badge.id}${ext}`
        );

        // Download only once
        if (!fs.existsSync(localPath)) {
          const response = await axios.get(
            imgUrl,
            {
              responseType: "arraybuffer",
            }
          );

          fs.writeFileSync(
            localPath,
            response.data
          );
        }

        return {
          ...badge,
          image_url: `badge:///${badge.id}${ext}`,
        };
      } catch (err) {
        console.error(
          `Failed caching ${badge.id}`,
          err
        );

        return badge;
      }
    })
  );
}