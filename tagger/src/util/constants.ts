export const RARITY_COLORS = {
  common: "border-common-rarity",
  uncommon: "border-uncommon-rarity",
  rare: "border-rare-rarity",
  ancient: "border-ancient-rarity",
  event: "border-event-rarity",
} as const;

export type Rarity = keyof typeof RARITY_COLORS;


export const CLASS_COLORS = {
  ironclad: "bg-ironclad",
  defect: "bg-defect",
  silent: "bg-silent",
  regent: "bg-regent",
  necrobinder: "bg-necrobinder",
  colorless: "bg-colorless",
} as const;

export type CardClass = keyof typeof CLASS_COLORS;