import { describe, it, expect } from 'vitest';
import type { Frame, VizDefinition } from '../types';
import { binarySearchViz } from './binary-search';
import { twoPointersViz } from './two-pointers';
import { slidingWindowViz } from './sliding-window';
import { monotonicStackViz } from './monotonic-stack';
import { mergeSortViz } from './merge-sort';
import { climbingStairsViz } from './dp-climbing-stairs';

function resultOf(frames: Frame[]): unknown {
  return frames[frames.length - 1]?.vars?.result;
}

function asString(x: unknown): string {
  if (Array.isArray(x)) return x.join(',');
  if (x === null || x === undefined) return 'null';
  return String(x);
}

function assertFramesWellFormed(frames: Frame[]): void {
  expect(frames.length).toBeGreaterThan(0);
  frames.forEach((f, i) => {
    expect(f.step).toBe(i);
    expect(typeof f.description).toBe('string');
    expect(f.description.length).toBeGreaterThan(0);
    expect(f.data).toBeDefined();
  });
  expect(frames[frames.length - 1].done).toBe(true);
}

function assertMatchesReference<I>(v: VizDefinition<I>, input: I): void {
  assertFramesWellFormed(v.generator(input));
  expect(asString(resultOf(v.generator(input)))).toBe(
    asString(v.reference(input)),
  );
}

describe('binary search', () => {
  it('reference: found, not found, boundaries', () => {
    expect(binarySearchViz.reference({ arr: [1, 3, 5, 7, 9], target: 7 })).toBe(3);
    expect(binarySearchViz.reference({ arr: [1, 3, 5, 7, 9], target: 1 })).toBe(0);
    expect(binarySearchViz.reference({ arr: [1, 3, 5, 7, 9], target: 9 })).toBe(4);
    expect(binarySearchViz.reference({ arr: [1, 3, 5, 7, 9], target: 2 })).toBe(-1);
    expect(binarySearchViz.reference({ arr: [], target: 3 })).toBe(-1);
    expect(binarySearchViz.reference({ arr: [5], target: 5 })).toBe(0);
  });
  it('default input matches reference', () => {
    assertMatchesReference(binarySearchViz, binarySearchViz.defaultInput);
  });
  it('empty array matches reference', () => {
    assertMatchesReference(binarySearchViz, { arr: [], target: 3 });
  });
});

describe('two pointers', () => {
  it('reference: found, not found, negatives', () => {
    expect(twoPointersViz.reference({ arr: [1, 2, 4, 7, 11, 15], target: 9 })).toEqual([1, 3]);
    expect(twoPointersViz.reference({ arr: [1, 2, 3], target: 100 })).toBeNull();
    expect(twoPointersViz.reference({ arr: [-3, -1, 0, 2, 5], target: -1 })).toEqual([0, 3]);
  });
  it('default input matches reference', () => {
    assertMatchesReference(twoPointersViz, twoPointersViz.defaultInput);
  });
  it('no-pair case matches reference', () => {
    assertMatchesReference(twoPointersViz, { arr: [1, 2, 3], target: 100 });
  });
});

describe('sliding window', () => {
  it('reference: typical, whole array, empty', () => {
    expect(slidingWindowViz.reference({ arr: [1, 2, 1, 3, 1, 1, 1, 2], target: 5 })).toBe(4);
    expect(slidingWindowViz.reference({ arr: [1, 1, 1, 1], target: 10 })).toBe(4);
    expect(slidingWindowViz.reference({ arr: [], target: 5 })).toBe(0);
  });
  it('default input matches reference', () => {
    assertMatchesReference(slidingWindowViz, slidingWindowViz.defaultInput);
  });
  it('empty array matches reference', () => {
    assertMatchesReference(slidingWindowViz, { arr: [], target: 5 });
  });
});

describe('monotonic stack', () => {
  it('reference: classic, decreasing, single', () => {
    expect(monotonicStackViz.reference({ arr: [2, 1, 5, 6, 2, 3] })).toEqual([5, 5, 6, -1, 3, -1]);
    expect(monotonicStackViz.reference({ arr: [5, 4, 3, 2, 1] })).toEqual([-1, -1, -1, -1, -1]);
    expect(monotonicStackViz.reference({ arr: [42] })).toEqual([-1]);
  });
  it('default input matches reference', () => {
    assertMatchesReference(monotonicStackViz, monotonicStackViz.defaultInput);
  });
  it('empty array matches reference', () => {
    assertMatchesReference(monotonicStackViz, { arr: [] });
  });
});

describe('merge sort', () => {
  it('reference: typical, empty, sorted', () => {
    expect(mergeSortViz.reference({ arr: [38, 27, 43, 3, 9, 82, 10] })).toEqual([
      3, 9, 10, 27, 38, 43, 82,
    ]);
    expect(mergeSortViz.reference({ arr: [] })).toEqual([]);
    expect(mergeSortViz.reference({ arr: [1, 2, 3, 4] })).toEqual([1, 2, 3, 4]);
  });
  it('default input matches reference', () => {
    assertMatchesReference(mergeSortViz, mergeSortViz.defaultInput);
  });
  it('empty array matches reference', () => {
    assertMatchesReference(mergeSortViz, { arr: [] });
  });
});

describe('climbing stairs', () => {
  it('reference: n = 0..10', () => {
    expect(climbingStairsViz.reference({ n: 0 })).toBe(1);
    expect(climbingStairsViz.reference({ n: 1 })).toBe(1);
    expect(climbingStairsViz.reference({ n: 2 })).toBe(2);
    expect(climbingStairsViz.reference({ n: 3 })).toBe(3);
    expect(climbingStairsViz.reference({ n: 5 })).toBe(8);
    expect(climbingStairsViz.reference({ n: 10 })).toBe(89);
  });
  it('default input matches reference', () => {
    assertMatchesReference(climbingStairsViz, climbingStairsViz.defaultInput);
  });
  it('n = 0 matches reference', () => {
    assertMatchesReference(climbingStairsViz, { n: 0 });
  });
});
