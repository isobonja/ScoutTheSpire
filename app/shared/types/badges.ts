export type BadgeData = {
  id: string
  name: string
  description: string
  tiered: boolean
  tiers: BadgeTier[]
  requires_win: boolean
  multiplayer_only: boolean
  image_url: string
}

export type BadgeTier = {
  rarity: string
  title: string
  description: string
}

export type CharacterBadgeData = {
  count: number
  id: string
  rarity: string
}

// Used for displaying characters' badges
export type CharacterBadgeInfoFull = {
  id: string
  name: string
  description: string
  tiered: boolean
  rarity: string
  tier_info: BadgeTier
  multiplayer_only: boolean
  image_url: string
  count: number
}