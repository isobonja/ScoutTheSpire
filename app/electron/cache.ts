import axios from "axios";
import fs from "fs";
import path from "path";
import { app } from "electron";
import type { BadgeData } from "shared/types/badges";
import { SPIRE_CODEX_BASE_URL } from "../shared/constants";
import { ImageFileCategory } from "shared/types/images";
import { fetchImagesJSON } from "./requests";

const IMAGE_JSON_REFRESH_TIME = 1000 * 60 * 60 // 1 hr

export async function cacheImageJSON() {
  const dataCachePath = path.join(
    app.getPath('userData'),
    "data_cache"
  )

  await ensureCache(dataCachePath)

  const metaPath = path.join(dataCachePath, "images.meta.json")

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    const lastModified = meta.last_modified
    if (lastModified && Date.now() - lastModified <= IMAGE_JSON_REFRESH_TIME)  {
      return JSON.parse(
        fs.readFileSync(
          path.join(dataCachePath, "images.json"),
          "utf-8"
        )
      );
    }
  }

  try {
    const res = await fetchImagesJSON();

    fs.writeFileSync(
      path.join(dataCachePath, "images.json"),
      JSON.stringify(res, null, 2),
      "utf-8"
    )

    const metadata = JSON.stringify({ last_modified: Date.now() })
    fs.writeFileSync(metaPath, metadata, "utf-8")

    return res
  } catch (err) {
    console.error("Failed to retrieve image data:", err)
  }
}


export async function ensureCache(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}


/*
  I could remove this and replace it with a generic function for any assets, 
  but I would need to do pre-processing to make sure all params sent into the 
  generic function are the same types for every asset.

  Currently this function uses results from `/api/badges/`, but I could also 
  get the images for the badges from `/api/images/`, which is the route to 
  get all image assets from the game. 

  I'd need to change the cachedBadgeData var and the ipc handler in main.ts, 
  I would need to make an ipc handler func specifically for retrieving image 
  paths. Id have it accept a parameter to determine the category of images to 
  return. 

  Make a separate git branch for an attempt at implementing this.

*/
export async function cacheAllBadgeImages(
  badges: BadgeData[]
) {
  const badgeCacheDir = path.join(
    app.getPath("userData"),
    "asset_cache",
    "badges"
  );

  await ensureCache(badgeCacheDir);

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
          image_url: `asset://badges/${badge.id}${ext}`,
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

export async function cacheBackgroundImages(
  bi: ImageFileCategory
) {
  const bgCacheDir = path.join(
    app.getPath("userData"),
    "asset_cache",
    "backgrounds"
  );

  await ensureCache(bgCacheDir);

  return Promise.all(
    bi.images.map(async (ifd) => {
      try {
        const imgUrl = `${SPIRE_CODEX_BASE_URL}${ifd.url}`;
        //console.log(`Caching badge ${badge.id} from ${imgUrl}`);
        const ext =
          path.extname(imgUrl) || ".png";

        const localPath = path.join(
          bgCacheDir,
          `${ifd.filename}`
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
          ...ifd,
          url: `asset://backgrounds/${ifd.filename}`,
        };
      } catch (err) {
        console.error(
          `Failed caching ${ifd.filename}`,
          err
        );

        return ifd;
      }
    })
  );
}