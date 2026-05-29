import type { CharacterWLData } from "./profileData"

export type EncountersData = {
  id: string
  name: string
  room_type: string
  is_weak: boolean
  act: string | null
  tags: string[] | null
  monsters: {
    id: string
    name: string
  }[]
  loss_text: string
}

export type EncounterTableRowData = {
  id: string
  name: string
  type: "Monster" | "Elite" | "Boss"
  act: number
  totalTimesEncountered: number | null
  totalTimesWon: number | null
  totalTimesLost: number | null
  fightStats: CharacterWLData[]
}