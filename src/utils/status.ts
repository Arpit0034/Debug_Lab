import type { Attempt } from '../types/progress';

export type ProblemStatus = 'unattempted' | 'attempted' | 'solved';

export function statusOf(problemId: string, attempts: Attempt[]): ProblemStatus {
  const mine = attempts.filter((a) => a.problemId === problemId);
  if (mine.length === 0) return 'unattempted';
  return mine.some((a) => a.bugResult === 'correct') ? 'solved' : 'attempted';
}

/** Topic and title stay hidden until the person has submitted at least once. */
export function isRevealed(problemId: string, attempts: Attempt[]): boolean {
  return attempts.some((a) => a.problemId === problemId);
}

export const STATUS_LABEL: Record<ProblemStatus, string> = {
  unattempted: 'Not attempted',
  attempted: 'Attempted',
  solved: 'Solved',
};
