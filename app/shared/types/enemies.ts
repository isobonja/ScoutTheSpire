/*
{
    "id": "BYRDONIS",
    "name": "Byrdonis",
    "type": "Elite",
    "min_hp": 81,
    "max_hp": 84,
    "min_hp_ascension": 90,
    "max_hp_ascension": 90,
    "moves": [
      {
        "id": "PECK",
        "name": "Peck",
        "intent": "Attack",
        "damage": {
          "normal": 3,
          "ascension": 4,
          "hit_count": 3
        },
        "block": null,
        "heal": null,
        "powers": null
      },
      {
        "id": "SWOOP",
        "name": "Swoop",
        "intent": "Attack",
        "damage": {
          "normal": 17,
          "ascension": 19,
          "hit_count": null
        },
        "block": null,
        "heal": null,
        "powers": null
      }
    ],
    "damage_values": {
      "Peck": {
        "normal": 3,
        "ascension": 4,
        "hit_count": 3
      },
      "Swoop": {
        "normal": 17,
        "ascension": 19,
        "hit_count": null
      }
    },
    "block_values": null,
    "encounters": [
      {
        "encounter_id": "BYRDONIS_ELITE",
        "encounter_name": "Byrdonis",
        "room_type": "Elite",
        "act": "Act 1 - Overgrowth",
        "is_weak": false
      }
    ],
    "innate_powers": null,
    "attack_pattern": {
      "type": "cycle",
      "initial_move": "SWOOP",
      "states": [
        {
          "id": "PECK_MOVE",
          "type": "move",
          "move_id": "PECK",
          "must_perform_once": null,
          "next": "SWOOP_MOVE",
          "branches": null
        },
        {
          "id": "SWOOP_MOVE",
          "type": "move",
          "move_id": "SWOOP",
          "must_perform_once": null,
          "next": "PECK_MOVE",
          "branches": null
        }
      ],
      "description": "Swoop → Peck → repeat"
    },
    "image_url": "/static/images/monsters/byrdonis.webp",
    "beta_image_url": null
  }
    */

import { CharacterWLData } from "./profileData"

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