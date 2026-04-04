import { useState } from 'react';
import type { LGTMEntry } from '@/lib/lgtm';
import { PAGE_SIZE } from '@/lib/config';
import Pagination from '@/components/pagination';

interface Props {
  entries: LGTMEntry[];
}

export default function CategoryEntries({ entries }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const slice = entries.slice(start, start + PAGE_SIZE);

  function handlePageChange(pageNumber: number) {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <div>
        {slice.map((entry) => (
          <a
            key={entry.id}
            href={`/lgtm/${entry.id}`}
            className="flex items-start gap-4 py-4 border-b no-underline transition-colors duration-150"
            style={{
              borderColor: 'var(--color-border)',
              color: 'inherit',
            }}
          >
            <span
              className="flex-shrink-0 text-xs pt-[0.2rem] min-w-[2.5rem]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)' }}
            >
              #{entry.id}
            </span>
            <div>
              <div
                className="font-semibold text-[0.9375rem] leading-[1.4]"
                style={{ color: 'var(--color-text)' }}
              >
                {entry.meaning}
              </div>
              {entry.description && (
                <div
                  className="text-[0.8125rem] leading-[1.5] mt-[0.2rem]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {entry.description}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={handlePageChange} />
    </div>
  );
}
