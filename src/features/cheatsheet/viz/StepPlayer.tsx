import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Frame } from './types';
import { FrameRenderer } from './renderers/FrameRenderer';

interface Props {
  frames: Frame[];
  title?: string;
  autoplay?: boolean;
  speedMs?: number;
}

export function StepPlayer({ frames, title, autoplay = false, speedMs = 700 }: Props): React.ReactElement {
  const total = frames.length;
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(autoplay && total > 1);
  const timerRef = useRef<number | null>(null);

  const clamp = useCallback(
    (n: number) => Math.max(0, Math.min(total - 1, n)),
    [total],
  );

  const next = useCallback(() => {
    setIdx((i) => clamp(i + 1));
  }, [clamp]);

  const prev = useCallback(() => {
    setIdx((i) => clamp(i - 1));
  }, [clamp]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIdx(0);
  }, []);

  // Autoplay loop
  useEffect(() => {
    if (!playing) return;
    if (idx >= total - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => {
      setIdx((i) => clamp(i + 1));
    }, speedMs);
    timerRef.current = t;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [playing, idx, total, speedMs, clamp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Keyboard shortcuts (when this player is focused)
  const rootRef = useRef<HTMLDivElement | null>(null);
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setPlaying((p) => !p);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPlaying(false);
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPlaying(false);
      prev();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
    }
  };

  const frame = frames[idx];
  const vars = useMemo(() => Object.entries(frame?.vars ?? {}), [frame]);

  if (!frame) {
    return (
      <div className="cx-card cx-empty">
        No visualization frames.
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="cx-card cx-stack"
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label={title ?? 'Step visualization'}
      style={{ gap: '0.75rem' }}
    >
      <div className="cx-row" style={{ justifyContent: 'space-between' }}>
        <div className="cx-small cx-muted">
          Step {idx + 1} / {total}
        </div>
        <div className="cx-row" style={{ gap: '0.4rem' }}>
          <button type="button" className="cx-btn cx-btn--sm" onClick={reset} aria-label="Reset">
            ↺ Reset
          </button>
          <button
            type="button"
            className="cx-btn cx-btn--sm"
            onClick={prev}
            disabled={idx === 0}
            aria-label="Previous step"
          >
            ←
          </button>
          <button
            type="button"
            className="cx-btn cx-btn--sm"
            onClick={() => setPlaying((p) => !p)}
            disabled={total <= 1 || idx >= total - 1}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '❚❚ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            className="cx-btn cx-btn--sm"
            onClick={next}
            disabled={idx >= total - 1}
            aria-label="Next step"
          >
            →
          </button>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, total - 1)}
        value={idx}
        onChange={(e) => {
          setPlaying(false);
          setIdx(clamp(Number(e.target.value)));
        }}
        aria-label="Step scrubber"
        style={{ width: '100%' }}
      />

      <FrameRenderer frame={frame} />

      <div
        className="cx-callout"
        aria-live="polite"
        aria-atomic="true"
        style={{ minHeight: '2.5rem' }}
      >
        {frame.description}
      </div>

      {vars.length > 0 && (
        <div className="cx-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          {vars.map(([k, v]) => (
            <span key={k} className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>
              <strong style={{ color: 'var(--cx-accent)' }}>{k}</strong> = {String(v)}
            </span>
          ))}
        </div>
      )}

      <div className="cx-small cx-muted">
        Shortcuts: <kbd>Space</kbd> play/pause · <kbd>←</kbd> <kbd>→</kbd> step · <kbd>R</kbd> reset
      </div>
    </div>
  );
}
