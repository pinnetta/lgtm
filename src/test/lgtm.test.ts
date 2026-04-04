import { describe, it, expect } from 'vitest';
import {
  getAllEntries,
  getEntryById,
  getEntriesByCategory,
  getAllCategories,
  getAllRarities,
  RARITY_WEIGHTS,
  RARITY_LABELS,
  CATEGORY_LABELS,
} from '@/lib/lgtm';

describe('getAllEntries', () => {
  it('returns a non-empty array', () => {
    const entries = getAllEntries();
    expect(entries.length).toBeGreaterThan(0);
  });

  it('every entry has a numeric id', () => {
    const entries = getAllEntries();
    for (const e of entries) {
      expect(typeof e.id).toBe('number');
      expect(e.id).toBeGreaterThan(0);
    }
  });

  it('ids are contiguous starting at 1', () => {
    const entries = getAllEntries();
    const ids = entries.map((e) => e.id).sort((a, b) => a - b);
    ids.forEach((id, idx) => expect(id).toBe(idx + 1));
  });

  it('every entry has a valid rarity', () => {
    const valid = new Set(['common', 'rare', 'epic', 'legendary']);
    for (const e of getAllEntries()) {
      expect(valid.has(e.rarity)).toBe(true);
    }
  });
});

describe('getEntryById', () => {
  it('returns the correct entry', () => {
    const entry = getEntryById(1);
    expect(entry).toBeDefined();
    expect(entry!.id).toBe(1);
  });

  it('returns undefined for unknown id', () => {
    expect(getEntryById(9999)).toBeUndefined();
  });
});

describe('getEntriesByCategory', () => {
  it('returns only entries of the given category', () => {
    const cats = getAllCategories();
    const cat = cats[0]!;
    const entries = getEntriesByCategory(cat);
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      expect(e.category).toBe(cat);
    }
  });

  it('returns empty array for unknown category', () => {
    expect(getEntriesByCategory('__nonexistent__')).toHaveLength(0);
  });
});

describe('getAllCategories', () => {
  it('returns an array of strings', () => {
    const cats = getAllCategories();
    expect(Array.isArray(cats)).toBe(true);
    expect(cats.length).toBeGreaterThan(0);
    for (const c of cats) expect(typeof c).toBe('string');
  });

  it('returns unique values', () => {
    const cats = getAllCategories();
    expect(new Set(cats).size).toBe(cats.length);
  });
});

describe('getAllRarities', () => {
  it('returns the four rarities', () => {
    expect(getAllRarities()).toEqual(['common', 'rare', 'epic', 'legendary']);
  });
});

describe('constants', () => {
  it('rarity weights are positive numbers', () => {
    for (const w of Object.values(RARITY_WEIGHTS)) {
      expect(w).toBeGreaterThan(0);
    }
  });

  it('rarity labels covers all rarities', () => {
    expect(Object.keys(RARITY_LABELS)).toEqual(
      expect.arrayContaining(['common', 'rare', 'epic', 'legendary']),
    );
  });

  it('category labels is a non-empty object', () => {
    expect(Object.keys(CATEGORY_LABELS).length).toBeGreaterThan(0);
  });
});
