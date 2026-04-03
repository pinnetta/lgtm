export type Rarity = 'common' | 'regular' | 'rare' | 'legendary';

export type Category =
  | 'funny'
  | 'sarcastic'
  | 'wholesome'
  | 'dev'
  | 'existential'
  | 'corporate'
  | 'chaotic';

export interface LGTMEntry {
  id: number;
  acronym: 'LGTM';
  meaning: string;
  category: Category | string;
  rarity: Rarity;
  description?: string;
  tags?: string[];
  created_at?: string;
}

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 60,
  regular: 30,
  rare: 15,
  legendary: 5,
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Common',
  regular: 'Regular',
  rare: 'Rare',
  legendary: 'Legendary',
};

export const CATEGORY_LABELS: Record<string, string> = {
  funny: 'Funny',
  sarcastic: 'Sarcastic',
  wholesome: 'Wholesome',
  dev: 'Dev',
  existential: 'Existential',
  corporate: 'Corporate',
  chaotic: 'Chaotic',
};

import rawData from '../../data/lgtm.json';

export function getAllEntries(): LGTMEntry[] {
  return rawData as LGTMEntry[];
}

export function getEntryById(id: number): LGTMEntry | undefined {
  return getAllEntries().find((e) => e.id === id);
}

export function getEntriesByCategory(category: string): LGTMEntry[] {
  return getAllEntries().filter((e) => e.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(getAllEntries().map((e) => e.category))].sort();
}

export function getAllRarities(): Rarity[] {
  return ['common', 'regular', 'rare', 'legendary'];
}
