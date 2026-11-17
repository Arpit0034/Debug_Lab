import { readJSON, writeJSON } from '../../services/storage/storageService';
import type { Difficulty, RoundResult } from './types';
import { roundQuestions } from './types';

const KEY = 'concepts-practice' as const;
const EMPTY = { concepts: {} as Record<string, { lastScore: number; lastSeen: string; attempts: number }>, sessions: [] as Array<{ date: string; results: RoundResult[] }> };
type ProgressState = typeof EMPTY;

export function loadProgress(): ProgressState {
  try {
    const raw = readJSON<unknown>(KEY, EMPTY, (v): v is unknown => v !== undefined);
    if (typeof raw === 'object' && raw !== null) {
      const r = raw as Partial<ProgressState>;
      return {
        concepts:
          r.concepts && typeof r.concepts === 'object' ? r.concepts : {},
        sessions: Array.isArray(r.sessions) ? r.sessions : [],
      };
    }
  } catch {
    /* fall through */
  }
  return EMPTY;
}

export function recordRound(conceptId: string, explanationScore: number): void {
  const p = loadProgress();
  const prev = p.concepts[conceptId] || { lastScore: 0, lastSeen: '', attempts: 0 };
  p.concepts[conceptId] = {
    lastScore: explanationScore,
    lastSeen: new Date().toISOString(),
    attempts: prev.attempts + 1,
  };
  writeJSON(KEY, p);
}

export function recordSession(results: RoundResult[]): void {
  const p = loadProgress();
  p.sessions.push({ date: new Date().toISOString(), results });
  writeJSON(KEY, p);
}

/**
 * Pick the next concept at random, but not evenly: concepts you have never practised or scored
 * low on are much more likely, and so are ones you have not seen for a while. Nothing is ever
 * ruled out, so every session feels different and strong concepts still come back now and then.
 */
export function pickWeakestConcept(
  ids: string[],
  excluded: Set<string>,
  rand: () => number = Math.random,
): string | null {
  const p = loadProgress();
  const candidates = ids.filter((id) => !excluded.has(id));
  if (candidates.length === 0) return null;
  const now = Date.now();
  const weights = candidates.map((id) => {
    const rec = p.concepts[id];
    if (!rec) return 6; // never practised: strongest pull
    const score = Math.min(5, Math.max(0, rec.lastScore));
    const days = rec.lastSeen ? (now - Date.parse(rec.lastSeen)) / 86_400_000 : 0;
    const stale = Number.isFinite(days) ? Math.min(2, Math.max(0, days) / 7) : 0;
    return 1 + (5 - score) * 0.8 + stale; // weak and stale first, strong still possible
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

/** Question texts already asked for a concept, newest first, so the model can avoid repeats. */
export function recentQuestionsFor(conceptId: string, limit = 9): string[] {
  const out: string[] = [];
  const sessions = loadProgress().sessions;
  for (let i = sessions.length - 1; i >= 0 && out.length < limit; i--) {
    const results = Array.isArray(sessions[i].results) ? sessions[i].results : [];
    for (let j = results.length - 1; j >= 0 && out.length < limit; j--) {
      if (results[j].conceptId !== conceptId) continue;
      for (const a of roundQuestions(results[j])) {
        if (a.mc?.question && out.length < limit) out.push(a.mc.question);
      }
    }
  }
  return out;
}

export interface PracticePrefs {
  difficulty: Difficulty;
  perRound: 1 | 2 | 3;
  rounds: number;
}

const PREFS_KEY = 'concepts-practice-prefs' as const;
export const DEFAULT_PREFS: PracticePrefs = { difficulty: 'medium', perRound: 3, rounds: 5 };

export function loadPrefs(): PracticePrefs {
  const raw = readJSON<unknown>(PREFS_KEY, DEFAULT_PREFS, (v): v is unknown => v !== undefined);
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<PracticePrefs>;
  return {
    difficulty:
      r.difficulty === 'easy' || r.difficulty === 'medium' || r.difficulty === 'hard'
        ? r.difficulty
        : DEFAULT_PREFS.difficulty,
    perRound: r.perRound === 1 || r.perRound === 2 || r.perRound === 3 ? r.perRound : DEFAULT_PREFS.perRound,
    rounds:
      r.rounds === 5 || r.rounds === 7 ? r.rounds : DEFAULT_PREFS.rounds,
  };
}

export const DAILY_SESSION_LIMIT = 50;
const DAILY_KEY = 'concepts-practice-daily';

function todayKey(): string {
  const d = new Date(); // local date, so the limit resets at the user's midnight
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function sessionsUsedToday(): number {
  try {
    const raw = JSON.parse(localStorage.getItem(DAILY_KEY) ?? 'null') as { date?: unknown; count?: unknown } | null;
    return raw && raw.date === todayKey() && typeof raw.count === 'number' && raw.count > 0 ? raw.count : 0;
  } catch {
    return 0;
  }
}

/** How many sessions can still be started today. */
export function sessionsLeftToday(): number {
  return Math.max(0, DAILY_SESSION_LIMIT - sessionsUsedToday());
}

/** Count one started session. Returns false (and counts nothing) when today's limit is used up. */
export function tryStartSession(): boolean {
  const used = sessionsUsedToday();
  if (used >= DAILY_SESSION_LIMIT) return false;
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify({ date: todayKey(), count: used + 1 }));
  } catch {
    /* storage blocked: do not lock the user out */
  }
  return true;
}

export function savePrefs(prefs: PracticePrefs): void {
  writeJSON(PREFS_KEY, prefs);
}

/** Small summary for the Concepts hub banner. */
export function practiceSummary(): { practiced: number; lastSessionAvg: number | null } {
  const p = loadProgress();
  const practiced = Object.keys(p.concepts).length;
  const last = [...p.sessions].reverse().find((s) => Array.isArray(s.results) && s.results.length > 0);
  if (!last) return { practiced, lastSessionAvg: null };
  const avg = last.results.reduce((a, r) => a + (r.explanation?.score ?? 0), 0) / last.results.length;
  return { practiced, lastSessionAvg: Math.round(avg * 10) / 10 };
}

/** Save (or update) a session as it goes, so quitting early does not lose it. */
export function upsertSession(startedAt: string, results: RoundResult[]): void {
  const p = loadProgress();
  const i = p.sessions.findIndex((s) => s.date === startedAt);
  const entry = { date: startedAt, results };
  if (i >= 0) p.sessions[i] = entry;
  else p.sessions.push(entry);
  writeJSON(KEY, p);
}
