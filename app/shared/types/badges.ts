/**
 * Badge info retrieved from the Spire Codex API.
 */
export type BadgeData = {
  id: string
  name: string
  description: string
  tiered: boolean
  tiers: BadgeTier[]
  requires_win: boolean
  multiplayer_only: boolean
}

export type BadgeTier = {
  rarity: string
  title: string
  description: string
}

/**
 * The player's badge data for each character, including the 
 * count of each badge they have earned.
 */
export type CharacterBadgeData = {
  count: number
  id: string
  rarity: string
}

/**
 * Full information about a character's badge, including details and tier information.
 * Primarily used for displaying badge information in the UI.
 */
export type CharacterBadgeInfoFull = {
  id: string
  name: string
  description: string
  tiered: boolean
  rarity: string
  tier_info: BadgeTier
  multiplayer_only: boolean
  count: number
}