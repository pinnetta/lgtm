import React, { useState } from 'react';
import Pagination from '@/components/pagination';
import type { LGTMEntry } from '@/lib/lgtm';
import { PAGE_SIZE } from '@/lib/config';

interface Props {
  entries: LGTMEntry[];
}

export default function CategoryEntries({ entries }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const slice = entries.slice(start, start + PAGE_SIZE);

  function handlePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: '1px solid var(--color-border)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background 0.15s',
  };

  const idStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-text-faint)',
    flexShrink: 0,
    paddingTop: '0.2rem',
    minWidth: '2.5rem',
  };

  const meaningStyle: React.CSSProperties = {
    fontWeight: 600,
    fontSize: '0.9375rem',
    color: 'var(--color-text)',
    lineHeight: 1.4,
  };

  const descStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
    marginTop: '0.2rem',
  };

  return (
    <div>
      <div>
        {slice.map((entry) => (
          <a
            key={entry.id}
            href={`/lgtm/${entry.id}`}
            style={rowStyle}
          >
            <span style={idStyle}>#{entry.id}</span>
            <div>
              <div style={meaningStyle}>{entry.meaning}</div>
              {entry.description && (
                <div style={descStyle}>{entry.description}</div>
              )}
            </div>
          </a>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
    </div>
  );
}
