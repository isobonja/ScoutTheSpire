export type EncounterData = {
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