import { CharacterWLData } from "./profileData"

/**
 * Enemies data retrieved from the Spire Codex API.
 */
export type EnemiesData = {
  id: string
  name: string
  type: "Normal" | "Elite" | "Boss"
  min_hp: number
  max_hp: number
  min_hp_ascension: number
  max_hp_ascension: number
  moves: EnemyMove[]
  damage_values: Record<string, {
    normal: number
    ascension: number
    hit_count: number | null
  }>
  block_values: Record<string, {
    normal: number
    ascension: number
  }> | null
  encounters: EnemyEncounters[] | null
  innate_powers: unknown[] | null
  attack_pattern: EnemyAttackPattern
}

type EnemyMove = {
  id: string
  name: string
  intent: string
  damage: {
    normal: number
    ascension: number
    hit_count: number | null
  }
  block: number | null
  heal: number | null
  powers: unknown | null
}

type EnemyEncounters = {
  encounter_id: string
  encounter_name: string
  room_type: string
  act: string
  is_weak: boolean
}

type EnemyAttackPattern = {
  type: string
  initial_move: string
  states: EnemyAttackPatternState[]
  description: string
}

type EnemyAttackPatternState = {
  id: string
  type: string
  move_id: string
  must_perform_once: boolean | null
  next: string
  branches: unknown | null
}

/**
 * Data structure representing a row in the enemy table, including enemy details and statistics.
 */
export type EnemyTableRowData = {
  id: string
  name: string
  type: "Normal" | "Elite" | "Boss"
  icon: string | null // image url
  acts: number[]
  totalTimesEncountered: number | null
  totalTimesKilled: number | null
  totalTimesDiedTo: number | null
  fightStats: CharacterWLData[]
}