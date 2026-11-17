import type { Frame, VizDefinition } from '../types';

export interface TwoPointersInput { arr: number[]; target: number }

export const twoPointersViz: VizDefinition<TwoPointersInput> = {
  id: 'two-pointers',
  title: 'Two Pointers — Pair Sum',
  description:
    'Sorted array + target sum: move two pointers inward based on the current pair sum.',
  defaultInput: { arr: [1, 2, 4, 7, 11, 15], target: 9 },
  describeInput: (i) => `arr = [${i.arr.join(', ')}], target = ${i.target}`,
  reference: (i) => {
    let lo = 0;
    let hi = i.arr.length - 1;
    while (lo < hi) {
      const s = i.arr[lo] + i.arr[hi];
      if (s === i.target) return [lo, hi];
      if (s < i.target) lo++;
      else hi--;
    }
    return null;
  },
  generator: (input) => {
    const { arr, target } = input;
    const frames: Frame[] = [];
    let step = 0;
    let lo = 0;
    let hi = arr.length - 1;

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

    if (arr.length < 2) {
      push(
        'Array has fewer than 2 elements — no pair possible.',
        [],
        { lo: 0, hi: arr.length - 1, result: 'null' },
        true,
      );
      return frames;
    }

    push(
      `Start: lo = 0 (${arr[0]}) and hi = ${hi} (${arr[hi]}). Sum = ${arr[0] + arr[hi]}.`,
      [
        { index: 0, color: 'active' },
        { index: hi, color: 'active' },
      ],
      { lo, hi, target, sum: arr[0] + arr[hi] },
    );

    while (lo < hi) {
      const sum = arr[lo] + arr[hi];
      if (sum === target) {
        push(
          `arr[${lo}] + arr[${hi}] = ${arr[lo]} + ${arr[hi]} = ${sum} = target. Pair found!`,
          [
            { index: lo, color: 'ok' },
            { index: hi, color: 'ok' },
          ],
          { lo, hi, sum, result: lo + ',' + hi },
          true,
        );
        return frames;
      }
      if (sum < target) {
        push(
          `arr[${lo}] + arr[${hi}] = ${sum} < ${target}. Move lo right to increase sum.`,
          [
            { index: lo, color: 'warn' },
            { index: hi, color: 'active' },
          ],
          { lo, hi, sum, compare: `${sum} < ${target}` },
        );
        lo++;
      } else {
        push(
          `arr[${lo}] + arr[${hi}] = ${sum} > ${target}. Move hi left to decrease sum.`,
          [
            { index: lo, color: 'active' },
            { index: hi, color: 'warn' },
          ],
          { lo, hi, sum, compare: `${sum} > ${target}` },
        );
        hi--;
      }
    }

    push(
      `lo ≥ hi — no pair sums to ${target}. Return null.`,
      [],
      { lo, hi, result: 'null' },
      true,
    );
    return frames;
  },
};
