import { createRequire } from 'module'
import { CharacterBadgeData } from './badges'

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
  encounter_stats: EncounterStats[]
  enemy_stats: EnemyStats[]
  epochs: Epoch[]
  floors_climbed: number
  max_multiplayer_ascension: number
  preferred_multiplayer_ascension: number
  total_playtime: number
  wongo_points: number
}

type AncientStats = {
  ancient_id: string
  character_stats: {
    character: string
    losses: number
    wins: number
  }[]
}

type CardStats = {
  id: string
  times_lost: number
  times_picked: number
  times_skipped: number
  times_won: number
}

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

type EncounterStats = {
  encounter_id: string
  fight_stats: {
    character: string
    losses: number
    wins: number
  }[]
}

type EnemyStats = {
  enemy_id: string
  fight_stats: {
    character: string
    losses: number
    wins: number
  }[]
}

type Epoch = {
  id: string
  obtain_date: number
  state: 'revealed' | 'hidden'
}