'use client';

// Lattice orb, S1 wave only — ported from a personal multi-variant
// exploration (the source also had a diagonal band, a perimeter comet, a
// scrambled comet, and a left-to-right column; none of that shipped here).
// No pill wrapper: used bare, sitting beside a text label the caller
// already renders, not carrying its own background/border/shadow.

import type { CSSProperties } from 'react';
import styles from './orb.module.css';

/** The stage the geometry is tuned on; --orb-k scales it to `size`. */
const STAGE = 28;
/** Default rendered size — a 20×20 indicator box. */
const SIZE = 20;

const N = 3; // lattice is N×N
const PITCH = 6; // centre-to-centre spacing in stage px; the dot size is CSS
const MID = (N - 1) / 2;

/** Per-cell `animation-delay` in ms. Negative values seed a cell partway
 * into its cycle, which is what turns 9 identical animations into one
 * wavefront radiating from the centre — the centre leads a beat early so
 * the next swell doesn't sit behind the outer fade. */
function cellDelay(x: number, y: number): number {
  const dx = x - MID;
  const dy = y - MID;
  return Math.hypot(dx, dy) * 700 - (dx === 0 && dy === 0 ? 180 : 0);
}

type Cell = {
  key: string;
  left: number;
  top: number;
  delay: number;
  /** Centre cell — the static frame under reduced motion. */
  mid: boolean;
};

/** The 9 lattice cells, with position and phase. Static across renders —
 * nothing here depends on props, so it's computed once at module scope
 * rather than on every mount. */
const CELLS: Cell[] = (() => {
  const cells: Cell[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      cells.push({
        key: `${x},${y}`,
        left: x * PITCH,
        top: y * PITCH,
        delay: cellDelay(x, y),
        mid: x === MID && y === MID,
      });
    }
  }
  return cells;
})();

export type OrbProps = {
  /** Rendered edge length in px. The 28px geometry scales to fit. */
  size?: number;
  /** Accessible label — what the glyph is communicating, not how. */
  label?: string;
  className?: string;
};

export function Orb({ size = SIZE, label = 'Thinking', className }: OrbProps) {
  return (
    <span
      className={className ? `${styles.glyph} ${className}` : styles.glyph}
      role='img'
      aria-label={label}
      style={{ width: size, height: size, '--orb-k': size / STAGE } as CSSProperties}
    >
      <span className={styles.lattice}>
        {CELLS.map((c) => (
          <span
            key={c.key}
            className={styles.cell}
            data-mid={c.mid ? '' : undefined}
            style={{ left: c.left, top: c.top, animationDelay: `${c.delay}ms` }}
          />
        ))}
      </span>
    </span>
  );
}
