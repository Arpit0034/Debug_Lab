import { useSyncExternalStore } from 'react';

export type Provider = 'groq' | 'gemini';

export interface UsageBucket {
  calls: number;
  input: number;
  output: number;
  total: number;
}

/** Live limits Groq reports in its response headers (null until the first call). */
export interface GroqLimits {
  requestsLimit: number | null;   // per day
  requestsRemaining: number | null;
  tokensLimit: number | null;     // per minute
  tokensRemaining: number | null;
  tokensReset: string | null;
}

export interface UsageState {
  groq: UsageBucket;
  gemini: UsageBucket;
  groqLimits: GroqLimits | null;
}

const empty = (): UsageBucket => ({ calls: 0, input: 0, output: 0, total: 0 });

// Replaced (never mutated) on every change, so useSyncExternalStore sees a new snapshot.
let state: UsageState = { groq: empty(), gemini: empty(), groqLimits: null };
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

/** Called from the API wrappers with the token counts the provider reports. */
export function recordUsage(provider: Provider, input: number, output: number, total?: number): void {
  const i = Number.isFinite(input) ? input : 0;
  const o = Number.isFinite(output) ? output : 0;
  const t = total !== undefined && Number.isFinite(total) ? total : i + o;
  const prev = state[provider];
  state = {
    ...state,
    [provider]: { calls: prev.calls + 1, input: prev.input + i, output: prev.output + o, total: prev.total + t },
  };
  emit();
}

/** Called with the real quota numbers Groq returns on every response. */
export function recordGroqLimits(headers: Headers): void {
  const num = (k: string): number | null => {
    const v = headers.get(k);
    const n = v === null ? NaN : Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const limits: GroqLimits = {
    requestsLimit: num('x-ratelimit-limit-requests'),
    requestsRemaining: num('x-ratelimit-remaining-requests'),
    tokensLimit: num('x-ratelimit-limit-tokens'),
    tokensRemaining: num('x-ratelimit-remaining-tokens'),
    tokensReset: headers.get('x-ratelimit-reset-tokens'),
  };
  if (limits.requestsLimit === null && limits.tokensLimit === null) return; // headers not readable
  state = { ...state, groqLimits: limits };
  emit();
}

/** Start of a new practice session. Keeps groqLimits: that is account-level, not per-session. */
export function resetUsage(): void {
  state = { groq: empty(), gemini: empty(), groqLimits: state.groqLimits };
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useUsage(): UsageState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}
