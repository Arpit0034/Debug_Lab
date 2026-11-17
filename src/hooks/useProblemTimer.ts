import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimerRecord } from '../types/progress';
import {
  elapsedSec, pauseTimer, resumeTimer, startOnce, startOnOpen, toRecord, type TimerState,
} from '../services/timer/timer';

/** Starts counting as soon as the problem is opened. */
export function useProblemTimer(saved: TimerRecord | undefined) {
  const [state, setState] = useState<TimerState>(() => startOnOpen(saved, Date.now()));
  const [now, setNow] = useState(() => Date.now());
  const stateRef = useRef(state);
  stateRef.current = state;

  const running = state.runningSince !== null;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setState((s) => startOnce(s, t));
  }, []);
  const pause = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setState((s) => pauseTimer(s, t));
  }, []);
  const resume = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setState((s) => resumeTimer(s, t));
  }, []);
  const snapshot = useCallback((): TimerRecord => toRecord(stateRef.current, Date.now()), []);
  const elapsed = useCallback((): number => elapsedSec(stateRef.current, Date.now()), []);

  return { state, now, running, start, pause, resume, snapshot, elapsed };
}
