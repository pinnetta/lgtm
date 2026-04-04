interface Props {
  page: number;
  totalPages: number;
  onPage: (pageNumber: number) => void;
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

  const baseClasses =
    'inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-md border text-sm font-medium cursor-pointer transition-[background,color,border-color] duration-150';

  function hoverOn(e: React.MouseEvent<HTMLButtonElement>) {
    (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-raised)';
    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)';
  }

  function hoverOff(e: React.MouseEvent<HTMLButtonElement>) {
    (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)';
    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
  }

  const sharedButtonStyle = {
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-muted)',
  };

  const activeStyle = {
    background: 'var(--color-accent)',
    color: '#fff',
    borderColor: 'var(--color-accent)',
    fontWeight: 700,
    cursor: 'default',
  };

  const disabledStyle = {
    ...sharedButtonStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <div className="flex items-center justify-center gap-[0.375rem] flex-wrap pt-6">
      <button
        className={baseClasses}
        style={page === 1 ? disabledStyle : sharedButtonStyle}
        onClick={() => page > 1 && onPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        onMouseEnter={(e) => {
          if (page > 1) hoverOn(e);
        }}
        onMouseLeave={(e) => {
          if (page > 1) hoverOff(e);
        }}
      >
        ←
      </button>

      {pages.map((pageNumber, i) =>
        pageNumber === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className={baseClasses}
            style={{
              cursor: 'default',
              border: 'none',
              background: 'none',
              color: 'var(--color-text-muted)',
            }}
          >
            …
          </span>
        ) : (
          <button
            key={pageNumber}
            className={baseClasses}
            style={pageNumber === page ? activeStyle : sharedButtonStyle}
            onClick={() => pageNumber !== page && onPage(pageNumber as number)}
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? 'page' : undefined}
            onMouseEnter={(e) => {
              if (pageNumber !== page) hoverOn(e);
            }}
            onMouseLeave={(e) => {
              if (pageNumber !== page) hoverOff(e);
            }}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        className={baseClasses}
        style={page === totalPages ? disabledStyle : sharedButtonStyle}
        onClick={() => page < totalPages && onPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        onMouseEnter={(e) => {
          if (page < totalPages) hoverOn(e);
        }}
        onMouseLeave={(e) => {
          if (page < totalPages) hoverOff(e);
        }}
      >
        →
      </button>
    </div>
  );
}
