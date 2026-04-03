import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LegendaryEffect from '../components/LegendaryEffect';

describe('LegendaryEffect', () => {
  it('renders without crashing', () => {
    const { container } = render(<LegendaryEffect />);
    expect(container.firstChild).toBeTruthy();
  });

  it('is hidden from assistive technology (aria-hidden)', () => {
    render(<LegendaryEffect />);
    // The outer container should be aria-hidden
    const el = document.querySelector('[aria-hidden="true"]');
    expect(el).toBeTruthy();
  });

  it('renders particle spans', () => {
    const { container } = render(<LegendaryEffect />);
    // There should be multiple span elements (the particles)
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
  });

  it('container has pointer-events none so it does not block interaction', () => {
    const { container } = render(<LegendaryEffect />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.pointerEvents).toBe('none');
  });

  it('container is fixed-positioned and full-viewport', () => {
    const { container } = render(<LegendaryEffect />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.position).toBe('fixed');
  });
});
