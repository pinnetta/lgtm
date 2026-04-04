import { describe, it, expect, vi } from 'vitest';
import { weightedRandom, weightedRandomExcluding } from '@/lib/random';
import type { LGTMEntry } from '@/lib/lgtm';
import { makeEntry } from '@/test/fixtures';

const entries: LGTMEntry[] = [
  makeEntry({ id: 1, rarity: 'common' }),
  makeEntry({ id: 2, rarity: 'rare' }),
  makeEntry({ id: 3, rarity: 'epic' }),
  makeEntry({ id: 4, rarity: 'legendary' }),
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
    const single = [makeEntry({ id: 99, rarity: 'common' })];
    expect(weightedRandom(single)).toBe(single[0]);
  });

  it('respects weights, common is more frequent than legendary', () => {
    const pool = [
      makeEntry({ id: 1, rarity: 'common' }),
      makeEntry({ id: 2, rarity: 'legendary' }),
    ];
    let commonCount = 0;
    const TRIALS = 1000;

    for (let i = 0; i < TRIALS; i++) {
      if (weightedRandom(pool).rarity === 'common') commonCount++;
    }

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
    const single = [makeEntry({ id: 5, rarity: 'epic' })];
    expect(weightedRandomExcluding(single, 5)).toBe(single[0]);
  });
});
