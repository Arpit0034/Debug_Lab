import { describe, expect, it } from 'vitest';
import { changedVars, deriveAnnotations, describeChange, explainError, explainStep, formatSnap, shortSnap, skipText, summarizeRun } from './explain';
import type { Step, TreeStructure, VizData } from './types';

const simpleTree: TreeStructure = {
  root: 0,
  nodes: [
    { id: 0, val: 1, left: 1, right: 2 },
    { id: 1, val: 2, left: null, right: null },
    { id: 2, val: 3, left: null, right: null },
  ],
};

function call(id: number, parent: number | null, fn: string, locals: Record<string, unknown>): Step {
  return { i: 0, ev: 'call', call: id, parent, depth: 0, fn, line: 1, locals: locals as Step['locals'] };
}

describe('formatSnap', () => {
  it('handles primitives', () => {
    expect(formatSnap(null)).toBe('None');
    expect(formatSnap(true)).toBe('True');
    expect(formatSnap(42)).toBe('42');
  });
  it('handles nodes by unwrapping val', () => {
    expect(formatSnap({ t: 'node', id: 0, val: 5 })).toBe('5');
  });
  it('truncates long lists', () => {
    const v = { t: 'list' as const, v: [1, 2, 3, 4, 5, 6, 7, 8] };
    expect(shortSnap(v).length).toBeLessThanOrEqual(24);
  });
});

describe('changedVars', () => {
  it('reports new and modified variables', () => {
    const changed = changedVars({ x: 1 }, { x: 2, y: true });
    expect(changed.map((c) => c.name).sort()).toEqual(['x', 'y']);
  });
});

describe('explainStep', () => {
  it('call headline starts with Calling', () => {
    const s = call(0, null, 'sum_tree', { node: { t: 'node', id: 0, val: 1 } });
    const e = explainStep(s, null, 'def sum_tree(node):\n  return node');
    expect(e.headline.startsWith('Calling sum_tree')).toBe(true);
  });
  it('return headline includes the returned value', () => {
    const s: Step = { i: 0, ev: 'return', call: 0, parent: null, depth: 0, fn: 'f', line: 1, locals: {}, ret: 7 };
    expect(explainStep(s, null, 'x').headline).toContain('returns 7');
  });
  it('line step surfaces the line text', () => {
    const s: Step = { i: 0, ev: 'line', call: 0, parent: null, depth: 0, fn: 'f', line: 2, locals: {} };
    const e = explainStep(s, null, 'a\nreturn node.val\nb');
    expect(e.lineText).toBe('return node.val');
    expect(e.lineNo).toBe(2);
  });
  it('summarizeRun handles each outcome', () => {
    expect(summarizeRun('ok', 6)).toBe('returned 6');
    expect(summarizeRun('crash', null, 'IndexError')).toContain('crashed');
    expect(summarizeRun('limit', null)).toContain('did not finish');
  });
});

describe('deriveAnnotations', () => {
  it('annotates tree return values on the node that returned', () => {
    const structure: VizData['structure'] = { tree: simpleTree };
    const steps: Step[] = [
      call(0, null, 'sum_tree', { node: { t: 'node', id: 0, val: 1 } }),
      call(1, 0, 'sum_tree', { node: { t: 'node', id: 1, val: 2 } }),
      { i: 0, ev: 'return', call: 1, parent: 0, depth: 1, fn: 'sum_tree', line: 1, locals: { node: { t: 'node', id: 1, val: 2 } }, ret: 2 },
      call(2, 0, 'sum_tree', { node: { t: 'node', id: 2, val: 3 } }),
      { i: 0, ev: 'return', call: 2, parent: 0, depth: 1, fn: 'sum_tree', line: 1, locals: { node: { t: 'node', id: 2, val: 3 } }, ret: 3 },
    ];
    const ann = deriveAnnotations('tree', steps[4], steps, 4, structure);
    expect(ann.tree.get(1)?.returnedValue).toBe('2');
    expect(ann.tree.get(2)?.returnedValue).toBe('3');
    expect(ann.tree.get(0)?.current).toBe(false);
  });
});

const base = { i: 0, call: 0, parent: null, depth: 0, fn: 'dfs', locals: {} } as const;

describe('paper-style narration', () => {
  it('explains a failed check in plain words', () => {
    const s: Step = { ...base, ev: 'line', line: 10, x: { k: 'if', s: 'state[1] == 1', v: '0 == 1', o: 'F' } };
    const e = explainStep(s, null, 'x');
    expect(e.headline).toBe('Check: state[1] == 1');
    expect(e.detail).toContain('skip this block');
    expect(e.verdict?.label).toBe('False');
  });
  it('explains a loop step with the loop variable', () => {
    const s: Step = { ...base, ev: 'line', line: 9, x: { k: 'for', s: 'g[0]', t: 'v', o: 'N', iv: { v: 2 } } };
    expect(explainStep(s, null, 'x').headline).toBe('Loop over g[0]:  v = 2');
  });
  it('says when a function falls off the end', () => {
    const s: Step = { ...base, ev: 'return', line: 5, ret: null, x: { k: 'end' } };
    expect(explainStep(s, null, 'x').detail).toContain('without a return');
  });
  it('mentions skipped setup steps', () => {
    const s: Step = { ...base, ev: 'line', line: 5, sk: { n: 5, a: 3, b: 4 } };
    expect(skipText(s)).toBe('5 repeated setup steps skipped (lines 3\u20134)');
  });
});

describe('describeChange', () => {
  it('names the list index that changed', () => {
    const a = { t: 'list' as const, v: [0, 0, 0] };
    const b = { t: 'list' as const, v: [0, 1, 0] };
    expect(describeChange(a, b)).toBe('[1]: 0 \u2192 1');
  });
  it('is null when nothing changed', () => {
    expect(describeChange(3, 3)).toBeNull();
  });
});

describe('explainError', () => {
  it('gives a plain-language reason and keeps the facts', () => {
    const s: Step = { ...base, ev: 'exception', line: 4, et: 'IndexError', em: 'list index out of range', facts: ['index 3 is out of range'] };
    const e = explainError(s);
    expect(e.plain).toContain('position');
    expect(e.facts).toHaveLength(1);
    expect(e.internal).toBe(false);
  });
  it('flags GeneratorExit as internal noise', () => {
    const s: Step = { ...base, ev: 'exception', line: 4, err: 'GeneratorExit' };
    expect(explainError(s).internal).toBe(true);
  });
});
