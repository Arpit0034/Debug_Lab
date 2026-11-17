import { describe, it, expect } from 'vitest';
import type { Frame } from '../types';
import { graphBfsViz } from './graph-bfs';
import { graphDfsViz } from './graph-dfs';
import { graphDijkstraViz } from './graph-dijkstra';
import { unionFindViz } from './union-find';
import {
  preorderViz,
  inorderViz,
  postorderViz,
  levelorderViz,
} from './tree-traversal';

function resultOf(frames: Frame[]): unknown {
  return frames[frames.length - 1]?.vars?.result;
}

function asString(x: unknown): string {
  return x === undefined || x === null ? '' : String(x);
}

function assertFramesWellFormed(frames: Frame[]): void {
  expect(frames.length).toBeGreaterThan(0);
  frames.forEach((f, i) => {
    expect(f.step).toBe(i);
    expect(typeof f.description).toBe('string');
    expect(f.data).toBeDefined();
  });
  expect(frames[frames.length - 1].done).toBe(true);
}

describe('graph BFS', () => {
  it('default: distances match reference', () => {
    const frames = graphBfsViz.generator(graphBfsViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(graphBfsViz.reference(graphBfsViz.defaultInput)),
    );
  });
  it('reference: BFS from 0 gives [0,1,1,1,2,3]', () => {
    expect(graphBfsViz.reference({ source: 0 })).toBe('0,1,1,1,2,3');
  });
});

describe('graph DFS', () => {
  it('default: order matches reference', () => {
    const frames = graphDfsViz.generator(graphDfsViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(graphDfsViz.reference(graphDfsViz.defaultInput)),
    );
  });
  it('reference: DFS from 0 gives [0,1,4,2,3,5]', () => {
    expect(graphDfsViz.reference({ source: 0 })).toBe('0,1,4,2,3,5');
  });
});

describe('Dijkstra', () => {
  it('default: distances match reference', () => {
    const frames = graphDijkstraViz.generator(graphDijkstraViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(graphDijkstraViz.reference(graphDijkstraViz.defaultInput)),
    );
  });
  it('reference: shortest from 0 is [0,2,1,2]', () => {
    expect(graphDijkstraViz.reference({ source: 0 })).toBe('0,2,1,2');
  });
});

describe('union-find', () => {
  it('default: component count matches reference', () => {
    const frames = unionFindViz.generator(unionFindViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(unionFindViz.reference(unionFindViz.defaultInput)),
    );
  });
  it('reference: three ops from 5 nodes → 2 components', () => {
    expect(
      unionFindViz.reference({ n: 5, ops: [[0, 1], [2, 3], [1, 3]] }),
    ).toBe('2');
  });
  it('reference: no ops → n components', () => {
    expect(unionFindViz.reference({ n: 4, ops: [] })).toBe('4');
  });
});

describe('tree traversals', () => {
  it('pre-order matches reference', () => {
    const frames = preorderViz.generator(preorderViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(preorderViz.reference(preorderViz.defaultInput)),
    );
    expect(preorderViz.reference({ mode: 'pre' })).toBe('4,2,1,3,6,5,7');
  });

  it('in-order matches reference', () => {
    const frames = inorderViz.generator(inorderViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(inorderViz.reference(inorderViz.defaultInput)),
    );
    expect(inorderViz.reference({ mode: 'in' })).toBe('1,2,3,4,5,6,7');
  });

  it('post-order matches reference', () => {
    const frames = postorderViz.generator(postorderViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(postorderViz.reference(postorderViz.defaultInput)),
    );
    expect(postorderViz.reference({ mode: 'post' })).toBe('1,3,2,5,7,6,4');
  });

  it('level-order matches reference', () => {
    const frames = levelorderViz.generator(levelorderViz.defaultInput);
    assertFramesWellFormed(frames);
    expect(asString(resultOf(frames))).toBe(
      asString(levelorderViz.reference(levelorderViz.defaultInput)),
    );
    expect(levelorderViz.reference({ mode: 'level' })).toBe('4,2,6,1,3,5,7');
  });
});
