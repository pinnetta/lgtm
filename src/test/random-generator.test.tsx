import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RandomGenerator from '../components/random-generator';
import type { LGTMEntry } from '../lib/lgtm';
import { makeEntry } from './fixtures';

beforeEach(() => {
  vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
  vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
});

const entries: LGTMEntry[] = [
  makeEntry({ id: 1, rarity: 'common', meaning: 'Meaning 1', description: 'Description for 1', tags: ['tag1'] }),
  makeEntry({ id: 2, rarity: 'rare', meaning: 'Meaning 2', description: 'Description for 2', tags: ['tag2'] }),
  makeEntry({ id: 3, rarity: 'epic', meaning: 'Meaning 3', description: 'Description for 3', tags: ['tag3'] }),
  makeEntry({ id: 4, rarity: 'legendary', meaning: 'Meaning 4', description: 'Description for 4', tags: ['tag4'] }),
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
