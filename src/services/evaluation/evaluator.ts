import type { Complexity, Language, Problem } from '../../types/problem';
import type { BugResult, FixAttempt } from '../../types/progress';
import { normalizeComplexity, normalizeLine } from '../../utils/normalize';

export interface BugEvaluation {
  result: BugResult;
  /** Selected lines that are really buggy. */
  hits: number[];
  /** Selected lines that are not buggy. */
  wrong: number[];
  /** Buggy lines the person did not select. */
  missed: number[];
}

export interface ComplexityEvaluation {
  timeCorrect: boolean;
  spaceCorrect: boolean;
  correct: Complexity;
}

/**
 * The evaluation contract. The default implementation compares text only and
 * never runs code. A runner-based evaluator (Pyodide or a backend) can replace
 * it later without touching the UI.
 */
export interface Evaluator {
  evaluateBug(problem: Problem, language: Language, selected: number[]): BugEvaluation;
  evaluateFixes(
    problem: Problem,
    language: Language,
    selected: number[],
    inputs: Record<string, string>,
  ): FixAttempt[];
  evaluateComplexity(problem: Problem, language: Language, time: string, space: string): ComplexityEvaluation;
}

export function getComplexity(problem: Problem, language: Language): Complexity {
  return problem.complexityOverrides?.[language] ?? problem.complexity;
}

export const structuralEvaluator: Evaluator = {
  evaluateBug(problem, language, selected) {
    const actual = problem.buggyLines[language] ?? [];
    const chosen = Array.from(new Set(selected)).sort((a, b) => a - b);
    const hits = chosen.filter((n) => actual.includes(n));
    const wrong = chosen.filter((n) => !actual.includes(n));
    const missed = actual.filter((n) => !chosen.includes(n));
    let result: BugResult = 'incorrect';
    if (hits.length > 0) {
      result = wrong.length === 0 && missed.length === 0 ? 'correct' : 'partial';
    }
    return { result, hits, wrong, missed };
  },

  evaluateFixes(problem, language, selected, inputs) {
    const actual = problem.buggyLines[language] ?? [];
    const accepted = problem.acceptedFixes[language] ?? {};
    const out: FixAttempt[] = [];
    for (const line of selected) {
      const submitted = (inputs[String(line)] ?? '').trim();
      // Only lines that are really buggy can be graded, and empty inputs are skipped.
      if (!submitted || !actual.includes(line)) continue;
      const ok = (accepted[String(line)] ?? []).some((f) => normalizeLine(f) === normalizeLine(submitted));
      out.push({ line, submitted, status: ok ? 'verified' : 'unverified' });
    }
    return out;
  },

  evaluateComplexity(problem, language, time, space) {
    const correct = getComplexity(problem, language);
    return {
      timeCorrect: normalizeComplexity(time) === normalizeComplexity(correct.time),
      spaceCorrect: normalizeComplexity(space) === normalizeComplexity(correct.space),
      correct,
    };
  },
};

export const WEIGHTS = { bug: 50, fix: 30, complexity: 20 } as const;

export interface Score {
  /** 0 to 100, computed only over the parts the person actually submitted. */
  percent: number;
  parts: { bug: number; fix: number | null; complexity: number | null };
}

/** Bug counts always. Fix and complexity count only when submitted; skipped parts are not penalised. */
export function scoreAttempt(
  bugResult: BugResult,
  fixes: FixAttempt[],
  complexity?: { timeCorrect: boolean; spaceCorrect: boolean },
): Score {
  const bug = bugResult === 'correct' ? 1 : bugResult === 'partial' ? 0.5 : 0;
  const fix = fixes.length
    ? fixes.filter((f) => f.status === 'verified' || f.status === 'self-verified').length / fixes.length
    : null;
  const cx = complexity ? ((complexity.timeCorrect ? 1 : 0) + (complexity.spaceCorrect ? 1 : 0)) / 2 : null;

  let earned = WEIGHTS.bug * bug;
  let available: number = WEIGHTS.bug;
  if (fix !== null) {
    earned += WEIGHTS.fix * fix;
    available += WEIGHTS.fix;
  }
  if (cx !== null) {
    earned += WEIGHTS.complexity * cx;
    available += WEIGHTS.complexity;
  }
  return { percent: Math.round((earned / available) * 100), parts: { bug, fix, complexity: cx } };
}
