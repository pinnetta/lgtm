import type { LGTMEntry, Rarity } from './lgtm';
import { RARITY_WEIGHTS } from './lgtm';

/**
 * Weighted random selection based on rarity.
 * Higher weight = more likely to be picked.
 */
export function weightedRandom(entries: LGTMEntry[]): LGTMEntry {
  if (entries.length === 0) throw new Error('Cannot pick from empty list');

  const totalWeight = entries.reduce(
    (sum, e) => sum + (RARITY_WEIGHTS[e.rarity as Rarity] ?? RARITY_WEIGHTS.common),
    0,
  );

  let rand = Math.random() * totalWeight;

  for (const entry of entries) {
    const weight = RARITY_WEIGHTS[entry.rarity as Rarity] ?? RARITY_WEIGHTS.common;
    rand -= weight;
    if (rand <= 0) return entry;
  }

  // Fallback (floating point edge case)
  return entries[entries.length - 1]!;
}

/**
 * Pick a random entry, excluding the currently displayed one.
 */
export function weightedRandomExcluding(
  entries: LGTMEntry[],
  excludeId: number,
): LGTMEntry {
  const pool = entries.length > 1 ? entries.filter((e) => e.id !== excludeId) : entries;
  return weightedRandom(pool);
}
