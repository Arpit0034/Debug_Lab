import type { Frame, VizDefinition } from '../types';

export interface BinarySearchInput { arr: number[]; target: number }

export const binarySearchViz: VizDefinition<BinarySearchInput> = {
  id: 'binary-search',
  title: 'Binary Search',
  description: 'Halve the sorted range on each step until the target is found or the range is empty.',
  defaultInput: { arr: [1, 3, 5, 7, 9, 11, 13, 15], target: 7 },
  describeInput: (i) => `arr = [${i.arr.join(', ')}], target = ${i.target}`,
  reference: (i) => {
    let lo = 0;
    let hi = i.arr.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (i.arr[mid] === i.target) return mid;
      if (i.arr[mid] < i.target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
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

    push(
      `Start: search the whole array [0…${hi}] for target ${target}.`,
      [
        { index: 0, color: 'active' },
        ...(hi >= 0 ? [{ index: hi, color: 'active' as const }] : []),
      ],
      { lo, hi, target },
    );

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const v = arr[mid];
      const region: Frame['highlights'] = [
        { index: lo, color: 'active' },
        { index: hi, color: 'active' },
        { index: mid, color: 'warn' },
      ];
      if (v === target) {
        push(
          `mid = ${mid}, arr[${mid}] = ${v} = target. Found at index ${mid}.`,
          [{ index: mid, color: 'ok' }],
          { lo, hi, mid, result: mid },
          true,
        );
        return frames;
      }
      if (v < target) {
        push(
          `mid = ${mid}, arr[${mid}] = ${v} < ${target}. Discard left half; lo = ${mid + 1}.`,
          region,
          { lo, hi, mid, compare: `${v} < ${target}` },
        );
        lo = mid + 1;
      } else {
        push(
          `mid = ${mid}, arr[${mid}] = ${v} > ${target}. Discard right half; hi = ${mid - 1}.`,
          region,
          { lo, hi, mid, compare: `${v} > ${target}` },
        );
        hi = mid - 1;
      }
    }

    push(
      `lo > hi — target ${target} is not present. Return -1.`,
      [],
      { lo, hi, target, result: -1 },
      true,
    );
    return frames;
  },
};
