import { describe, expect, it } from 'vitest';
import { problems } from '../../data/problemRegistry';
import { getProblem } from '../../data/problemRegistry';
import { scoreAttempt, structuralEvaluator as ev } from './evaluator';

const p001 = getProblem('p001')!;
const p008 = getProblem('p008')!; // C only, two buggy lines (11, 12)

describe('bug evaluation', () => {
  it('exact match is correct', () => {
    expect(ev.evaluateBug(p001, 'java', [9]).result).toBe('correct');
  });
  it('wrong line is incorrect', () => {
    const r = ev.evaluateBug(p001, 'java', [5]);
    expect(r.result).toBe('incorrect');
    expect(r.missed).toEqual([9]);
  });
  it('one of two buggy lines is partial', () => {
    expect(ev.evaluateBug(p008, 'c', [11]).result).toBe('partial');
  });
  it('right line plus an extra line is partial', () => {
    const r = ev.evaluateBug(p001, 'java', [9, 3]);
    expect(r.result).toBe('partial');
    expect(r.wrong).toEqual([3]);
  });
  it('nothing selected is incorrect', () => {
    expect(ev.evaluateBug(p001, 'java', []).result).toBe('incorrect');
  });
});

describe('fix evaluation', () => {
  it('ignores spacing, semicolons and case of the line', () => {
    const r = ev.evaluateFixes(p001, 'java', [9], { '9': 'lo=mid+1' });
    expect(r[0].status).toBe('verified');
  });
  it('accepts a listed alternative', () => {
    expect(ev.evaluateFixes(p001, 'java', [9], { '9': 'lo = 1 + mid;' })[0].status).toBe('verified');
  });
  it('marks a different fix as unverified, not wrong', () => {
    expect(ev.evaluateFixes(p001, 'java', [9], { '9': 'lo = mid + 2;' })[0].status).toBe('unverified');
  });
  it('skips empty inputs and non-buggy lines', () => {
    expect(ev.evaluateFixes(p001, 'java', [9, 3], { '9': '', '3': 'x = 1;' })).toEqual([]);
  });
});

describe('complexity evaluation', () => {
  it('treats equivalent forms as equal', () => {
    const p = { ...p001, complexity: { time: 'O(n^2)', space: 'O(1)' }, complexityOverrides: undefined };
    const r = ev.evaluateComplexity(p, 'java', 'O(n²)', ' o( 1 ) ');
    expect(r.timeCorrect && r.spaceCorrect).toBe(true);
  });
  it('flags mismatches independently', () => {
    const r = ev.evaluateComplexity(p001, 'java', 'O(n)', 'O(1)');
    expect(r.timeCorrect).toBe(false);
    expect(r.spaceCorrect).toBe(true);
  });
  it('uses per-language overrides', () => {
    const p005 = getProblem('p005')!;
    expect(ev.evaluateComplexity(p005, 'c', 'O(V^2)', 'O(V)').timeCorrect).toBe(true);
  });
});

describe('scoring', () => {
  it('bug only is scored over bug alone', () => {
    expect(scoreAttempt('correct', []).percent).toBe(100);
    expect(scoreAttempt('partial', []).percent).toBe(50);
  });
  it('skipped parts are not penalised', () => {
    expect(scoreAttempt('correct', [], undefined).percent).toBe(100);
  });
  it('weights 50/30/20 when everything is submitted', () => {
    const s = scoreAttempt('correct', [{ line: 1, submitted: 'x', status: 'unverified' }], {
      timeCorrect: true,
      spaceCorrect: false,
    });
    expect(s.percent).toBe(60); // 50 + 0 + 10
  });
  it('self-verified fixes count', () => {
    expect(scoreAttempt('correct', [{ line: 1, submitted: 'x', status: 'self-verified' }]).percent).toBe(100);
  });
});

describe('bank sanity', () => {
  it('every promised language has an evaluable bug line', () => {
    for (const p of problems) {
      for (const l of p.languages) {
        expect(ev.evaluateBug(p, l, p.buggyLines[l]!).result).toBe('correct');
      }
    }
  });
});
