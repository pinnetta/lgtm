import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../components/theme-switcher';

function getTheme() {
  return document.documentElement.getAttribute('data-theme');
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeSwitcher', () => {
  it('renders a button', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('starts in system mode (no data-theme attribute)', () => {
    render(<ThemeSwitcher />);
    expect(getTheme()).toBeNull();
  });

  it('cycles system → light on first click', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(getTheme()).toBe('light');
    expect(localStorage.getItem('lgtm-theme')).toBe('light');
  });

  it('cycles light → dark on second click', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(getTheme()).toBe('dark');
    expect(localStorage.getItem('lgtm-theme')).toBe('dark');
  });

  it('cycles dark → system on third click', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));
    expect(getTheme()).toBeNull();
    expect(localStorage.getItem('lgtm-theme')).toBeNull();
  });

  it('restores persisted theme from localStorage on mount', () => {
    localStorage.setItem('lgtm-theme', 'dark');
    render(<ThemeSwitcher />);
    expect(getTheme()).toBe('dark');
  });

  it('has an accessible aria-label', () => {
    render(<ThemeSwitcher />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-label');
  });
});
