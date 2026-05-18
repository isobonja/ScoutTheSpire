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

export type AssetCategory =
  | "badges"
  | "backgrounds";