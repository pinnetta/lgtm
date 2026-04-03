import React from 'react';

interface Props {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPage }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | '…')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '2rem',
    height: '2rem',
    padding: '0 0.5rem',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-muted)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  };

  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: 'var(--color-accent)',
    color: '#fff',
    borderColor: 'var(--color-accent)',
    fontWeight: 700,
    cursor: 'default',
  };

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  function hoverOn(e: React.MouseEvent<HTMLButtonElement>) {
    (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-raised)';
    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)';
  }

  function hoverOff(e: React.MouseEvent<HTMLButtonElement>) {
    (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)';
    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.375rem',
      flexWrap: 'wrap',
      paddingTop: '1.5rem',
    }}>
      <button
        style={page === 1 ? btnDisabled : btnBase}
        onClick={() => page > 1 && onPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        onMouseEnter={(e) => { if (page > 1) hoverOn(e); }}
        onMouseLeave={(e) => { if (page > 1) hoverOff(e); }}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            style={{ ...btnBase, cursor: 'default', border: 'none', background: 'none' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            style={p === page ? btnActive : btnBase}
            onClick={() => p !== page && onPage(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            onMouseEnter={(e) => { if (p !== page) hoverOn(e); }}
            onMouseLeave={(e) => { if (p !== page) hoverOff(e); }}
          >
            {p}
          </button>
        )
      )}

      <button
        style={page === totalPages ? btnDisabled : btnBase}
        onClick={() => page < totalPages && onPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        onMouseEnter={(e) => { if (page < totalPages) hoverOn(e); }}
        onMouseLeave={(e) => { if (page < totalPages) hoverOff(e); }}
      >
        →
      </button>
    </div>
  );
}
