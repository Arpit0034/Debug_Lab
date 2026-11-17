// Pure layout helpers: tree, ellipse, generic call tree, fitToBox, trimToRect, wrapText.
import type { TreeStructure } from './types';

export interface Pos { id: number; x: number; y: number }

export interface CallNode { id: number; parent: number | null }

export function treeLayout(t: TreeStructure, nodeH: number, gapX: number, gapY: number): Pos[] {
  if (t.root === null || t.nodes.length === 0) return [];
  const byId = new Map(t.nodes.map((n) => [n.id, n]));
  const order: number[] = [];
  const depths = new Map<number, number>();
  const stack: { id: number; visited: boolean; d: number }[] = [{ id: t.root, visited: false, d: 0 }];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (cur.visited) { order.push(cur.id); depths.set(cur.id, cur.d); continue; }
    const node = byId.get(cur.id);
    if (!node) continue;
    if (node.right !== null && byId.has(node.right)) stack.push({ id: node.right, visited: false, d: cur.d + 1 });
    stack.push({ id: cur.id, visited: true, d: cur.d });
    if (node.left !== null && byId.has(node.left)) stack.push({ id: node.left, visited: false, d: cur.d + 1 });
  }
  const xs = new Map<number, number>();
  order.forEach((id, i) => xs.set(id, i));
  return order.map((id) => ({
    id,
    x: (xs.get(id) ?? 0) * gapX + 60,
    y: (depths.get(id) ?? 0) * gapY + nodeH + 10,
  }));
}

export function ellipseLayout(n: number, rx: number, ry: number, cx: number, cy: number): Pos[] {
  const out: Pos[] = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    out.push({ id: i, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  }
  return out;
}

export function callLayout(calls: CallNode[], nodeH: number, gapX: number, gapY: number): Pos[] {
  if (calls.length === 0) return [];
  const byParent = new Map<number | null, number[]>();
  let root: number | null = null;
  for (const c of calls) {
    if (c.parent === null && root === null) root = c.id;
    const arr = byParent.get(c.parent) ?? [];
    arr.push(c.id);
    byParent.set(c.parent, arr);
  }
  if (root === null) return [];
  const out: Pos[] = [];
  const visit = (id: number, depth: number, left: number): number => {
    const kids = byParent.get(id) ?? [];
    let curX = left;
    for (const kid of kids) curX = visit(kid, depth + 1, curX);
    const x = kids.length === 0 ? curX : (left + curX) / 2;
    out.push({ id, x, y: depth * gapY + nodeH + 20 });
    return kids.length === 0 ? curX + gapX : curX;
  };
  visit(root, 0, 60);
  return out;
}

export function fitToBox(points: Pos[], w: number, h: number, nodeW: number, nodeH: number): Pos[] {
  if (points.length === 0) return [];
  if (points.length === 1) return [{ id: points[0].id, x: w / 2, y: h / 2 }];
  const padX = nodeW / 2 + 8;
  const padY = nodeH / 2 + 8;
  const usableW = Math.max(1, w - 2 * padX);
  const usableH = Math.max(1, h - 2 * padY);
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min(usableW / spanX, usableH / spanY, 1.4);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return points.map((p) => ({ id: p.id, x: w / 2 + (p.x - cx) * scale, y: h / 2 + (p.y - cy) * scale }));
}

export function trimToRect(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = x2 - x1, dy = y2 - y1;
  if (dx === 0 && dy === 0) return { x1, y1, x2, y2 };
  const t1 = Math.min(dx !== 0 ? (w1 / 2) / Math.abs(dx) : Infinity, dy !== 0 ? (h1 / 2) / Math.abs(dy) : Infinity);
  const t2 = Math.min(dx !== 0 ? (w2 / 2) / Math.abs(dx) : Infinity, dy !== 0 ? (h2 / 2) / Math.abs(dy) : Infinity);
  return { x1: x1 + dx * t1, y1: y1 + dy * t1, x2: x2 - dx * t2, y2: y2 - dy * t2 };
}

export function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur.length === 0) cur = w;
    else if (cur.length + 1 + w.length <= maxChars) cur += ' ' + w;
    else { lines.push(cur); cur = w; if (lines.length >= maxLines) break; }
  }
  if (lines.length < maxLines && cur.length > 0) lines.push(cur);
  if (lines.length > maxLines) lines.length = maxLines;
  if (lines.length === maxLines && lines.join(' ').length < words.join(' ').length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > maxChars - 3 ? last.slice(0, maxChars - 3) + '...' : last + '...';
  }
  return lines;
}
