import type { LGTMEntry } from '../lib/lgtm';

export function makeEntry(overrides: Partial<LGTMEntry> = {}): LGTMEntry {
  return {
    id: 1,
    meaning: 'Looks Good To Me',
    category: 'nerd',
    rarity: 'common',
    description: 'The original, the classic.',
    tags: ['classic', 'code-review'],
    created_at: '2024-01-01',
    ...overrides,
  };
}
