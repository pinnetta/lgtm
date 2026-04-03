import { useState, useEffect, useCallback, useRef } from 'react';
import type { LGTMEntry, Rarity } from '../lib/lgtm';
import { RARITY_LABELS, CATEGORY_LABELS } from '../lib/lgtm';
import { weightedRandomExcluding } from '../lib/random';

interface Props {
  entries: LGTMEntry[];
  initialEntry?: LGTMEntry;
}

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'var(--color-common)',
  rare: 'var(--color-rare)',
  epic: 'var(--color-epic)',
  legendary: 'var(--color-legendary)',
};

function RarityBadgeInline({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`badge-${rarity}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3em',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        borderRadius: '6px',
        padding: '0.3em 0.65em',
      }}
    >
      {rarity === 'legendary' && <span aria-hidden="true">★</span>}
      {rarity === 'epic' && <span aria-hidden="true">◆</span>}
      {RARITY_LABELS[rarity]}
    </span>
  );
}

function CategoryBadgeInline({ category }: { category: string }) {
  const CAT_COLORS: Record<string, string> = {
    funny: '#f59e0b',
    sarcastic: '#ef4444',
    wholesome: '#10b981',
    nerd: '#6366f1',
    existential: '#8b5cf6',
    corporate: '#0ea5e9',
    chaotic: '#f97316',
  };
  const clr = CAT_COLORS[category] ?? 'var(--color-text-muted)';
  return (
    <a
      href={`/categories/${category}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.8125rem',
        fontWeight: 500,
        borderRadius: '6px',
        padding: '0.3em 0.7em',
        color: clr,
        background: `color-mix(in srgb, ${clr} 10%, var(--color-surface))`,
        border: `1px solid color-mix(in srgb, ${clr} 25%, transparent)`,
        textDecoration: 'none',
        transition: 'opacity 0.15s',
      }}
    >
      {CATEGORY_LABELS[category] ?? category}
    </a>
  );
}

export default function RandomGenerator({ entries, initialEntry }: Props) {
  const [current, setCurrent] = useState<LGTMEntry>(
    initialEntry ?? entries[Math.floor(Math.random() * entries.length)]!
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialEntry) {
      const picked = weightedRandomExcluding(entries, 0);
      setCurrent(picked);
      history.replaceState(null, '', `/lgtm/${picked.id}`);
    }
  }, []); 

  const generate = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      const next = weightedRandomExcluding(entries, current.id);
      setCurrent(next);
      history.pushState(null, '', `/lgtm/${next.id}`);
      setIsAnimating(false);
    }, 180);
  }, [current.id, entries, isAnimating]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/lgtm/${current.id}`
    : `/lgtm/${current.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('input');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const rarityColor = RARITY_COLORS[current.rarity as Rarity] ?? 'var(--color-common)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          boxShadow: `0 8px 32px color-mix(in srgb, ${rarityColor} 10%, transparent)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            borderRadius: '20px 20px 0 0',
            background: current.rarity === 'legendary'
              ? `linear-gradient(90deg, ${rarityColor}, #f59e0b, ${rarityColor})`
              : rarityColor,
          }}
        />

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <RarityBadgeInline rarity={current.rarity as Rarity} />
          <CategoryBadgeInline category={current.category} />
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-faint)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          margin: '0 0 0.375rem',
        }}>
          LGTM
        </p>

        <h1 style={{
          fontSize: 'clamp(1.625rem, 5vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--color-text)',
          margin: '0 0 0.75rem',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          {current.meaning}
        </h1>

        {current.description && (
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-text-muted)',
            margin: '0',
            lineHeight: 1.6,
          }}>
            {current.description}
          </p>
        )}

        {current.tags && current.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.375rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            {current.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-faint)',
                  padding: '0.15em 0.45em',
                  borderRadius: '4px',
                  background: 'var(--color-surface-raised)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <button
          onClick={generate}
          disabled={isAnimating}
          className="btn btn-primary"
          style={{ fontSize: '1rem', padding: '0.7rem 1.75rem', gap: '0.5rem' }}
        >
          <span aria-hidden="true" style={{ fontSize: '1.1em' }}>⚄</span>
          Generate another
        </button>

        <button
          onClick={handleCopy}
          className="btn btn-ghost"
          style={{ fontSize: '0.9375rem' }}
        >
          {copied ? (
            <>
              <span aria-hidden="true">✓</span>
              Copied!
            </>
          ) : (
            <>
              <span aria-hidden="true">⎘</span>
              Copy link
            </>
          )}
        </button>

        <a
          href={`/lgtm/${current.id}`}
          className="btn btn-ghost"
          style={{ fontSize: '0.9375rem' }}
        >
          <span aria-hidden="true">↗</span>
          View detail
        </a>
      </div>

      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--color-text-faint)',
        fontFamily: 'var(--font-mono)',
        margin: 0,
        textAlign: 'center',
      }}>
        {shareUrl}
      </p>
    </div>
  );
}
