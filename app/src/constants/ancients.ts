export type BackgroundConfig = {
  backgroundSize: string
  backgroundPosition: string
}

export type AncientBackgroundPosition = {
  focalX: number
  focalY: number
}

/*
  THIS IS UNUSED FOR NOW!!!!

  I implemented a change to dynamically set the background size and position instead of using
  hard-coded values. This allows the focus point of the background to be centered on the ancient's face, 
  regardless of the screen size or aspect ratio. 
*/
export const ANCIENT_BG_LAYOUT_VALUES: Record<string, BackgroundConfig> = {
  "EVENT.NEOW": {
    backgroundSize: "auto 180%",
    backgroundPosition: "right 10%",
  },
  "EVENT.DARV": {
    backgroundSize: "auto 180%",
    backgroundPosition: "right 25%",
  },
  "EVENT.NONUPEIPE": {
    backgroundSize: "auto 200%",
    backgroundPosition: "right 0%",
  },
  "EVENT.OROBAS": {
    backgroundSize: "auto 185%",
    backgroundPosition: "right 15%",
  },
  "EVENT.TANX": {
    backgroundSize: "auto 170%",
    backgroundPosition: "right 10%",
  },
  "EVENT.TEZCATARA": { 
    backgroundSize: "auto 450%",
    backgroundPosition: "82% 44%",
  },
  "EVENT.VAKUU": {
    backgroundSize: "auto 150%",
    backgroundPosition: "right 0%",
  },
  "EVENT.PAEL": {
    backgroundSize: "auto 200%",
    backgroundPosition: "right 20%",
  },
}

/**
 * A mapping of ancient IDs to their corresponding background focal points.
 */
export const ANCIENT_BG_FOCAL_POINTS: Record<string, AncientBackgroundPosition> = {
  "EVENT.NEOW": {
    focalX: 1355,
    focalY: 430
  },
  "EVENT.DARV": {
    focalX: 1160,
    focalY: 450
  },
  "EVENT.NONUPEIPE": {
    focalX: 1390,
    focalY: 250
  },
  "EVENT.OROBAS": {
    focalX: 1210,
    focalY: 425
  },
  "EVENT.TANX": {
    focalX: 1180,
    focalY: 325
  },
  "EVENT.TEZCATARA": { 
    focalX: 1000,
    focalY: 920
  },
  "EVENT.VAKUU": {
    focalX: 1050,
    focalY: 260
  },
  "EVENT.PAEL": {
    focalX: 1455,
    focalY: 475
  },
}