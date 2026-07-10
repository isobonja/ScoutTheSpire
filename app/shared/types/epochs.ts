/**
 * Epochs data retrieved from the Spire Codex API.
 */
export type EpochsData = {
  id: string
  slug: string
  title: string
  description: string
  era: string
  era_name: string
  era_year: string
  era_position: number
  sort_order: number
  story_id: string
  unlock_info: string
  unlock_text: string | null 
  unlocks_cards: string[]
  unlocks_relics: string[]
  unlocks_potions: string[]
  expands_timeline: string[]
}

// 'era' determines columns; if two epochs have the same era, 
//   they will be in the same column. 
// use 'sort_order' to determine vertical order within the column.

// I could refer to epochs by either 'id' or 'stug'; 
//   'id' isn't really obvious so maybe 'stug' is better in this case

// The description will need some parsing to be displayed nicely. 
// It can contain custom formatting tags.

// I don't know if 'era_name', 'era_year', or 'story_id' are necessary.

// 'expands_timeline' contains ids of epochs that are revealed after this 
//  epoch is unlocked. I could add some lines connecting these to their 
//  "parent" epoch in the timeline graphic.

/**
 * The player's epoch data combined with the full epoch data.
 */
export type PlayerEpochDataFull = {
  obtain_date: number
  state: 'revealed' | 'hidden'
  title: string
  description: string
  unlock_info: string
  unlock_text: string | null
  unlock_type: EpochUnlockType
  unlocks: string[]
  revealed_epochs: string[]
}

export type EpochUnlockType = 'card' | 'relic' | 'potion' | 'other';