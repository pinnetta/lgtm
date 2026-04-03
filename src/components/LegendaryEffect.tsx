import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 16;

// Gold/amber palette for legendary particles
const COLORS = [
  '#fbbf24', // amber-400
  '#f59e0b', // amber-500
  '#d97706', // amber-600
  '#fcd34d', // amber-300
  '#fde68a', // amber-200
  '#f97316', // orange-500
  '#fb923c', // orange-400
  '#ffffff',
];

interface Particle {
  angle: number;
  distance: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    angle: (360 / PARTICLE_COUNT) * i + Math.random() * 15 - 7.5,
    distance: 60 + Math.random() * 80,
    size: 6 + Math.random() * 8,
    color: COLORS[i % COLORS.length],
    duration: 700 + Math.random() * 400,
    delay: Math.random() * 120,
  }));
}

export default function LegendaryEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>(buildParticles());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Auto-remove after the longest animation completes
    const maxDuration = Math.max(...particles.current.map((p) => p.duration + p.delay));
    const timer = setTimeout(() => {
      if (el) el.style.display = 'none';
    }, maxDuration + 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Render one burst centred horizontally at 35% from top */}
      {particles.current.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        const keyframesId = `lp-${i}`;

        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '35%',
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '50% 0',
              background: p.color,
              boxShadow: `0 0 6px 1px ${p.color}`,
              animation: `${keyframesId} ${p.duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}ms both`,
            }}
          >
            <style>{`
              @keyframes ${keyframesId} {
                0%   { transform: translate(0, 0) scale(1); opacity: 1; }
                60%  { opacity: 1; }
                100% { transform: translate(${tx}px, ${ty}px) scale(0); opacity: 0; }
              }
            `}</style>
          </span>
        );
      })}
    </div>
  );
}
