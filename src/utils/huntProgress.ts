/** Planned hunt stops (keys 1–20). */
export const HUNT_LANDMARK_TOTAL = 20;

/** After collecting `k` keys, landmarks `1..k` are done and `#(k+1)` is playable (up to 20). */
export function getMaxUnlockedLandmarkId(keysCollected: number[]): number {
  return Math.min(HUNT_LANDMARK_TOTAL, keysCollected.length + 1);
}
