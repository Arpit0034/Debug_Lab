import { describe, expect, it } from 'vitest';
import {
  elapsedSec, formatClock, fromRecord, initialTimer, pauseTimer, remainingSec, resumeTimer, startOnce, startOnOpen, toRecord,
} from './timer';

describe('timer', () => {
  it('does not run until first interaction', () => {
    expect(elapsedSec(initialTimer(), 99_000)).toBe(0);
  });
  it('counts while running and stops when paused', () => {
    let t = startOnce(initialTimer(), 1_000);
    expect(elapsedSec(t, 11_000)).toBe(10);
    t = pauseTimer(t, 11_000);
    expect(elapsedSec(t, 500_000)).toBe(10);
    t = resumeTimer(t, 500_000);
    expect(elapsedSec(t, 505_000)).toBe(15);
  });
  it('interacting after a pause does not restart it', () => {
    const paused = pauseTimer(startOnce(initialTimer(), 0), 5_000);
    expect(startOnce(paused, 9_000)).toBe(paused);
  });
  it('goes negative after the limit without any lock', () => {
    const t = startOnce(initialTimer(), 0);
    expect(remainingSec(300, t, 330_000)).toBe(-30);
  });
  it('restores paused so closed-tab time is not counted', () => {
    const t = fromRecord(toRecord(startOnce(initialTimer(), 0), 42_000));
    expect(t.runningSince).toBeNull();
    expect(elapsedSec(t, 9_999_999)).toBe(42);
    expect(t.started).toBe(true);
  });
  it('starts immediately when a problem is opened for the first time', () => {
    const t = startOnOpen(undefined, 1_000);
    expect(t.started).toBe(true);
    expect(elapsedSec(t, 31_000)).toBe(30);
  });
  it('continues a saved timer that was running when the person left, without counting time away', () => {
    const t = startOnOpen({ elapsedSec: 40, running: true, startedAt: 0 }, 900_000);
    expect(elapsedSec(t, 900_000)).toBe(40);
    expect(elapsedSec(t, 910_000)).toBe(50);
  });
  it('keeps a deliberately paused timer paused on reopen', () => {
    const t = startOnOpen({ elapsedSec: 40, running: false, startedAt: null }, 900_000);
    expect(t.runningSince).toBeNull();
    expect(elapsedSec(t, 999_000)).toBe(40);
  });
  it('formats clocks', () => {
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(-5)).toBe('-0:05');
  });
});
