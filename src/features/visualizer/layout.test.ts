import { describe, expect, it } from 'vitest';
import { callLayout, ellipseLayout, fitToBox, treeLayout, trimToRect, wrapText } from './layout';
import type { TreeStructure } from './types';

function mk(root: number | null, ids: number[], edges: [number, number][]): TreeStructure {
  const nodes: TreeStructure['nodes'] = ids.map((id) => ({ id, val: id, left: null, right: null }));
  for (const [a, b] of edges) {
    const node = nodes.find((n) => n.id === a);
    if (!node) continue;
    if (node.left === null) node.left = b;
    else if (node.right === null) node.right = b;
  }
  return { root, nodes };
}

describe('treeLayout', () => {
  it('centers a single node', () => {
    const p = treeLayout(mk(0, [0], []), 30, 60, 50);
    expect(p).toHaveLength(1);
  });
  it('lays out a left chain without x overlap', () => {
    const p = treeLayout(mk(0, [0, 1, 2], [[0, 1], [1, 2]]), 30, 60, 50);
    expect(new Set(p.map((q) => q.x)).size).toBe(3);
  });
  it('lays out a balanced tree with distinct xs', () => {
    const p = treeLayout(mk(0, [0, 1, 2], [[0, 1], [0, 2]]), 30, 60, 50);
    expect(new Set(p.map((q) => q.x)).size).toBe(3);
  });
  it('returns empty for an empty tree', () => {
    expect(treeLayout({ root: null, nodes: [] }, 30, 60, 50)).toEqual([]);
  });
});

describe('ellipseLayout', () => {
  it('places points on the ellipse', () => {
    const p = ellipseLayout(5, 100, 60, 200, 120);
    expect(p).toHaveLength(5);
    for (const q of p) {
      const nx = (q.x - 200) / 100;
      const ny = (q.y - 120) / 60;
      expect(Math.abs(nx * nx + ny * ny - 1)).toBeLessThan(0.01);
    }
  });
});

describe('callLayout / wrapText / fitToBox / trimToRect', () => {
  it('places parent above child', () => {
    const p = callLayout([{ id: 0, parent: null }, { id: 1, parent: 0 }], 30, 100, 70);
    const a = p.find((q) => q.id === 0)!, b = p.find((q) => q.id === 1)!;
    expect(b.y).toBeGreaterThan(a.y);
  });
  it('handles a chain of calls', () => {
    const p = callLayout([{ id: 0, parent: null }, { id: 1, parent: 0 }, { id: 2, parent: 1 }], 30, 100, 70);
    expect(p).toHaveLength(3);
  });
  it('wrapText truncates with ellipsis', () => {
    const lines = wrapText('one two three four five six seven', 8, 2);
    expect(lines.length).toBeLessThanOrEqual(2);
    expect(lines[lines.length - 1].endsWith('...')).toBe(true);
  });
  it('fitToBox stays inside the box', () => {
    const pts = [{ id: 0, x: 0, y: 0 }, { id: 1, x: 100, y: 50 }, { id: 2, x: 50, y: 100 }];
    for (const q of fitToBox(pts, 300, 200, 30, 20)) {
      expect(q.x).toBeGreaterThanOrEqual(0);
      expect(q.x).toBeLessThanOrEqual(300);
      expect(q.y).toBeGreaterThanOrEqual(0);
      expect(q.y).toBeLessThanOrEqual(200);
    }
  });
  it('trimToRect ends on the border', () => {
    const t = trimToRect(0, 0, 20, 20, 100, 0, 20, 20);
    expect(t.x1).toBeCloseTo(10, 5);
    expect(t.x2).toBeCloseTo(90, 5);
  });
});
