import type { Attempt } from '../../types/progress';
import type { Difficulty, Language, Problem } from '../../types/problem';

const DAY = 86_400_000;

/** Whole-day index in local time, so streaks follow the person's own calendar days. */
export function dayIndex(ts: number): number {
  const d = new Date(ts);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
}

export function computeStreaks(attempts: Attempt[], now: number): { current: number; longest: number } {
  const days = Array.from(new Set(attempts.map((a) => dayIndex(a.timestamp)))).sort((a, b) => a - b);
  if (days.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] === days[i - 1] + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const today = dayIndex(now);
  const set = new Set(days);
  // A streak is still alive if the last practice was today or yesterday.
  let cursor = set.has(today) ? today : set.has(today - 1) ? today - 1 : null;
  let current = 0;
  while (cursor !== null && set.has(cursor)) {
    current++;
    cursor--;
  }
  return { current, longest };
}

const isCorrect = (a: Attempt) => a.bugResult === 'correct';
const ratio = (n: number, d: number): number | null => (d === 0 ? null : n / d);

export interface Overview {
  totalProblems: number;
  attemptedProblems: number;
  solvedProblems: number;
  totalAttempts: number;
  incorrectAttempts: number;
  accuracy: number | null;
  firstAttemptAccuracy: number | null;
  avgDebugSec: number | null;
  withinTimeCount: number;
  currentStreak: number;
  longestStreak: number;
}

export function computeOverview(attempts: Attempt[], problems: Problem[], now: number): Overview {
  const ids = new Set(problems.map((p) => p.id));
  const mine = attempts.filter((a) => ids.has(a.problemId));
  const attempted = new Set(mine.map((a) => a.problemId));
  const solved = new Set(mine.filter(isCorrect).map((a) => a.problemId));
  const first = mine.filter((a) => a.firstAttempt);
  const timed = mine.filter((a) => isCorrect(a) && a.timeSpentSec > 0);
  const streaks = computeStreaks(mine, now);
  return {
    totalProblems: problems.length,
    attemptedProblems: attempted.size,
    solvedProblems: solved.size,
    totalAttempts: mine.length,
    incorrectAttempts: mine.filter((a) => !isCorrect(a)).length,
    accuracy: ratio(mine.filter(isCorrect).length, mine.length),
    firstAttemptAccuracy: ratio(first.filter(isCorrect).length, first.length),
    avgDebugSec: timed.length ? timed.reduce((s, a) => s + a.timeSpentSec, 0) / timed.length : null,
    withinTimeCount: mine.filter((a) => isCorrect(a) && a.withinTime).length,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
  };
}

export interface TopicRow {
  topic: string;
  total: number;
  attempted: number;
  solved: number;
  attempts: number;
  accuracy: number | null;
}

export function byTopic(attempts: Attempt[], problems: Problem[]): TopicRow[] {
  const topicOf = new Map(problems.map((p) => [p.id, p.topic]));
  const rows = new Map<string, TopicRow & { _att: Set<string>; _sol: Set<string>; _ok: number }>();
  for (const p of problems) {
    if (!rows.has(p.topic)) {
      rows.set(p.topic, {
        topic: p.topic, total: 0, attempted: 0, solved: 0, attempts: 0, accuracy: null,
        _att: new Set(), _sol: new Set(), _ok: 0,
      });
    }
    rows.get(p.topic)!.total++;
  }
  for (const a of attempts) {
    const t = topicOf.get(a.problemId);
    const row = t ? rows.get(t) : undefined;
    if (!row) continue;
    row.attempts++;
    row._att.add(a.problemId);
    if (isCorrect(a)) {
      row._ok++;
      row._sol.add(a.problemId);
    }
  }
  return Array.from(rows.values())
    .map((r) => ({
      topic: r.topic, total: r.total, attempted: r._att.size, solved: r._sol.size,
      attempts: r.attempts, accuracy: ratio(r._ok, r.attempts),
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic));
}

export interface AccuracyRow {
  key: string;
  attempts: number;
  accuracy: number | null;
}

function groupAccuracy(attempts: Attempt[], keyOf: (a: Attempt) => string | undefined, keys: string[]): AccuracyRow[] {
  return keys.map((key) => {
    const rows = attempts.filter((a) => keyOf(a) === key);
    return { key, attempts: rows.length, accuracy: ratio(rows.filter(isCorrect).length, rows.length) };
  });
}

export function byDifficulty(attempts: Attempt[], problems: Problem[]): AccuracyRow[] {
  const d = new Map(problems.map((p) => [p.id, p.difficulty as string]));
  const keys: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  return groupAccuracy(attempts, (a) => d.get(a.problemId), keys);
}

export function byLanguage(attempts: Attempt[]): AccuracyRow[] {
  const keys: Language[] = ['java', 'python', 'c'];
  return groupAccuracy(attempts, (a) => a.language, keys);
}

export interface DayCount {
  label: string;
  count: number;
}

/** Attempts per day for the last 7 days, oldest first, ending today. */
export function weeklyActivity(attempts: Attempt[], now: number): DayCount[] {
  const out: DayCount[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const idx = dayIndex(day.getTime());
    out.push({
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      count: attempts.filter((a) => dayIndex(a.timestamp) === idx).length,
    });
  }
  return out;
}

export interface Improvement {
  recent: number | null;
  prior: number | null;
  /** Percentage points. Null until both windows have attempts. */
  delta: number | null;
}

export function improvement(attempts: Attempt[], now: number, days: number): Improvement {
  const recent = attempts.filter((a) => a.timestamp > now - days * DAY && a.timestamp <= now);
  const prior = attempts.filter((a) => a.timestamp > now - 2 * days * DAY && a.timestamp <= now - days * DAY);
  const r = ratio(recent.filter(isCorrect).length, recent.length);
  const p = ratio(prior.filter(isCorrect).length, prior.length);
  return { recent: r, prior: p, delta: r !== null && p !== null ? Math.round((r - p) * 100) : null };
}

export function missedCategories(attempts: Attempt[], problems: Problem[], limit = 5): { category: string; count: number }[] {
  const cat = new Map(problems.map((p) => [p.id, p.bugCategory]));
  const counts = new Map<string, number>();
  for (const a of attempts) {
    if (isCorrect(a)) continue;
    const c = cat.get(a.problemId);
    if (c) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return Array.from(counts, ([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .slice(0, limit);
}

export function fixStats(attempts: Attempt[]) {
  const fixes = attempts.flatMap((a) => a.fixes);
  return {
    verified: fixes.filter((f) => f.status === 'verified').length,
    selfVerified: fixes.filter((f) => f.status === 'self-verified').length,
    unverified: fixes.filter((f) => f.status === 'unverified').length,
  };
}

export function complexityStats(attempts: Attempt[]) {
  const done = attempts.flatMap((a) => (a.complexity ? [a.complexity] : []));
  return {
    submitted: done.length,
    time: ratio(done.filter((c) => c.timeCorrect).length, done.length),
    space: ratio(done.filter((c) => c.spaceCorrect).length, done.length),
  };
}

/** Topics the person has tried and gets wrong often, weakest first. */
export function weakTopics(attempts: Attempt[], problems: Problem[], threshold = 0.7): string[] {
  return byTopic(attempts, problems)
    .filter((r) => r.attempts > 0 && r.accuracy !== null && r.accuracy < threshold)
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0) || a.topic.localeCompare(b.topic))
    .map((r) => r.topic);
}
