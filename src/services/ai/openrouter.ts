import { readJSON, writeJSON } from '../storage/storageService';

/**
 * Nemotron 3 Ultra through OpenRouter. Every user brings their own free OpenRouter key.
 * The ":free" suffix is part of the id: it selects the free endpoint.
 */
export const NEMOTRON_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const KEY_ENDPOINT = 'https://openrouter.ai/api/v1/key';
const REQUEST_TIMEOUT_MS = 90_000; // a very large model on a free endpoint can be slow
const VALIDATE_TIMEOUT_MS = 10_000;

export type OpenRouterErrorKind =
  | 'missing-key'
  | 'invalid-key'
  | 'quota'
  | 'network'
  | 'server'
  | 'parse'
  | 'unknown';

export class OpenRouterError extends Error {
  kind: OpenRouterErrorKind;
  userMessage: string;
  statusCode?: number;

  constructor(kind: OpenRouterErrorKind, userMessage: string, statusCode?: number) {
    super(userMessage);
    this.name = 'OpenRouterError';
    this.kind = kind;
    this.userMessage = userMessage;
    this.statusCode = statusCode;
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface StoredShape {
  key: string;
  savedAt: string;
}

function isStored(v: unknown): v is StoredShape {
  return typeof v === 'object' && v !== null && typeof (v as StoredShape).key === 'string';
}

export function loadOpenRouterKey(): string | null {
  try {
    const raw = readJSON<unknown>('openrouter-key', null, (v): v is unknown => v !== undefined);
    if (isStored(raw) && raw.key.length > 0) return raw.key;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveOpenRouterKey(rawKey: string): void {
  const key = rawKey.trim();
  if (!key) throw new OpenRouterError('missing-key', 'Paste your OpenRouter key first.');
  if (key.length < 20) {
    throw new OpenRouterError(
      'invalid-key',
      'That does not look like a complete key. OpenRouter keys start with sk-or- and are long.',
    );
  }
  writeJSON('openrouter-key', { key, savedAt: new Date().toISOString() } satisfies StoredShape);
}

export function clearOpenRouterKey(): void {
  writeJSON('openrouter-key', { key: '', savedAt: '' });
}

/** Checks the key against OpenRouter without spending any tokens. */
export async function validateOpenRouterKey(rawKey: string): Promise<void> {
  const key = rawKey.trim();
  if (!key) throw new OpenRouterError('missing-key', 'Paste your OpenRouter key first.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VALIDATE_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(KEY_ENDPOINT, {
      headers: { Authorization: 'Bearer ' + key },
      signal: controller.signal,
    });
  } catch {
    throw new OpenRouterError('network', 'Could not reach OpenRouter. Check your internet connection.');
  } finally {
    clearTimeout(timer);
  }
  if (res.ok) return;
  if (res.status === 401 || res.status === 403) {
    throw new OpenRouterError(
      'invalid-key',
      'OpenRouter rejected this key. Copy the whole key (it starts with sk-or-) and try again.',
      res.status,
    );
  }
  if (res.status === 429) {
    throw new OpenRouterError('quota', 'OpenRouter is rate limiting you. Wait a minute and try again.', 429);
  }
  throw new OpenRouterError('unknown', 'OpenRouter returned status ' + res.status + '.', res.status);
}

/** Sends a chat to Nemotron 3 Ultra (free) and returns the answer text. */
export async function askNemotron(messages: ChatMessage[], maxTokens = 1500): Promise<string> {
  const key = loadOpenRouterKey();
  if (!key) {
    throw new OpenRouterError('missing-key', 'Add your free OpenRouter key first.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        'X-Title': 'DSA Debugging Lab',
        ...(typeof window !== 'undefined' ? { 'HTTP-Referer': window.location.origin } : {}),
      },
      body: JSON.stringify({
        model: NEMOTRON_MODEL,
        messages,
        temperature: 0.5,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new OpenRouterError('network', 'The AI took too long to answer. Try again in a moment.');
    }
    throw new OpenRouterError('network', 'Could not reach OpenRouter. Check your internet connection.');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      detail = body?.error?.message ?? '';
    } catch {
      /* no body */
    }
    if (res.status === 404) {
      throw new OpenRouterError(
        'unknown',
        'OpenRouter has no free endpoint for your account settings. Open openrouter.ai/settings/privacy, turn on the option that allows free models (they may log prompts), then try again.' +
          (detail ? ' (' + detail + ')' : ''),
        404,
      );
    }
    if (res.status === 401 || res.status === 403) {
      throw new OpenRouterError(
        'invalid-key',
        'OpenRouter rejected your key (expired or revoked). Add a new key to continue.',
        res.status,
      );
    }
    if (res.status === 402 || res.status === 429) {
      throw new OpenRouterError(
        'quota',
        'The free limit was reached. Free models allow a limited number of requests per minute and per day. Wait a bit and try again.',
        res.status,
      );
    }
    if (res.status >= 500) {
      throw new OpenRouterError('server', 'OpenRouter or the free model is busy. Try again in a moment.', res.status);
    }
    throw new OpenRouterError(
      'unknown',
      'OpenRouter returned status ' + res.status + (detail ? ': ' + detail : '.'),
      res.status,
    );
  }

  let data: {
    choices?: Array<{ message?: { content?: string | null } }>;
    error?: { message?: string; code?: number };
  };
  try {
    data = await res.json();
  } catch {
    throw new OpenRouterError('parse', 'OpenRouter returned an unreadable response. Try again.');
  }
  if (data.error) {
    const code = typeof data.error.code === 'number' ? data.error.code : undefined;
    throw new OpenRouterError(
      code === 429 ? 'quota' : 'server',
      data.error.message || 'The AI returned an error. Try again.',
      code,
    );
  }
  const text = data.choices?.[0]?.message?.content;
  if (!text || !text.trim()) {
    throw new OpenRouterError('parse', 'The AI returned an empty answer. Try again.');
  }
  return text.trim();
}
