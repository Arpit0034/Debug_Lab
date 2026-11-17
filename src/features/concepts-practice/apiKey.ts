import { readJSON, writeJSON } from '../../services/storage/storageService';

const KEY = 'gemini-key' as const;
const VALIDATE_TIMEOUT_MS = 10_000;

export type GeminiErrorKind =
  | 'missing-key'
  | 'invalid-key'
  | 'quota'
  | 'network'
  | 'server'
  | 'parse'
  | 'unknown';

export class GeminiError extends Error {
  kind: GeminiErrorKind;
  userMessage: string;
  retryable: boolean;
  statusCode?: number;

  constructor(
    kind: GeminiErrorKind,
    userMessage: string,
    opts: { statusCode?: number; cause?: unknown } = {},
  ) {
    super(userMessage);
    this.name = 'GeminiError';
    this.kind = kind;
    this.userMessage = userMessage;
    this.statusCode = opts.statusCode;
    this.retryable =
      kind === 'quota' || kind === 'network' || kind === 'server' || kind === 'parse';
    if (opts.cause !== undefined) (this as { cause?: unknown }).cause = opts.cause;
  }
}

interface StoredShape {
  key: string;
  savedAt: string;
}

function isStored(v: unknown): v is StoredShape {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as StoredShape).key === 'string'
  );
}

export function saveApiKey(rawKey: string): void {
  const key = rawKey.trim();
  if (!key) throw new GeminiError('missing-key', 'Paste your API key first.');
  if (key.length < 20) {
    throw new GeminiError(
      'invalid-key',
      'That does not look like a complete key (they are longer than 20 characters).',
    );
  }
  writeJSON(KEY, { key, savedAt: new Date().toISOString() } satisfies StoredShape);
}

export function loadStoredKey(): string | null {
  try {
    const raw = readJSON<unknown>(KEY, null, (v): v is unknown => v !== undefined);
    if (isStored(raw) && raw.key.length > 0) return raw.key;
  } catch {
    /* ignore */
  }
  return null;
}

export function loadApiKey(): string | null {
  const stored = loadStoredKey();
  if (stored) return stored;
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof envKey === 'string' && envKey.length > 0) return envKey;
  return null;
}

export function clearApiKey(): void {
  try {
    writeJSON(KEY, { key: '', savedAt: '' });
  } catch {
    /* ignore */
  }
}

export function maskKey(key: string): string {
  if (key.length <= 12) return '****';
  return key.slice(0, 8) + '…' + key.slice(-4);
}

export async function validateApiKey(rawKey: string): Promise<void> {
  const key = rawKey.trim();
  if (!key) throw new GeminiError('missing-key', 'Paste your API key first.');
  if (key.length < 20) {
    throw new GeminiError(
      'invalid-key',
      'That does not look like a complete key (they are longer than 20 characters).',
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VALIDATE_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models?key=' +
        encodeURIComponent(key),
      { signal: controller.signal },
    );
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new GeminiError(
        'network',
        'Gemini did not respond in time. Check your internet connection.',
      );
    }
    throw new GeminiError(
      'network',
      'Could not reach Gemini. Check your internet connection.',
      { cause: err },
    );
  } finally {
    clearTimeout(timer);
  }

  if (res.ok) return;
  if (res.status === 400 || res.status === 401 || res.status === 403) {
    throw new GeminiError(
      'invalid-key',
      'Gemini rejected this key. Copy the whole key from AI Studio and try again.',
      { statusCode: res.status },
    );
  }
  if (res.status === 429) {
    throw new GeminiError(
      'quota',
      'Gemini free tier quota exceeded. Wait a minute, or use a different key.',
      { statusCode: 429 },
    );
  }
  if (res.status >= 500) {
    throw new GeminiError(
      'server',
      'Gemini is having a server problem. Try again in a moment.',
      { statusCode: res.status },
    );
  }
  throw new GeminiError(
    'unknown',
    'Gemini returned status ' + res.status + '. Double-check the key and try again.',
    { statusCode: res.status },
  );
}

export function saveGroqKey(rawKey: string): void {
  const key = rawKey.trim();
  if (!key) throw new GeminiError('missing-key', 'Paste your Groq key first.');
  if (key.length < 20) {
    throw new GeminiError(
      'invalid-key',
      'That does not look like a complete Groq key (they start with gsk_ and are long).',
    );
  }
  writeJSON('groq-key', { key, savedAt: new Date().toISOString() });
}

/** Checks a Groq key against Groq without spending any tokens. */
export async function validateGroqKey(rawKey: string): Promise<void> {
  const key = rawKey.trim();
  if (!key) throw new GeminiError('missing-key', 'Paste your Groq key first.');
  if (key.length < 20) {
    throw new GeminiError(
      'invalid-key',
      'That does not look like a complete Groq key (they start with gsk_ and are long).',
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VALIDATE_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: 'Bearer ' + key },
      signal: controller.signal,
    });
  } catch {
    throw new GeminiError('network', 'Could not reach Groq. Check your internet connection.');
  } finally {
    clearTimeout(timer);
  }
  if (res.ok) return;
  if (res.status === 401 || res.status === 403) {
    throw new GeminiError(
      'invalid-key',
      'Groq rejected this key. Copy the whole key from console.groq.com and try again.',
      { statusCode: res.status },
    );
  }
  if (res.status === 429) {
    throw new GeminiError('quota', 'Groq is rate limiting you. Wait a minute and try again.', { statusCode: 429 });
  }
  throw new GeminiError('unknown', 'Groq returned status ' + res.status + '. Try again.', { statusCode: res.status });
}

export function loadGroqKey(): string | null {
  try {
    const raw = readJSON<unknown>('groq-key', null, (v): v is unknown => v !== undefined);
    if (isStored(raw) && raw.key.length > 0) return raw.key;
  } catch { /* ignore */ }
  return null;
}



/**
 * Question generation (and the AI tutor) run on Groq, so the Groq key is the one that
 * unlocks the practice page. The Gemini key is only needed for voice grading.
 */
export function loadAnyKey(): string | null {
  return loadGroqKey();
}
