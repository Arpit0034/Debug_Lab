import type { Frame, VizDefinition } from '../types';

export interface MonotonicStackInput { arr: number[] }

export const monotonicStackViz: VizDefinition<MonotonicStackInput> = {
  id: 'monotonic-stack',
  title: 'Monotonic Stack — Next Greater Element',
  description:
    'Maintain a decreasing stack; each new element pops smaller elements and becomes their next-greater.',
  defaultInput: { arr: [2, 1, 5, 6, 2, 3] },
  describeInput: (i) => `arr = [${i.arr.join(', ')}]`,
  reference: (i) => {
    const res: number[] = new Array(i.arr.length).fill(-1);
    const stack: number[] = [];
    for (let k = 0; k < i.arr.length; k++) {
      while (stack.length > 0 && i.arr[stack[stack.length - 1]] < i.arr[k]) {
        res[stack.pop() as number] = i.arr[k];
      }
      stack.push(k);
    }
    return res;
  },
  generator: (input) => {
    const { arr } = input;
    const frames: Frame[] = [];
    const stack: number[] = [];
    const res: number[] = new Array(arr.length).fill(-1);
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
        data: {
          kind: 'array',
          values: arr,
          labels: res.map((r) => (r === -1 ? '?' : String(r))),
        },
        highlights,
        vars,
        done,
      });
    };

    push(
      'Initialize: empty monotonic (decreasing) stack, result array all -1.',
      [],
      { i: '—', stack: '[]' },
    );

    for (let i = 0; i < arr.length; i++) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
        const popped = stack[stack.length - 1];
        push(
          `arr[${i}] = ${arr[i]} > arr[stack.top] = ${arr[popped]}. Pop index ${popped}, set next-greater = ${arr[i]}.`,
          [
            { index: popped, color: 'warn' },
            { index: i, color: 'active' },
          ],
          { i, stack: `[${stack.join(', ')}]` },
        );
        res[popped] = arr[i];
        stack.pop();
      }
      stack.push(i);
      push(
        `Push index ${i} (${arr[i]}) onto stack.`,
        [{ index: i, color: 'active' }],
        { i, stack: `[${stack.join(', ')}]` },
      );
    }

    push(
      `Done. Next-greater array = [${res.join(', ')}].`,
      [],
      { stack: '[]', result: res.join(',') },
      true,
    );
    return frames;
  },
};
