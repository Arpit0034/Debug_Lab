import type { TimerRecord } from '../../types/progress';

export interface TimerState {
  elapsedMs: number;
  /** Timestamp the current run began, or null when paused or not started. */
  runningSince: number | null;
  started: boolean;
}

export const initialTimer = (): TimerState => ({ elapsedMs: 0, runningSince: null, started: false });

export function elapsedSec(t: TimerState, now: number): number {
  const live = t.runningSince !== null ? Math.max(0, now - t.runningSince) : 0;
  return Math.floor((t.elapsedMs + live) / 1000);
}

/** Seconds left. Negative means overtime. Nothing is ever revealed or locked when it passes zero. */
export function remainingSec(limitSec: number, t: TimerState, now: number): number {
  return limitSec - elapsedSec(t, now);
}

/** Starts the timer on first interaction only. A deliberate pause is never undone by interacting. */
export function startOnce(t: TimerState, now: number): TimerState {
  return t.started ? t : { elapsedMs: 0, runningSince: now, started: true };
}

/**
 * Timer state for the moment a problem is opened.
 * - First visit: starts right away.
 * - Returning to a saved draft that was running when the person left: continues from where it was.
 * - Returning to a draft they had deliberately paused: stays paused until they press Resume.
 * Time spent away from the page is never counted.
 */
export function startOnOpen(saved: TimerRecord | undefined, now: number): TimerState {
  if (!saved) return startOnce(initialTimer(), now);
  const restored = fromRecord(saved);
  return saved.running ? resumeTimer(restored, now) : restored;
}

export function pauseTimer(t: TimerState, now: number): TimerState {
  if (t.runningSince === null) return t;
  return { ...t, elapsedMs: t.elapsedMs + Math.max(0, now - t.runningSince), runningSince: null };
}

export function resumeTimer(t: TimerState, now: number): TimerState {
  if (!t.started || t.runningSince !== null) return t;
  return { ...t, runningSince: now };
}

export function toRecord(t: TimerState, now: number): TimerRecord {
  return { elapsedSec: elapsedSec(t, now), running: t.runningSince !== null, startedAt: t.runningSince };
}

/** A saved timer comes back paused, so time while the tab was closed is never counted. */
export function fromRecord(r: TimerRecord | undefined): TimerState {
  if (!r) return initialTimer();
  return { elapsedMs: Math.max(0, r.elapsedSec) * 1000, runningSince: null, started: r.elapsedSec > 0 || r.running };
}

export function formatClock(sec: number): string {
  const abs = Math.abs(sec);
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return `${sec < 0 ? '-' : ''}${m}:${String(s).padStart(2, '0')}`;
}
