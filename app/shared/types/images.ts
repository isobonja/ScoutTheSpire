/**
 * Categories of image data retrieved from the Spire Codex API
 */
export type ImageFileCategory = {
  id: string
  name: string
  count: number
  images: ImageFileData[]
  formats: string[]
}

export type ImageFileData = {
  filename: string
  url: string
}

/**
 * Categories of image assets used in the application.
 */
export type AssetCategory =
  | "badges"
  | "backgrounds";