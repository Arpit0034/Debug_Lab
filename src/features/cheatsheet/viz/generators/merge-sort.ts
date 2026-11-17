import type { Frame, VizDefinition } from '../types';

export interface MergeSortInput { arr: number[] }

export const mergeSortViz: VizDefinition<MergeSortInput> = {
  id: 'merge-sort',
  title: 'Merge Sort',
  description: 'Split the array recursively; merge sorted halves back up.',
  defaultInput: { arr: [38, 27, 43, 3, 9, 82, 10] },
  describeInput: (i) => `arr = [${i.arr.join(', ')}]`,
  reference: (i) => [...i.arr].sort((a, b) => a - b),
  generator: (input) => {
    const arr = [...input.arr];
    const frames: Frame[] = [];
    let step = 0;

    const push = (
      description: string,
      highlights: Frame['highlights'],
      vars: Frame['vars'],
      done = false,
    ): void => {
      frames.push({
        step: step++,
        description,
        data: { kind: 'array', values: [...arr] },
        highlights,
        vars,
        done,
      });
    };

    push(`Initial array: [${arr.join(', ')}].`, [], { n: arr.length });

    const sortRange = (lo: number, hi: number): void => {
      if (hi - lo < 1) return;
      const mid = Math.floor((lo + hi) / 2);
      push(
        `Split [${lo}…${hi}] into [${lo}…${mid}] and [${mid + 1}…${hi}].`,
        [
          { index: lo, color: 'active' },
          { index: mid, color: 'warn' },
          { index: hi, color: 'active' },
        ],
        { lo, mid, hi },
      );
      sortRange(lo, mid);
      sortRange(mid + 1, hi);

      const left = arr.slice(lo, mid + 1);
      const right = arr.slice(mid + 1, hi + 1);
      let i = 0;
      let j = 0;
      let k = lo;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          arr[k++] = left[i++];
        } else {
          arr[k++] = right[j++];
        }
      }
      while (i < left.length) arr[k++] = left[i++];
      while (j < right.length) arr[k++] = right[j++];

      push(
        `Merged [${lo}…${hi}]: [${arr.slice(lo, hi + 1).join(', ')}].`,
        Array.from(
          { length: hi - lo + 1 },
          (_, idx) => ({ index: lo + idx, color: 'ok' as const }),
        ),
        { lo, hi },
      );
    };

    sortRange(0, arr.length - 1);

    push(
      `Sorted: [${arr.join(', ')}].`,
      arr.map((_, i) => ({ index: i, color: 'ok' as const })),
      { result: arr.join(',') },
      true,
    );
    return frames;
  },
};
