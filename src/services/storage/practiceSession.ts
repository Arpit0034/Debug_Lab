import type { PracticeSession } from '../../types/progress';
import { STORAGE_KEYS, isRecord, readJSON, removeKey, writeJSON } from './storageService';

function isSession(v: unknown): v is PracticeSession | null {
  if (v === null) return true;
  return (
    isRecord(v) &&
    typeof v.mode === 'string' &&
    typeof v.label === 'string' &&
    Array.isArray(v.queue) &&
    v.queue.every((x) => typeof x === 'string') &&
    typeof v.index === 'number' &&
    typeof v.startedAt === 'number'
  );
}

export function loadSession(): PracticeSession | null {
  return readJSON<PracticeSession | null>(STORAGE_KEYS.session, null, isSession);
}

export function saveSession(session: PracticeSession | null): void {
  if (session === null) removeKey(STORAGE_KEYS.session);
  else writeJSON(STORAGE_KEYS.session, session);
}
