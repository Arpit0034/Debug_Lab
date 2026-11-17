/**
 * The only module allowed to touch localStorage.
 * Keys are versioned; bad or missing data falls back to defaults.
 */
export const STORAGE_VERSION = 'v1';
const PREFIX = `dsalab:${STORAGE_VERSION}:`;

export const STORAGE_KEYS = {
  progress: 'progress',
  settings: 'settings',
  bookmarks: 'bookmarks',
  session: 'session',
  concepts: "concepts",
  geminiKey: "gemini-key",
  conceptsPractice: "concepts-practice",
  conceptsPracticePrefs: "concepts-practice-prefs",
  groqKey: "groq-key",
  openrouterKey: "openrouter-key",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function readJSON<T>(key: StorageKey, fallback: T, validate: (v: unknown) => v is T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: StorageKey, value: unknown): boolean {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: StorageKey): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export function clearAll(): void {
  (Object.values(STORAGE_KEYS) as StorageKey[]).forEach(removeKey);
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
