import { CharacterID, CharacterName } from "@/types/general";

import ironcladIcon from "@/assets/characters/icons/character_icon_ironclad.png"
import silentIcon from "@/assets/characters/icons/character_icon_silent.png"
import regentIcon from "@/assets/characters/icons/character_icon_regent.png"
import necrobinderIcon from "@/assets/characters/icons/character_icon_necrobinder.png"
import defectIcon from "@/assets/characters/icons/character_icon_defect.png"

import ironcladRest from "@/assets/characters/rest/rest_ironclad.png"
import silentRest from "@/assets/characters/rest/rest_silent.png"
import regentRest from "@/assets/characters/rest/rest_regent.png"
import necrobinderRest from "@/assets/characters/rest/rest_necrobinder.png"
import ostyRest from "@/assets/characters/rest/rest_osty.png"
import defectRest from "@/assets/characters/rest/rest_defect.png"

export const CHARACTERS: { name: CharacterName; id: CharacterID }[] = [
  { name: "ironclad", id: "CHARACTER.IRONCLAD" },
  { name: "silent", id: "CHARACTER.SILENT" },
  { name: "regent", id: "CHARACTER.REGENT" },
  { name: "necrobinder", id: "CHARACTER.NECROBINDER" },
  { name: "defect", id: "CHARACTER.DEFECT" }
]


// rewrite to be generated algorithmically
export const CHARACTER_COLORS = {
  "CHARACTER.IRONCLAD": {
    light: {
      bg: "bg-ironclad",
      border: "border-ironclad",
      text: "text-ironclad"
    },
    dark: {
      bg: "bg-ironclad-dark",
      border: "border-ironclad-dark",
      text: "text-ironclad-dark"
    },
    tabs: {
      inactiveBg: "bg-ironclad-dark",
      activeBg: "data-active:bg-ironclad-dark!",
      border: "data-active:border-ironclad!"
    }
  },
  "CHARACTER.SILENT": {
    light: {
      bg: "bg-silent",
      border: "border-silent",
      text: "text-silent"
    },
    dark: {
      bg: "bg-silent-dark",
      border: "border-silent-dark",
      text: "text-silent-dark"
    },
    tabs: {
      inactiveBg: "bg-silent-dark",
      activeBg: "data-active:bg-silent-dark!",
      border: "data-active:border-silent!"
    }
  },
  "CHARACTER.REGENT": {
    light: {
      bg: "bg-regent",
      border: "border-regent",
      text: "text-regent"
    },
    dark: {
      bg: "bg-regent-dark",
      border: "border-regent-dark",
      text: "text-regent-dark"
    },
    tabs: {
      inactiveBg: "bg-regent-dark",
      activeBg: "data-active:bg-regent-dark!",
      border: "data-active:border-regent!"
    }
  },
  "CHARACTER.NECROBINDER": {
    light: {
      bg: "bg-necrobinder",
      border: "border-necrobinder",
      text: "text-necrobinder"
    },
    dark: {
      bg: "bg-necrobinder-dark",
      border: "border-necrobinder-dark",
      text: "text-necrobinder-dark"
    },
    tabs: {
      inactiveBg: "bg-necrobinder-dark",
      activeBg: "data-active:bg-necrobinder-dark!",
      border: "data-active:border-necrobinder!"
    }
  },
  "CHARACTER.DEFECT": {
    light: {
      bg: "bg-defect",
      border: "border-defect",
      text: "text-defect"
    },
    dark: {
      bg: "bg-defect-dark",
      border: "border-defect-dark",
      text: "text-defect-dark"
    },
    tabs: {
      inactiveBg: "bg-defect-dark",
      activeBg: "data-active:bg-defect-dark!",
      border: "data-active:border-defect!"
    }
  }
}

type CharacterColor = typeof CHARACTERS[number]

export const CHARACTER_ICONS = {
  "CHARACTER.IRONCLAD": ironcladIcon,
  "CHARACTER.SILENT": silentIcon,
  "CHARACTER.REGENT": regentIcon,
  "CHARACTER.NECROBINDER": necrobinderIcon,
  "CHARACTER.DEFECT": defectIcon
}

export const CHARACTER_RESTS = {
  "CHARACTER.IRONCLAD": ironcladRest,
  "CHARACTER.SILENT": silentRest,
  "CHARACTER.REGENT": regentRest,
  "CHARACTER.NECROBINDER": necrobinderRest,
  "CHARACTER.OSTY": ostyRest,
  "CHARACTER.DEFECT": defectRest
}