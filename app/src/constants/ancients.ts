export type BackgroundConfig = {
  backgroundSize: string
  backgroundPosition: string
}

export type AncientBackgroundPosition = {
  focalX: number
  focalY: number
}

/*
  THIS IS NOT A GOOD SOLUTION!!!!

  This does not work well at all with different window sizes. Since the height of the 
  Ancients Carousel will likely stay consistent, I will need to determine how to position 
  the backgrounds based on the height and x of the nameplate. I'll need to mark down the 
  coordinates of where the subject of each background image is (probably normalized to 
  be between 0 and 1), and then do calculations to determine what the correct position is
  for the background image.

  The size is a bit tricky because there are ultrawide monitors, and the ancient bg images 
  are only so big. It might be best to decide on a constant size for every ancient (except 
  Tez because her image is broken), and then just make the image fade out on the right side, 
  so that its at least a smooth transition and not a harsh cutoff. 

  -----

  Change described above implemented


  THIS IS UNUSED FOR NOW!!!!

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