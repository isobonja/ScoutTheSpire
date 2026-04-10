export const RARITY_COLORS = {
  common: "border-gray-500",
  uncommon: "border-blue-500",
  rare: "border-yellow-500",
} as const;

export type Rarity = keyof typeof RARITY_COLORS;


export const CLASS_COLORS = {
  ironclad: "bg-red-800",
  defect: "bg-blue-800",
  silent: "bg-green-800",
  regent: "bg-orange-800",
  necrobinder: "bg-purple-800",
  colorless: "bg-gray-800",
} as const;

export type CardClass = keyof typeof CLASS_COLORS;