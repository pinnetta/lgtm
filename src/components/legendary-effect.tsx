import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function LegendaryEffect() {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.4 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#fcd34d', '#f97316', '#fb923c', '#ffffff'],
    });
  }, []);

  return null;
}
