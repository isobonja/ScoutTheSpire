import fs from "fs";
import path from "path";
import { app } from "electron";

import { IMAGE_ASSET_CONFIG, SPIRE_CODEX_BASE_URL } from "../shared/constants";
import { fetchExternalImage, fetchImagesJSON } from "./requests";
import { isRequiredAssetCategory } from "./utils";

import type { ImageFileCategory, ImageFileData } from "shared/types/images";

const IMAGE_JSON_REFRESH_TIME = 1000 * 60 * 60 // 1 hr

const assetCacheDir = path.join(
  app.getPath("userData"),
  "asset_cache"
);

export async function ensureCache(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

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

export async function cacheImage(categoryID: string, ifd: ImageFileData) {
  await ensureCache(path.join(assetCacheDir, categoryID));

  try {
    const imgUrl = `${SPIRE_CODEX_BASE_URL}${ifd.url}`;

    const localPath = path.join(
      assetCacheDir,
      categoryID,
      `${ifd.filename}`
    );

    if (!fs.existsSync(localPath)) {
      const data = await fetchExternalImage(imgUrl)

      fs.writeFileSync(
        localPath,
        data
      );
    }

    return {
      ...ifd,
      url: `asset://${categoryID}/${ifd.filename}`,
    };
  } catch (err) {
    console.error(
      `Failed caching ${ifd.filename}`,
      err
    );

    return ifd;
  }
}

export async function cacheImagesBulk(
  category: ImageFileCategory
) {
  if (!isRequiredAssetCategory(category.id)) {
    return category;
  }

  await ensureCache(path.join(assetCacheDir, category.id));

  const config = IMAGE_ASSET_CONFIG[category.id]

  const images = await Promise.all(
    category.images.map((ifd) => {
      if (config.excludedFiles.includes(ifd.filename)) {
        return ifd;
      }
      return cacheImage(category.id, ifd)
    })
  )

  return { ...category, images }
}