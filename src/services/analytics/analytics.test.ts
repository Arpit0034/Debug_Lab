import { describe, expect, it } from 'vitest';
import type { Attempt } from '../../types/progress';
import { problems } from '../../data/problemRegistry';
import {
  byDifficulty, byTopic, computeOverview, computeStreaks, fixStats, improvement, missedCategories, weakTopics, weeklyActivity,
} from './analytics';
import { buildQueue, shuffle } from '../practice/queue';

const NOW = new Date(2026, 10, 10, 12).getTime();
const day = (back: number, hour = 10) => new Date(2026, 10, 10 - back, hour).getTime();

let n = 0;
function att(problemId: string, bugResult: Attempt['bugResult'], ts: number, extra: Partial<Attempt> = {}): Attempt {
  return {
    id: String(n++), problemId, language: 'python', timestamp: ts, selectedLines: [1], bugResult, fixes: [],
    timeSpentSec: 60, withinTime: true, firstAttempt: true, ...extra,
  };
}

describe('streaks', () => {
  it('is zero with no attempts', () => {
    expect(computeStreaks([], NOW)).toEqual({ current: 0, longest: 0 });
  });
  it('counts consecutive days ending today', () => {
    const a = [att('p001', 'correct', day(0)), att('p001', 'correct', day(1)), att('p002', 'correct', day(2))];
    expect(computeStreaks(a, NOW)).toEqual({ current: 3, longest: 3 });
  });
  it('stays alive if the last practice was yesterday', () => {
    expect(computeStreaks([att('p001', 'correct', day(1))], NOW).current).toBe(1);
  });
  it('breaks after a missed day but keeps the longest', () => {
    const a = [day(5), day(4), day(3), day(0)].map((d) => att('p001', 'correct', d));
    expect(computeStreaks(a, NOW)).toEqual({ current: 1, longest: 3 });
  });
  it('several attempts on one day count once', () => {
    const a = [att('p001', 'correct', day(0, 9)), att('p002', 'correct', day(0, 11))];
    expect(computeStreaks(a, NOW).longest).toBe(1);
  });
});

describe('overview', () => {
  const a = [
    att('p001', 'correct', day(0), { timeSpentSec: 100 }),
    att('p002', 'incorrect', day(0)),
    att('p002', 'correct', day(0), { firstAttempt: false, timeSpentSec: 200 }),
  ];
  const o = computeOverview(a, problems, NOW);
  it('counts unique problems', () => {
    expect(o.attemptedProblems).toBe(2);
    expect(o.solvedProblems).toBe(2);
    expect(o.incorrectAttempts).toBe(1);
  });
  it('computes accuracy and first-attempt accuracy', () => {
    expect(o.accuracy).toBeCloseTo(2 / 3);
    expect(o.firstAttemptAccuracy).toBeCloseTo(1 / 2);
  });
  it('averages time over solved attempts only', () => {
    expect(o.avgDebugSec).toBe(150);
  });
  it('is honest when empty', () => {
    const e = computeOverview([], problems, NOW);
    expect(e.accuracy).toBeNull();
    expect(e.avgDebugSec).toBeNull();
    expect(e.attemptedProblems).toBe(0);
  });
});

describe('grouping', () => {
  it('groups by topic and difficulty from attempts', () => {
    const a = [att('p001', 'correct', day(0)), att('p001', 'incorrect', day(0))];
    expect(byTopic(a, problems).find((r) => r.topic === 'Searching')?.accuracy).toBe(0.5);
    expect(byDifficulty(a, problems).find((r) => r.key === 'Easy')?.attempts).toBe(2);
    expect(byDifficulty(a, problems).find((r) => r.key === 'Hard')?.accuracy).toBeNull();
  });
  it('weekly activity has 7 days ending today', () => {
    const w = weeklyActivity([att('p001', 'correct', day(0)), att('p001', 'correct', day(6))], NOW);
    expect(w).toHaveLength(7);
    expect(w[6].count).toBe(1);
    expect(w[0].count).toBe(1);
  });
  it('lists most missed categories', () => {
    const a = [att('p001', 'incorrect', day(0)), att('p001', 'partial', day(0)), att('p002', 'incorrect', day(0))];
    expect(missedCategories(a, problems)[0]).toEqual({ category: 'Incorrect Binary Search Boundary', count: 2 });
  });
  it('splits verified and self-verified fixes', () => {
    const a = [att('p001', 'correct', day(0), { fixes: [
      { line: 1, submitted: 'x', status: 'verified' }, { line: 2, submitted: 'y', status: 'self-verified' },
    ] })];
    expect(fixStats(a)).toEqual({ verified: 1, selfVerified: 1, unverified: 0 });
  });
});

describe('improvement and weak topics', () => {
  it('needs both windows', () => {
    expect(improvement([att('p001', 'correct', day(1))], NOW, 7).delta).toBeNull();
  });
  it('compares the last window with the one before', () => {
    const a = [att('p001', 'incorrect', day(10)), att('p001', 'correct', day(2))];
    expect(improvement(a, NOW, 7).delta).toBe(100);
  });
  it('finds weak topics only from real attempts', () => {
    expect(weakTopics([], problems)).toEqual([]);
    expect(weakTopics([att('p001', 'incorrect', day(0))], problems)).toEqual(['Searching']);
  });
});

describe('practice queues', () => {
  const ctx = { problems, attempts: [] as Attempt[], bookmarks: ['p003'] };
  it('shuffle keeps every item', () => {
    expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
  it('topic mode only returns that topic', () => {
    expect(buildQueue('topic', ctx, { topic: 'Graphs' })).toEqual(
      problems.filter((p) => p.topic === 'Graphs').map((p) => p.id),
    );
  });
  it('interview mode excludes Easy', () => {
    const q = buildQueue('interview', ctx);
    expect(q.every((id) => problems.find((p) => p.id === id)!.difficulty !== 'Easy')).toBe(true);
  });
  it('bookmarked and unsolved use saved data', () => {
    expect(buildQueue('bookmarked', ctx)).toEqual(['p003']);
    expect(buildQueue('unsolved', ctx)).toEqual([]);
    const tried = { ...ctx, attempts: [att('p001', 'incorrect', day(0))] };
    expect(buildQueue('unsolved', tried)).toEqual(['p001']);
  });
  it('weak mode is empty with no history, then targets weak topics', () => {
    expect(buildQueue('weak', ctx)).toEqual([]);
    const tried = { ...ctx, attempts: [att('p001', 'incorrect', day(0))] };
    expect(buildQueue('weak', tried)).toEqual(['p001']);
  });
  it('count caps the queue', () => {
    expect(buildQueue('random', ctx, { count: 3 })).toHaveLength(3);
  });
});
