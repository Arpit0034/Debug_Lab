import type { Frame, VizDefinition } from '../types';

export interface ClimbingStairsInput { n: number }

export const climbingStairsViz: VizDefinition<ClimbingStairsInput> = {
  id: 'dp-climbing-stairs',
  title: 'DP — Climbing Stairs',
  description:
    'Count ways to reach the top taking 1 or 2 steps at a time. dp[i] = dp[i-1] + dp[i-2].',
  defaultInput: { n: 6 },
  describeInput: (i) => `n = ${i.n}`,
  reference: (i) => {
    if (i.n <= 1) return 1;
    let a = 1;
    let b = 1;
    for (let k = 2; k <= i.n; k++) {
      const c = a + b;
      a = b;
      b = c;
    }
    return b;
  },
  generator: (input) => {
    const n = input.n;
    const dp: number[] = new Array(n + 1).fill(0);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;
    const frames: Frame[] = [];
    let step = 0;

    const snap = (computedUpTo: number): (number | string)[] =>
      dp.map((v, idx) => (idx <= computedUpTo ? v : '?'));

    const push = (
      description: string,
      highlights: Frame['highlights'],
      vars: Frame['vars'],
      computedUpTo: number,
      done = false,
    ): void => {
      frames.push({
        step: step++,
        description,
        data: {
          kind: 'table',
          rows: [snap(computedUpTo)],
          rowLabels: ['dp'],
          colLabels: dp.map((_, idx) => String(idx)),
        },
        highlights,
        vars,
        done,
      });
    };

    push(
      'Base cases: dp[0] = 1 (one way to climb 0 stairs), dp[1] = 1.',
      n >= 1
        ? [
            { index: 0, color: 'ok' },
            { index: 1, color: 'ok' },
          ]
        : [{ index: 0, color: 'ok' }],
      { n, dp0: 1, dp1: n >= 1 ? 1 : '—' },
      Math.min(1, n),
    );

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      push(
        `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`,
        [
          { index: i, color: 'active' },
          { index: i - 1, color: 'warn' },
          { index: i - 2, color: 'warn' },
        ],
        { i, prev1: dp[i - 1], prev2: dp[i - 2], curr: dp[i] },
        i,
      );
    }

    push(
      `Done. dp[${n}] = ${dp[n]} ways to climb ${n} stairs.`,
      [{ index: n, color: 'ok' }],
      { result: dp[n] },
      n,
      true,
    );
    return frames;
  },
};
