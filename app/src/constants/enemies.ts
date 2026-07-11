/**
 * A mapping of enemy IDs to their corresponding simplified IDs and exceptions for specific acts.
 * 
 * This mapping is used to handle cases where certain enemy IDs have variations or exceptions
 */
export const ENEMY_ID_MAPPINGS: Record<string, string> = {
  "MONSTER.DECIMILLIPEDE_SEGMENT_FRONT": "DECIMILLIPEDE_SEGMENT",
}

/**
 * A mapping of enemy IDs to their corresponding act exceptions.
 * 
 * This mapping is used to handle cases where certain enemies have exceptions for specific acts.
 * For example, the "DECIMILLIPEDE_SEGMENT" enemy has an exception for act 2.
 */
export const ENEMY_ACT_EXCEPTIONS: Record<string, number[]> = {
  "DECIMILLIPEDE_SEGMENT": [2]
}