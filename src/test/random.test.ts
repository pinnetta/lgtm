import { describe, it, expect, vi, beforeEach } from 'vitest';
import { weightedRandom, weightedRandomExcluding } from '../lib/random';
import type { LGTMEntry } from '../lib/lgtm';

function makeEntry(id: number, rarity: LGTMEntry['rarity']): LGTMEntry {
  return { id, acronym: 'LGTM', meaning: `Meaning ${id}`, category: 'funny', rarity };
}

const entries: LGTMEntry[] = [
  makeEntry(1, 'common'),
  makeEntry(2, 'regular'),
  makeEntry(3, 'rare'),
  makeEntry(4, 'legendary'),
];

describe('weightedRandom', () => {
  it('throws for empty input', () => {
    expect(() => weightedRandom([])).toThrow();
  });

  it('returns one of the provided entries', () => {
    for (let i = 0; i < 20; i++) {
      const result = weightedRandom(entries);
      expect(entries).toContain(result);
    }
  });

  it('returns the only entry when list has one item', () => {
    const single = [makeEntry(99, 'common')];
    expect(weightedRandom(single)).toBe(single[0]);
  });

  it('respects weights — common is more frequent than legendary', () => {
    // Build a list of 1 common + 1 legendary and run many trials
    const pool = [makeEntry(1, 'common'), makeEntry(2, 'legendary')];
    let commonCount = 0;
    const TRIALS = 1000;
    for (let i = 0; i < TRIALS; i++) {
      if (weightedRandom(pool).rarity === 'common') commonCount++;
    }
    // common weight 60, legendary weight 5 — common should win >75% of the time
    expect(commonCount / TRIALS).toBeGreaterThan(0.75);
  });

  it('handles floating-point edge case via fallback (Math.random = 1)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999999999);
    const result = weightedRandom(entries);
    expect(entries).toContain(result);
    vi.restoreAllMocks();
  });
});

describe('weightedRandomExcluding', () => {
  it('never returns the excluded entry (when pool > 1)', () => {
    for (let i = 0; i < 50; i++) {
      const result = weightedRandomExcluding(entries, 1);
      expect(result.id).not.toBe(1);
    }
  });

  it('returns something even when excludeId is 0 (no real match)', () => {
    const result = weightedRandomExcluding(entries, 0);
    expect(entries).toContain(result);
  });

  it('returns the single entry when pool has only one item', () => {
    const single = [makeEntry(5, 'rare')];
    expect(weightedRandomExcluding(single, 5)).toBe(single[0]);
  });
});
