import type { Frame, TreeData, VizDefinition } from '../types';

export type TreeTraversalMode = 'pre' | 'in' | 'post' | 'level';

export interface TreeTraversalInput { mode: TreeTraversalMode }

const TREE: TreeData = {
  kind: 'tree',
  root: 0,
  nodes: [
    { id: 0, label: '4', left: 1, right: 2 },
    { id: 1, label: '2', left: 3, right: 4 },
    { id: 2, label: '6', left: 5, right: 6 },
    { id: 3, label: '1' },
    { id: 4, label: '3' },
    { id: 5, label: '5' },
    { id: 6, label: '7' },
  ],
};

function refTraverse(mode: TreeTraversalMode): string[] {
  const byId = new Map(TREE.nodes.map((n) => [n.id, n]));
  const out: string[] = [];
  if (mode === 'level') {
    const q = [TREE.root];
    while (q.length) {
      const id = q.shift() as number;
      const n = byId.get(id);
      if (!n) continue;
      out.push(n.label);
      if (n.left !== undefined) q.push(n.left);
      if (n.right !== undefined) q.push(n.right);
    }
    return out;
  }
  const walk = (id: number | undefined): void => {
    if (id === undefined) return;
    const n = byId.get(id);
    if (!n) return;
    if (mode === 'pre') out.push(n.label);
    walk(n.left);
    if (mode === 'in') out.push(n.label);
    walk(n.right);
    if (mode === 'post') out.push(n.label);
  };
  walk(TREE.root);
  return out;
}

function makeTraversal(mode: TreeTraversalMode, title: string): VizDefinition<TreeTraversalInput> {
  return {
    id: `tree-traversal-${mode}`,
    title,
    description: `Visit every node of the tree in ${mode}-order.`,
    defaultInput: { mode },
    describeInput: () => `mode = ${mode}`,
    reference: () => refTraverse(mode).join(','),
    generator: () => {
      const frames: Frame[] = [];
      const visited: number[] = [];
      let step = 0;
      const byId = new Map(TREE.nodes.map((n) => [n.id, n]));

      const push = (desc: string, active: number | null, done = false): void => {
        frames.push({
          step: step++,
          description: desc,
          data: TREE,
          highlights: [
            ...visited.map((id) => ({ index: id, color: 'ok' as const })),
            ...(active !== null ? [{ index: active, color: 'active' as const }] : []),
          ],
          vars: { order: visited.map((id) => byId.get(id)?.label ?? id).join(',') },
          done,
        });
      };

      push(`Start ${mode}-order traversal from root.`, null);

      if (mode === 'level') {
        const q = [TREE.root];
        while (q.length) {
          const id = q.shift() as number;
          const n = byId.get(id);
          if (!n) continue;
          visited.push(id);
          push(`Visit ${n.label} (level-order).`, id);
          if (n.left !== undefined) q.push(n.left);
          if (n.right !== undefined) q.push(n.right);
        }
      } else {
        const walk = (id: number | undefined): void => {
          if (id === undefined) return;
          const n = byId.get(id);
          if (!n) return;
          if (mode === 'pre') {
            visited.push(id);
            push(`Visit ${n.label} (pre-order).`, id);
          }
          walk(n.left);
          if (mode === 'in') {
            visited.push(id);
            push(`Visit ${n.label} (in-order).`, id);
          }
          walk(n.right);
          if (mode === 'post') {
            visited.push(id);
            push(`Visit ${n.label} (post-order).`, id);
          }
        };
        walk(TREE.root);
      }

      push(
        `Done. Order: [${visited.map((id) => byId.get(id)?.label ?? id).join(', ')}].`,
        null,
        true,
      );
      frames[frames.length - 1].vars = {
        ...frames[frames.length - 1].vars,
        result: refTraverse(mode).join(','),
      };
      return frames;
    },
  };
}

export const preorderViz = makeTraversal('pre', 'Pre-order Traversal');
export const inorderViz = makeTraversal('in', 'In-order Traversal');
export const postorderViz = makeTraversal('post', 'Post-order Traversal');
export const levelorderViz = makeTraversal('level', 'Level-order Traversal (BFS)');
