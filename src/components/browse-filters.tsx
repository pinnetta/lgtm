import { useState, useMemo } from 'react';
import type { LGTMEntry, Rarity } from '../lib/lgtm';
import { RARITY_LABELS, CATEGORY_LABELS, RARITY_WEIGHTS, getAllRarities } from '../lib/lgtm';

interface Props {
  entries: LGTMEntry[];
}

type SortOption = 'alpha' | 'rarity-asc' | 'rarity-desc' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  alpha: 'A → Z',
  'rarity-asc': 'Rarity: Common first',
  'rarity-desc': 'Rarity: Legendary first',
  newest: 'Newest first',
};

const RARITY_ORDER: Record<Rarity, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
};

const CAT_COLORS: Record<string, string> = {
  funny: '#f59e0b',
  sarcastic: '#ef4444',
  wholesome: '#10b981',
  dev: '#6366f1',
  existential: '#8b5cf6',
  corporate: '#0ea5e9',
  chaotic: '#f97316',
};

function RarityDot({ rarity }: { rarity: Rarity }) {
  const COLORS: Record<Rarity, string> = {
    common: 'var(--color-common)',
    rare: 'var(--color-rare)',
    epic: 'var(--color-epic)',
    legendary: 'var(--color-legendary)',
  };
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: COLORS[rarity],
        flexShrink: 0,
        marginTop: '1px',
      }}
    />
  );
}

function EntryRow({ entry }: { entry: LGTMEntry }) {
  const clr = CAT_COLORS[entry.category] ?? 'var(--color-text-muted)';
  return (
    <a
      href={`/lgtm/${entry.id}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '0.75rem 1.5rem',
        alignItems: 'start',
        padding: '1rem 1.25rem',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        textDecoration: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 2px 12px color-mix(in srgb, var(--color-accent) 10%, transparent)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RarityDot rarity={entry.rarity as Rarity} />
          <span style={{
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-faint)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            LGTM
          </span>
        </div>
        <span style={{
          fontSize: '1.0625rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {entry.meaning}
        </span>
        {entry.description && (
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {entry.description}
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.375rem',
        flexShrink: 0,
      }}>
        <span
          className={`badge-${entry.rarity}`}
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '0.2em 0.5em',
            borderRadius: '4px',
          }}
        >
          {entry.rarity === 'legendary' && '★ '}
          {entry.rarity === 'epic' && '◆ '}
          {RARITY_LABELS[entry.rarity as Rarity]}
        </span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: clr,
          background: `color-mix(in srgb, ${clr} 10%, var(--color-surface))`,
          border: `1px solid color-mix(in srgb, ${clr} 25%, transparent)`,
          borderRadius: '4px',
          padding: '0.15em 0.45em',
        }}>
          {CATEGORY_LABELS[entry.category] ?? entry.category}
        </span>
      </div>
    </a>
  );
}

export default function BrowseFilters({ entries }: Props) {
  const allCategories = useMemo(() => [...new Set(entries.map((e) => e.category))].sort(), [entries]);
  const allRarities = getAllRarities();

  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeRarities, setActiveRarities] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>('alpha');

  function toggleCategory(cat: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  function toggleRarity(r: string) {
    setActiveRarities((prev) => {
      const next = new Set(prev);
      next.has(r) ? next.delete(r) : next.add(r);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let result = entries;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.meaning.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCategories.size > 0) {
      result = result.filter((e) => activeCategories.has(e.category));
    }

    if (activeRarities.size > 0) {
      result = result.filter((e) => activeRarities.has(e.rarity));
    }

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'alpha':
          return a.meaning.localeCompare(b.meaning);
        case 'rarity-asc':
          return (RARITY_ORDER[a.rarity as Rarity] ?? 0) - (RARITY_ORDER[b.rarity as Rarity] ?? 0);
        case 'rarity-desc':
          return (RARITY_ORDER[b.rarity as Rarity] ?? 0) - (RARITY_ORDER[a.rarity as Rarity] ?? 0);
        case 'newest':
          return (b.created_at ?? '').localeCompare(a.created_at ?? '');
        default:
          return 0;
      }
    });
  }, [entries, search, activeCategories, activeRarities, sort]);

  const hasFilters = search.trim() || activeCategories.size > 0 || activeRarities.size > 0;

  function clearAll() {
    setSearch('');
    setActiveCategories(new Set());
    setActiveRarities(new Set());
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-faint)',
          fontSize: '1rem',
          pointerEvents: 'none',
        }}>
          ⌕
        </span>
        <input
          type="search"
          placeholder="Search meanings, descriptions, tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            fontSize: '0.9375rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Category
          </span>
          {allCategories.map((cat) => {
            const active = activeCategories.has(cat);
            const clr = CAT_COLORS[cat] ?? 'var(--color-text-muted)';
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  padding: '0.3em 0.75em',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: `1.5px solid ${active ? clr : 'var(--color-border)'}`,
                  background: active
                    ? `color-mix(in srgb, ${clr} 12%, var(--color-surface))`
                    : 'var(--color-surface)',
                  color: active ? clr : 'var(--color-text-muted)',
                }}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Rarity
          </span>
          {allRarities.map((r) => {
            const active = activeRarities.has(r);
            const COLORS: Record<Rarity, string> = {
              common: 'var(--color-common)',
              rare: 'var(--color-rare)',
              epic: 'var(--color-epic)',
              legendary: 'var(--color-legendary)',
            };
            const clr = COLORS[r];
            return (
              <button
                key={r}
                onClick={() => toggleRarity(r)}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  padding: '0.3em 0.75em',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: `1.5px solid ${active ? clr : 'var(--color-border)'}`,
                  background: active
                    ? `color-mix(in srgb, ${clr} 12%, var(--color-surface))`
                    : 'var(--color-surface)',
                  color: active ? clr : 'var(--color-text-muted)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                {r === 'legendary' && '★ '}
                {r === 'epic' && '◆ '}
                {RARITY_LABELS[r]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> of {entries.length} entries
          {hasFilters && (
            <button
              onClick={clearAll}
              style={{
                marginLeft: '0.75rem',
                fontSize: '0.8125rem',
                color: 'var(--color-accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Clear filters
            </button>
          )}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="sort-select" style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Sort:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{
              fontSize: '0.875rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          color: 'var(--color-text-muted)',
        }}>
          <p style={{ fontSize: '2rem', margin: '0 0 0.75rem' }}>🔍</p>
          <p style={{ margin: 0, fontWeight: 600 }}>No entries match your filters.</p>
          <button
            onClick={clearAll}
            style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: 'var(--color-accent)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
