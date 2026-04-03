import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RandomGenerator from '../components/random-generator';
import type { LGTMEntry } from '../lib/lgtm';

beforeEach(() => {
  vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
  vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
});

function makeEntry(id: number, rarity: LGTMEntry['rarity'] = 'common'): LGTMEntry {
  return {
    id,
    meaning: `Meaning ${id}`,
    category: 'funny',
    rarity,
    description: `Description for ${id}`,
    tags: [`tag${id}`],
  };
}

const entries: LGTMEntry[] = [
  makeEntry(1, 'common'),
  makeEntry(2, 'rare'),
  makeEntry(3, 'epic'),
  makeEntry(4, 'legendary'),
];

describe('RandomGenerator', () => {
  it('renders with an initialEntry', () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[0]} />);
    expect(screen.getByText('Meaning 1')).toBeInTheDocument();
  });

  it('shows the description when present', () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[0]} />);
    expect(screen.getByText('Description for 1')).toBeInTheDocument();
  });

  it('renders a generate another button', () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[0]} />);
    expect(screen.getByText(/Generate another/i)).toBeInTheDocument();
  });

  it('renders a copy link button', () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[0]} />);
    expect(screen.getByText(/Copy link/i)).toBeInTheDocument();
  });

  it('renders a view detail link', () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[0]} />);
    expect(screen.getByText(/View detail/i)).toBeInTheDocument();
  });

  it('view detail link points to the current entry', () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[1]} />);
    const link = screen.getByRole('link', { name: /View detail/i });
    expect(link.getAttribute('href')).toBe('/lgtm/2');
  });

  it('renders tags', () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[0]} />);
    expect(screen.getByText('#tag1')).toBeInTheDocument();
  });

  it('calls history.replaceState on mount (no initialEntry)', async () => {
    render(<RandomGenerator entries={entries} />);
    await waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  it('clicking generate another triggers a new entry', async () => {
    render(<RandomGenerator entries={entries} initialEntry={entries[0]} />);
    const btn = screen.getByText(/Generate another/i);
    fireEvent.click(btn);
    await waitFor(() => {
      expect(window.history.pushState).toHaveBeenCalled();
    }, { timeout: 500 });
  });
});
