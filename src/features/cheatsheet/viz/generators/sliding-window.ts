import type { Frame, VizDefinition } from '../types';

export interface SlidingWindowInput { arr: number[]; target: number }

export const slidingWindowViz: VizDefinition<SlidingWindowInput> = {
  id: 'sliding-window',
  title: 'Sliding Window — Longest Sum ≤ Target',
  description:
    'Grow the window to the right; shrink from the left whenever the sum exceeds the target.',
  defaultInput: { arr: [1, 2, 1, 3, 1, 1, 1, 2], target: 5 },
  describeInput: (i) => `arr = [${i.arr.join(', ')}], target = ${i.target}`,
  reference: (i) => {
    let lo = 0;
    let sum = 0;
    let best = 0;
    for (let hi = 0; hi < i.arr.length; hi++) {
      sum += i.arr[hi];
      while (sum > i.target) {
        sum -= i.arr[lo];
        lo++;
      }
      best = Math.max(best, hi - lo + 1);
    }
    return best;
  },
  generator: (input) => {
    const { arr, target } = input;
    const frames: Frame[] = [];
    let step = 0;
    let lo = 0;
    let sum = 0;
    let best = 0;

    const push = (
      description: string,
      highlights: Frame['highlights'],
      vars: Frame['vars'],
      done = false,
    ): void => {
      frames.push({
        step: step++,
        description,
        data: { kind: 'array', values: arr },
        highlights,
        vars,
        done,
      });
    };

    push(
      `Start with lo = 0, empty window. Target sum ≤ ${target}.`,
      [],
      { lo, sum: 0, best: 0, target },
    );

    for (let hi = 0; hi < arr.length; hi++) {
      sum += arr[hi];
      push(
        `Expand right to index ${hi} (arr[${hi}] = ${arr[hi]}). Window sum = ${sum}.`,
        [{ index: hi, color: 'active' }],
        { lo, hi, sum, best, target },
      );
      while (sum > target) {
        push(
          `Sum ${sum} > ${target}. Shrink: subtract arr[${lo}] = ${arr[lo]}, then lo++.`,
          [
            { index: lo, color: 'warn' },
            { index: hi, color: 'active' },
          ],
          { lo, hi, sum, best, target },
        );
        sum -= arr[lo];
        lo++;
      }
      const len = hi - lo + 1;
      if (len > best) {
        best = len;
        push(
          `Window [${lo}…${hi}] sum = ${sum} ≤ ${target}, length ${len} is new best.`,
          [
            { index: lo, color: 'ok' },
            { index: hi, color: 'ok' },
          ],
          { lo, hi, sum, best, target },
        );
      }
    }

    push(
      `Done. Longest subarray with sum ≤ ${target} has length ${best}.`,
      [],
      { lo, sum, best, target, result: best },
      true,
    );
    return frames;
  },
};
