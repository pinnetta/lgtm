import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

import confetti from 'canvas-confetti';
import LegendaryEffect from '@/components/legendary-effect';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LegendaryEffect', () => {
  it('renders without crashing', () => {
    const { container } = render(<LegendaryEffect />);
    expect(container).toBeDefined();
  });

  it('calls confetti on mount', () => {
    render(<LegendaryEffect />);
    expect(confetti).toHaveBeenCalledOnce();
  });

  it('calls confetti with particleCount', () => {
    render(<LegendaryEffect />);
    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({ particleCount: expect.any(Number) }),
    );
  });

  it('renders null (no dom nodes)', () => {
    const { container } = render(<LegendaryEffect />);
    expect(container.firstChild).toBeNull();
  });
});
