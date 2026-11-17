import { EMPTY_PROGRESS, type Attempt, type Draft, type ProgressData } from '../../types/progress';
import type { Language } from '../../types/problem';
import { STORAGE_KEYS, isRecord, readJSON, writeJSON, removeKey } from './storageService';

export function isProgressData(v: unknown): v is ProgressData {
  return (
    isRecord(v) &&
    Array.isArray(v.attempts) &&
    isRecord(v.drafts) &&
    (v.lastVisited === null || isRecord(v.lastVisited))
  );
}

export function loadProgress(): ProgressData {
  const data = readJSON<ProgressData>(STORAGE_KEYS.progress, EMPTY_PROGRESS, isProgressData);
  // Drop attempts that lost required fields so analytics never crash on bad data.
  const attempts = data.attempts.filter(
    (a): a is Attempt =>
      isRecord(a) &&
      typeof a.problemId === 'string' &&
      typeof a.timestamp === 'number' &&
      typeof a.bugResult === 'string',
  );
  return { ...data, attempts };
}

function save(data: ProgressData): void {
  writeJSON(STORAGE_KEYS.progress, data);
}

export function addAttempt(attempt: Attempt): ProgressData {
  const data = loadProgress();
  const next = { ...data, attempts: [...data.attempts, attempt] };
  save(next);
  return next;
}

export function updateAttempt(id: string, patch: Partial<Attempt>): ProgressData {
  const data = loadProgress();
  const next = {
    ...data,
    attempts: data.attempts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
  };
  save(next);
  return next;
}

export function saveDraft(problemId: string, draft: Draft): void {
  const data = loadProgress();
  save({ ...data, drafts: { ...data.drafts, [problemId]: draft } });
}

export function clearDraft(problemId: string): void {
  const data = loadProgress();
  const drafts = { ...data.drafts };
  delete drafts[problemId];
  save({ ...data, drafts });
}

export function setLastVisited(problemId: string, language: Language): void {
  const data = loadProgress();
  save({ ...data, lastVisited: { problemId, language } });
}

export function replaceProgress(data: ProgressData): void {
  save(data);
}

export function resetProgress(): void {
  removeKey(STORAGE_KEYS.progress);
}
