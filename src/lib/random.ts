import type { LGTMEntry, Rarity } from './lgtm';
import { RARITY_WEIGHTS } from './lgtm';

export function weightedRandom(entries: LGTMEntry[]): LGTMEntry {
  if (entries.length === 0) throw new Error('Cannot pick from empty list');

  const totalWeight = entries.reduce(
    (sum, entry) => sum + (RARITY_WEIGHTS[entry.rarity as Rarity] ?? RARITY_WEIGHTS.common),
    0,
  );

  let remaining = Math.random() * totalWeight;

  for (const entry of entries) {
    const weight = RARITY_WEIGHTS[entry.rarity as Rarity] ?? RARITY_WEIGHTS.common;
    remaining -= weight;
    if (remaining <= 0) return entry;
  }

  return entries[entries.length - 1]!;
}

export function weightedRandomExcluding(entries: LGTMEntry[], excludeId: number): LGTMEntry {
  const pool = entries.length > 1 ? entries.filter((entry) => entry.id !== excludeId) : entries;
  return weightedRandom(pool);
}
