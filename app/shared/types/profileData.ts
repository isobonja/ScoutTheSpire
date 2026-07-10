import { CharacterID } from '@/types/general'
import { CharacterBadgeData } from './badges'

/**
 * The player's profile save data.
 */
export type ProfileSaveData = {
  ancient_stats: AncientStats[]
  architect_damage: number
  card_stats: CardStats[]
  character_stats: CharacterStats[]
  current_score: number
  discovered_cards: string[]
  discovered_events: string[]
  discovered_potions: string[]
  discovered_relics: string[]
  encounter_stats: EncounterProfileStats[]
  enemy_stats: EnemyProfileStats[]
  epochs: PlayerEpochData[]
  floors_climbed: number
  max_multiplayer_ascension: number
  preferred_multiplayer_ascension: number
  total_playtime: number
  wongo_points: number
}

/**
 * Player stats pertaining to Ancients.
 */
export type AncientStats = {
  ancient_id: string
  character_stats: {
    character: CharacterID
    losses: number
    wins: number
  }[]
}

/**
 * Player stats pertaining to cards.
 */
type CardStats = {
  id: string
  times_lost: number
  times_picked: number
  times_skipped: number
  times_won: number
}

/**
 * Player stats pertaining to the different in-game playable characters.
 */
export type CharacterStats = {
  badges: CharacterBadgeData[]
  best_win_streak: number
  current_streak: number
  fastest_win_time: number
  id: string
  max_ascension: number
  playtime: number
  preferred_ascension: number
  total_losses: number
  total_wins: number
}

/**
 * Win/Loss data for a character.
 */
export type CharacterWLData = {
  character: CharacterID
  losses: number
  wins: number
}

/**
 * Player stats pertaining to encounters.
 */
export type EncounterProfileStats = {
  encounter_id: string
  fight_stats: CharacterWLData[]
}

/**
 * Player stats pertaining to enemies.
 */
export type EnemyProfileStats = {
  enemy_id: string
  fight_stats: CharacterWLData[]
}

/**
 * Player stats pertaining to epochs.
 */
export type PlayerEpochData = {
  id: string
  obtain_date: number
  state: 'revealed' | 'hidden'
}

/**
 * Overall Ancient data.
 * The profile data does not contain total wins/losses across all characters,
 * so this type is used to represent that data in a more convenient way.
 */
export type AncientStatsOverallData = {
  [key: string]: { wins: number, losses: number}
}