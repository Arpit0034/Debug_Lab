// The execution canvas. Draws the structure with per-step state, sized for reading.
// v5 visual pass: circular nodes, gradient/glow states, arrowheads, animated active edges.
// All logic (layout, annotations, step state) is unchanged; styling lives in src/styles/index.css (.viz-*).
// viz-interactive-v1
// viz-hover-v1
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { callLayout, ellipseLayout, fitToBox, treeLayout, trimToRect, type Pos } from './layout';
import { deriveAnnotations, formatSnap } from './explain';
import { MONO } from './theme';
import type { CallNode } from './layout';
import type { Kind, Step, VizData } from './types';

interface Props {
  kind: Kind;
  structure: VizData['structure'];
  steps: Step[];
  stepIndex: number;
  divergenceCallId: number | null;
}

const W = 880;
const H = 560;
const NODE_R = 28;
const CALL_W = 280;
const CALL_H = 52;

type NodeState = 'idle' | 'current' | 'visited' | 'returned' | 'divergence';

interface CallMeta {
  id: number;
  parent: number | null;
  fn: string;
  args: string;
  returned?: string;
}

function buildCalls(steps: Step[], stepIndex: number): CallMeta[] {
  const map = new Map<number, CallMeta>();
  const limit = Math.min(stepIndex, steps.length - 1);
  for (let i = 0; i <= limit; i++) {
    const s = steps[i];
    if (s.ev === 'call' && !map.has(s.call)) {
      const args = Object.entries(s.locals)
        .filter(([k]) => k !== 'self' && k !== 'cls' && (!s.ar || s.ar.includes(k)))
        .slice(0, 2)
        .map(([k, v]) => k + '=' + formatSnap(v))
        .join(', ');
      map.set(s.call, { id: s.call, parent: s.parent, fn: s.fn, args });
    } else if (s.ev === 'return' && map.has(s.call)) {
      const c = map.get(s.call)!;
      c.returned = formatSnap(s.ret);
    }
  }
  return [...map.values()];
}

/** Shorten text with an ellipsis. */
function clip(text: string, max: number): string {
  return text.length > max ? text.slice(0, Math.max(1, max - 1)) + '\u2026' : text;
}

/** Font size that keeps a value readable inside a circle. */
function nodeFont(len: number): number {
  if (len <= 2) return 16;
  if (len === 3) return 14;
  if (len <= 5) return 12;
  return 11;
}

/** Trim a segment so it starts/ends on the borders of two circles (plus a small gap). */
function trimCircle(
  x1: number, y1: number, r1: number,
  x2: number, y2: number, r2: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len === 0 || len <= r1 + r2) return { x1, y1, x2, y2 };
  const ux = dx / len;
  const uy = dy / len;
  return { x1: x1 + ux * r1, y1: y1 + uy * r1, x2: x2 - ux * r2, y2: y2 - uy * r2 };
}

function pillWidth(text: string, size: number, min: number): number {
  return Math.max(min, Math.ceil(text.length * size * 0.62) + 18);
}

function Defs({ uid }: { uid: string }): React.ReactElement {
  const grad = (id: string, hi: string, lo: string): React.ReactElement => (
    <radialGradient id={uid + '-g-' + id} cx="35%" cy="28%" r="85%">
      <stop offset="0%" style={{ stopColor: 'var(--viz-' + hi + ')' }} />
      <stop offset="100%" style={{ stopColor: 'var(--viz-' + lo + ')' }} />
    </radialGradient>
  );
  const card = (id: string, hi: string, lo: string): React.ReactElement => (
    <linearGradient id={uid + '-c-' + id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style={{ stopColor: 'var(--viz-' + hi + ')' }} />
      <stop offset="100%" style={{ stopColor: 'var(--viz-' + lo + ')' }} />
    </linearGradient>
  );
  return (
    <defs>
      {grad('idle', 'idle-hi', 'idle-lo')}
      {grad('current', 'cur-hi', 'cur-lo')}
      {grad('visited', 'good-hi', 'good-lo')}
      {grad('returned', 'good-hi', 'good-lo')}
      {grad('divergence', 'bad-hi', 'bad-lo')}
      {card('idle', 'idle-hi', 'idle-lo')}
      {card('current', 'cur-hi', 'cur-lo')}
      {card('visited', 'good-hi', 'good-lo')}
      {card('returned', 'good-hi', 'good-lo')}
      {card('divergence', 'bad-hi', 'bad-lo')}
      <filter id={uid + '-glow'} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <marker id={uid + '-arr'} markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
        <path className="viz-arrow" d="M1 1.2 L9 5 L1 8.8 L3.2 5 Z" />
      </marker>
      <marker id={uid + '-arr-on'} markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
        <path className="viz-arrow viz-arrow--on" d="M1 1.2 L9 5 L1 8.8 L3.2 5 Z" />
      </marker>
    </defs>
  );
}

interface EdgeProps {
  x1: number; y1: number; x2: number; y2: number;
  active: boolean;
  arrow: boolean;
  uid: string;
}

function Edge({ x1, y1, x2, y2, active, arrow, uid }: EdgeProps): React.ReactElement {
  const marker = arrow ? 'url(#' + uid + (active ? '-arr-on' : '-arr') + ')' : undefined;
  return (
    <g className="viz-edge-g" data-active={active ? 'true' : 'false'}>
      {active && <line className="viz-edge-glow" x1={x1} y1={y1} x2={x2} y2={y2} />}
      <line className="viz-edge" x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={marker} />
      {active && <line className="viz-edge-flow" x1={x1} y1={y1} x2={x2} y2={y2} />}
    </g>
  );
}

interface CircleNodeProps {
  uid: string;
  x: number;
  y: number;
  text: string;
  state: NodeState;
  pillText?: string;
  pillKind?: 'return' | 'label';
  onDown?: (e: React.PointerEvent) => void;
  dragging?: boolean;
  onHover?: (e: React.PointerEvent) => void;
  onLeave?: () => void;
}

function CircleNode({ uid, x, y, text, state, pillText, pillKind, onDown, dragging, onHover, onLeave }: CircleNodeProps): React.ReactElement {
  const shown = clip(text, 5);
  const fs = nodeFont(shown.length);
  const hot = state === 'current' || state === 'divergence';
  const pill = pillText !== undefined ? clip(pillText, pillKind === 'return' ? 12 : 16) : null;
  const pw = pill !== null ? pillWidth(pill, 12, 48) : 0;
  const badgeX = NODE_R * 0.78;
  const badgeY = -NODE_R * 0.78;
  return (
    <g transform={'translate(' + x + ' ' + y + ')'} className={'viz-node' + (onDown ? ' viz-drag' : '') + (dragging ? ' viz-dragging' : '')} data-state={state} onPointerDown={onDown} onPointerEnter={onHover} onPointerMove={onHover} onPointerLeave={onLeave}>
      {hot && <circle className="viz-halo" r={NODE_R + 8} fill="currentColor" filter={'url(#' + uid + '-glow)'} />}
      <g className="viz-pop">
        <g className="viz-shake">
          <g className="viz-lift">
            <circle className="viz-shadow" cy={3} r={NODE_R} />
            <circle className="viz-body" r={NODE_R} fill={'url(#' + uid + '-g-' + state + ')'} />
            <ellipse className="viz-gloss" cx={-8} cy={-12} rx={13} ry={6.5} transform="rotate(-28 -8 -12)" />
            <circle className="viz-rim" r={NODE_R} />
            <text className="viz-node-text" x={0} y={fs * 0.36} textAnchor="middle" fontSize={fs} fontFamily={MONO}>
              {shown}
            </text>
            {(state === 'visited' || state === 'returned') && (
              <g className="viz-badge-mark viz-badge-mark--good" transform={'translate(' + badgeX + ' ' + badgeY + ')'}>
                <circle r={9} />
                <path d="M-4 0.4 L-1.2 3.2 L4.2 -2.8" />
              </g>
            )}
            {state === 'divergence' && (
              <g className="viz-badge-mark viz-badge-mark--bad" transform={'translate(' + badgeX + ' ' + badgeY + ')'}>
                <circle r={10} />
                <path d="M-3.4 -3.4 L3.4 3.4 M3.4 -3.4 L-3.4 3.4" />
              </g>
            )}
          </g>
        </g>
      </g>
      {pill !== null && (
        <g className="viz-pill-g" data-kind={pillKind} transform={'translate(0 ' + (NODE_R + 18) + ')'}>
          <g className="viz-pop">
            <rect className="viz-pill" x={-pw / 2} y={-10} width={pw} height={20} rx={10} />
            <text className="viz-pill-text" x={0} y={4} textAnchor="middle" fontSize={12} fontFamily={MONO}>
              {pillKind === 'return' ? '\u2192 ' + pill : pill}
            </text>
          </g>
        </g>
      )}
    </g>
  );
}

export function Canvas({ kind, structure, steps, stepIndex, divergenceCallId }: Props): React.ReactElement {
  const uid = 'viz' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const step = steps[stepIndex] ?? null;
  const ann = useMemo(
    () => deriveAnnotations(kind, step, steps, stepIndex, structure),
    [kind, step, steps, stepIndex, structure],
  );

  const calls = useMemo(() => (kind === 'calls' ? buildCalls(steps, stepIndex) : []), [kind, steps, stepIndex]);

  const positions = useMemo<Pos[]>(() => {
    if (kind === 'tree' && structure.tree) {
      const cell = NODE_R * 2 + 14;
      return fitToBox(treeLayout(structure.tree, 52, cell + 34, 96), W - 60, H - 100, cell, 52);
    }
    if (kind === 'graph' && structure.graph) {
      const n = structure.graph.n;
      if (n === 0) return [];
      return fitToBox(ellipseLayout(n, W / 2 - 80, H / 2 - 80, W / 2, H / 2), W - 60, H - 100, 64, 64);
    }
    if (kind === 'calls' && calls.length > 0) {
      const input: CallNode[] = calls.map((c) => ({ id: c.id, parent: c.parent }));
      return fitToBox(callLayout(input, 60, 130, 110), W - 60, H - 100, 290, 60);
    }
    return [];
  }, [kind, structure, calls]);

  // ---- interactivity (visual-only overlay; the structure and steps are never modified) ----
  const svgRef = useRef<SVGSVGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<Record<number, { x: number; y: number }>>({});
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const [dragId, setDragId] = useState<number | null>(null);
  const [panning, setPanning] = useState(false);
  const drag = useRef<
    | { mode: 'node'; id: number; sx: number; sy: number; ox: number; oy: number }
    | { mode: 'pan'; cx: number; cy: number; vx: number; vy: number }
    | null
  >(null);

  // A different problem / structure starts from a clean layout.
  useEffect(() => { setOffsets({}); setView({ k: 1, x: 0, y: 0 }); }, [kind, structure]);

  const posById = useMemo(
    () => new Map(positions.map((p) => {
      const o = offsets[p.id];
      return [p.id, o ? { id: p.id, x: p.x + o.x, y: p.y + o.y } : p] as [number, Pos];
    })),
    [positions, offsets],
  );

  /** Client (screen) point -> svg viewBox point. */
  const toViewBox = (cx: number, cy: number): { x: number; y: number } | null => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  /** Client point -> layout space (undoes pan + zoom), so node drags stay under the cursor. */
  const toLayout = (cx: number, cy: number): { x: number; y: number } | null => {
    const p = toViewBox(cx, cy);
    return p ? { x: (p.x - view.x) / view.k, y: (p.y - view.y) / view.k } : null;
  };

  const zoomAt = (factor: number, vx: number, vy: number): void => {
    setView((v) => {
      const k = Math.min(4, Math.max(0.35, v.k * factor));
      const r = k / v.k;
      return { k, x: vx - (vx - v.x) * r, y: vy - (vy - v.y) * r };
    });
  };

  const resetLayout = (): void => { setOffsets({}); setView({ k: 1, x: 0, y: 0 }); };

  const startNodeDrag = (e: React.PointerEvent, id: number): void => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const p = toLayout(e.clientX, e.clientY);
    if (!p) return;
    const o = offsets[id] ?? { x: 0, y: 0 };
    drag.current = { mode: 'node', id, sx: p.x, sy: p.y, ox: o.x, oy: o.y };
    svgRef.current?.setPointerCapture(e.pointerId);
    setDragId(id);
  };

  const onSvgDown = (e: React.PointerEvent): void => {
    if (e.button !== 0) return;
    drag.current = { mode: 'pan', cx: e.clientX, cy: e.clientY, vx: view.x, vy: view.y };
    svgRef.current?.setPointerCapture(e.pointerId);
    setPanning(true);
  };

  const onSvgMove = (e: React.PointerEvent): void => {
    const d = drag.current;
    if (!d) return;
    if (d.mode === 'node') {
      const p = toLayout(e.clientX, e.clientY);
      if (!p) return;
      setOffsets((prev) => ({ ...prev, [d.id]: { x: d.ox + p.x - d.sx, y: d.oy + p.y - d.sy } }));
    } else {
      const s = svgRef.current?.getScreenCTM()?.a ?? 1;
      setView((v) => ({ ...v, x: d.vx + (e.clientX - d.cx) / s, y: d.vy + (e.clientY - d.cy) / s }));
    }
  };

  const endDrag = (e: React.PointerEvent): void => {
    drag.current = null;
    setDragId(null);
    setPanning(false);
    if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
  };

  // Ctrl/Cmd + wheel (and trackpad pinch) zooms; plain scroll still scrolls the page.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const onWheel = (ev: WheelEvent): void => {
      if (!ev.ctrlKey && !ev.metaKey) return;
      ev.preventDefault();
      const p = toViewBox(ev.clientX, ev.clientY);
      if (p) zoomAt(Math.exp(-ev.deltaY * 0.0015), p.x, p.y);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions.length]);

  const [hover, setHover] = useState<{ id: number; x: number; y: number } | null>(null);
  const showHover = (id: number) => (e: React.PointerEvent): void => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r || drag.current) return;
    setHover({ id, x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const hideHover = (): void => setHover(null);

  const moved = Object.keys(offsets).length > 0 || view.k !== 1 || view.x !== 0 || view.y !== 0;

  if (positions.length === 0) {
    return (
      <div className="viz-root viz-empty">
        <svg className="viz-empty-icon" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="16" />
        </svg>
        <span>No visible structure at this step.</span>
      </div>
    );
  }

  const isDivergenceStep = divergenceCallId !== null && step !== null && step.call === divergenceCallId;
  const pct = steps.length > 1 ? Math.round((stepIndex / (steps.length - 1)) * 100) : 100;
  const evLabel = step
    ? step.ev === 'call' ? '\u2192 call'
      : step.ev === 'return' ? '\u2190 return'
      : step.ev === 'exception' ? '! exception'
      : '\u25B6 line ' + step.line
    : '';
  const kindLabel = kind === 'tree' ? 'Tree' : kind === 'graph' ? 'Graph' : 'Call tree';

  const treeState = (id: number): NodeState => {
    const a = ann.tree.get(id);
    if (a?.current) return isDivergenceStep ? 'divergence' : 'current';
    if (a?.returnedValue !== undefined) return 'returned';
    return 'idle';
  };

  const graphState = (v: number): NodeState => {
    const a = ann.graph.get(v);
    if (a?.current) return isDivergenceStep ? 'divergence' : 'current';
    if (a?.visited) return 'visited';
    return 'idle';
  };

  // ---- hover info: what is this node doing right now? ----
  const describeNode = (id: number): { title: string; state: NodeState; rows: [string, string][] } | null => {
    const stateWord = (s: NodeState): string =>
      s === 'current' ? 'current (being processed)' : s === 'divergence' ? 'current (bug starts here)'
        : s === 'returned' ? 'finished' : s === 'visited' ? 'visited' : 'not reached yet';
    const list = (items: string[], max = 8): string =>
      items.length === 0 ? 'none' : items.slice(0, max).join(', ') + (items.length > max ? ' +' + (items.length - max) + ' more' : '');

    if (kind === 'tree' && structure.tree) {
      const nodes = structure.tree.nodes;
      const byId = new Map(nodes.map((n) => [n.id, n]));
      const me = byId.get(id);
      if (!me) return null;
      const label = (nid: number | null): string => {
        if (nid === null || !byId.has(nid)) return 'none';
        return ann.tree.get(nid)?.value ?? formatSnap(byId.get(nid)!.val);
      };
      let parent: number | null = null;
      for (const n of nodes) if (n.left === id || n.right === id) parent = n.id;
      let depth = 0;
      for (let cur = parent; cur !== null && depth < 1000; depth++) {
        let up: number | null = null;
        for (const n of nodes) if (n.left === cur || n.right === cur) up = n.id;
        cur = up;
      }
      const st = treeState(id);
      const a = ann.tree.get(id);
      const rows: [string, string][] = [
        ['State', stateWord(st)],
        ['Value', a?.value ?? formatSnap(me.val)],
        ['Parent', parent === null ? 'none (root)' : label(parent)],
        ['Left', label(me.left)],
        ['Right', label(me.right)],
        ['Depth', String(depth)],
        ['Leaf', me.left === null && me.right === null ? 'yes' : 'no'],
      ];
      if (a?.returnedValue !== undefined) rows.push(['Returned', a.returnedValue]);
      return { title: 'Node ' + (a?.value ?? formatSnap(me.val)), state: st, rows };
    }

    if (kind === 'graph' && structure.graph) {
      const g = structure.graph;
      const outs: string[] = [];
      const ins: string[] = [];
      for (const e of g.edges) {
        const w = e.length === 3 ? ' (w=' + e[2] + ')' : '';
        if (e[0] === id) outs.push(e[1] + w);
        if (g.directed) { if (e[1] === id) ins.push(e[0] + w); }
        else if (e[1] === id && e[0] !== id) outs.push(e[0] + w);
      }
      const st = graphState(id);
      const a = ann.graph.get(id);
      const rows: [string, string][] = [['State', stateWord(st)]];
      rows.push([g.directed ? 'Out to' : 'Neighbors', list(outs)]);
      if (g.directed) rows.push(['In from', list(ins)]);
      rows.push(['Degree', g.directed ? 'out ' + outs.length + ', in ' + ins.length : String(outs.length)]);
      if (a) for (const [k, v] of [...a.labels.entries()].slice(0, 6)) rows.push([k, v]);
      return { title: 'Vertex ' + id, state: st, rows };
    }

    if (kind === 'calls') {
      const c = calls.find((x) => x.id === id);
      if (!c) return null;
      const byCall = new Map(calls.map((x) => [x.id, x]));
      let depth = 0;
      for (let p = c.parent; p !== null && byCall.has(p) && depth < 1000; depth++) p = byCall.get(p)!.parent;
      const isCur = ann.callCurrent === id;
      const st: NodeState = isDivergenceStep && isCur ? 'divergence' : isCur ? 'current' : c.returned !== undefined ? 'returned' : 'idle';
      const par = c.parent !== null ? byCall.get(c.parent) : undefined;
      const rows: [string, string][] = [
        ['State', c.returned !== undefined ? 'returned' : isCur ? 'running now' : 'waiting on a sub-call'],
        ['Args', c.args === '' ? 'none' : c.args],
        ['Returned', c.returned ?? 'not yet'],
        ['Called by', par ? par.fn + '(' + par.args + ')' : 'top level'],
        ['Depth', String(depth)],
        ['Sub-calls', String(calls.filter((x) => x.parent === id).length)],
      ];
      return { title: c.fn + '()', state: st, rows };
    }
    return null;
  };

  const tip = hover && dragId === null ? describeNode(hover.id) : null;
  const stageW = stageRef.current?.clientWidth ?? 600;
  const stageH = stageRef.current?.clientHeight ?? 400;
  const tipH = tip ? 34 + tip.rows.length * 20 : 0;
  const tipLeft = hover ? (hover.x > stageW - 270 ? hover.x - 258 : hover.x + 16) : 0;
  const tipTop = hover ? (hover.y + 16 + tipH > stageH ? Math.max(4, hover.y - tipH - 8) : hover.y + 16) : 0;

  return (
    <div className="viz-root viz-canvas">
      <div className="viz-head">
        <div className="viz-step">
          Step <span className="viz-step-n">{stepIndex + 1}</span> / {steps.length}
        </div>
        {step && (
          <div className="viz-head-right">
            <span className="viz-ev" data-ev={step.ev}>{evLabel}</span>
            <span className="viz-fn">{step.fn}</span>
          </div>
        )}
      </div>
      <div className="viz-progress" aria-hidden="true">
        <div className="viz-progress-bar" style={{ width: pct + '%' }} />
      </div>
      <div ref={stageRef} className="viz-stage relative w-full" style={{ aspectRatio: W + ' / ' + H }}>
        <svg
          ref={svgRef}
          viewBox={'0 0 ' + W + ' ' + H}
          className={'viz-svg absolute inset-0 h-full w-full' + (panning ? ' viz-panning' : '')}
          onPointerDown={onSvgDown}
          onPointerMove={onSvgMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={resetLayout}
          role="img"
          aria-label={kindLabel + ' visualization, step ' + (stepIndex + 1) + ' of ' + steps.length}
        >
          <Defs uid={uid} />
          <g transform={'translate(' + view.x + ' ' + view.y + ') scale(' + view.k + ')'}>
          <g transform="translate(30 50)">

          {kind === 'tree' && structure.tree && structure.tree.nodes.map((n) => {
            const a = posById.get(n.id);
            if (!a) return null;
            const edges: React.ReactElement[] = [];
            for (const [idx, child] of ([n.left, n.right] as (number | null)[]).entries()) {
              if (child === null) continue;
              const b = posById.get(child);
              if (!b) continue;
              const t = trimCircle(a.x, a.y, NODE_R + 1, b.x, b.y, NODE_R + 4);
              const active = (ann.tree.get(child)?.current ?? false) || (ann.tree.get(n.id)?.current ?? false);
              edges.push(<Edge key={'te' + n.id + '-' + idx} {...t} active={active} arrow uid={uid} />);
            }
            return edges;
          })}

          {kind === 'graph' && structure.graph && structure.graph.edges.map((edge, i) => {
            const a = posById.get(edge[0]);
            const b = posById.get(edge[1]);
            if (!a || !b) return null;
            const w = edge.length === 3 ? edge[2] : undefined;
            const active = (ann.graph.get(edge[0])?.current ?? false) || (ann.graph.get(edge[1])?.current ?? false);
            const directed = structure.graph!.directed;
            if (edge[0] === edge[1]) {
              const d = 'M ' + (a.x - 10) + ' ' + (a.y - NODE_R + 2) + ' C ' + (a.x - 34) + ' ' + (a.y - NODE_R - 40) + ', ' + (a.x + 34) + ' ' + (a.y - NODE_R - 40) + ', ' + (a.x + 10) + ' ' + (a.y - NODE_R + 2);
              return (
                <g key={'ge' + i} className="viz-edge-g" data-active={active ? 'true' : 'false'}>
                  <path className="viz-edge" d={d} markerEnd={directed ? 'url(#' + uid + (active ? '-arr-on' : '-arr') + ')' : undefined} />
                </g>
              );
            }
            const t = trimCircle(a.x, a.y, NODE_R + 1, b.x, b.y, NODE_R + (directed ? 4 : 1));
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const label = w !== undefined ? String(w) : '';
            const lw = pillWidth(label, 12, 26);
            return (
              <g key={'ge' + i}>
                <Edge {...t} active={active} arrow={directed} uid={uid} />
                {w !== undefined && (
                  <g className="viz-weight" transform={'translate(' + mx + ' ' + my + ')'}>
                    <rect x={-lw / 2} y={-10} width={lw} height={20} rx={10} />
                    <text x={0} y={4} textAnchor="middle" fontSize={12} fontFamily={MONO}>{label}</text>
                  </g>
                )}
              </g>
            );
          })}

          {kind === 'calls' && calls.map((c) => {
            if (c.parent === null) return null;
            const a = posById.get(c.parent);
            const b = posById.get(c.id);
            if (!a || !b) return null;
            const t = trimToRect(a.x, a.y, CALL_W, CALL_H, b.x, b.y, CALL_W + 10, CALL_H + 12);
            const active = ann.callCurrent === c.id || ann.callCurrent === c.parent;
            return <Edge key={'ce' + c.id} {...t} active={active} arrow uid={uid} />;
          })}

          {kind === 'tree' && structure.tree && structure.tree.nodes.map((n) => {
            const p = posById.get(n.id);
            if (!p) return null;
            const a = ann.tree.get(n.id);
            const text = a?.value ?? formatSnap(n.val);
            return (
              <CircleNode
                key={'tn' + n.id}
                uid={uid}
                x={p.x}
                y={p.y}
                text={text}
                state={treeState(n.id)}
                pillText={a?.returnedValue}
                pillKind="return"
                onDown={(e) => startNodeDrag(e, n.id)}
                dragging={dragId === n.id}
                onHover={showHover(n.id)}
                onLeave={hideHover}
              />
            );
          })}

          {kind === 'graph' && structure.graph && Array.from({ length: structure.graph.n }, (_, v) => v).map((v) => {
            const p = posById.get(v);
            if (!p) return null;
            const a = ann.graph.get(v);
            const firstLabel = a && a.labels.size > 0 ? [...a.labels.entries()][0] : null;
            return (
              <CircleNode
                key={'gn' + v}
                uid={uid}
                x={p.x}
                y={p.y}
                text={String(v)}
                state={graphState(v)}
                pillText={firstLabel ? firstLabel[0] + '=' + firstLabel[1] : undefined}
                pillKind="label"
                onDown={(e) => startNodeDrag(e, v)}
                dragging={dragId === v}
                onHover={showHover(v)}
                onLeave={hideHover}
              />
            );
          })}

          {kind === 'calls' && calls.map((c) => {
            const p = posById.get(c.id);
            if (!p) return null;
            const isCurrent = ann.callCurrent === c.id;
            const isDiv = isDivergenceStep && isCurrent;
            const returned = c.returned;
            const state: NodeState = isDiv ? 'divergence' : isCurrent ? 'current' : returned !== undefined ? 'returned' : 'idle';
            const full = c.fn + '(' + c.args + ')';
            const argsMax = Math.max(4, 30 - c.fn.length);
            const retText = returned !== undefined ? clip(returned, 18) : null;
            const rw = retText !== null ? pillWidth('\u2192 ' + retText, 12, 56) : 0;
            return (
              <g key={'cn' + c.id} transform={'translate(' + p.x + ' ' + p.y + ')'} className={'viz-node viz-call viz-drag' + (dragId === c.id ? ' viz-dragging' : '')} data-state={state} onPointerDown={(e) => startNodeDrag(e, c.id)} onPointerEnter={showHover(c.id)} onPointerMove={showHover(c.id)} onPointerLeave={hideHover}>
                {(state === 'current' || state === 'divergence') && (
                  <rect className="viz-halo" x={-CALL_W / 2 - 4} y={-CALL_H / 2 - 4} width={CALL_W + 8} height={CALL_H + 8} rx={18} fill="currentColor" filter={'url(#' + uid + '-glow)'} />
                )}
                <g className="viz-pop">
                  <g className="viz-shake">
                    <g className="viz-lift">
                      <rect className="viz-shadow" x={-CALL_W / 2} y={-CALL_H / 2 + 3} width={CALL_W} height={CALL_H} rx={14} />
                      <rect className="viz-body" x={-CALL_W / 2} y={-CALL_H / 2} width={CALL_W} height={CALL_H} rx={14} fill={'url(#' + uid + '-c-' + state + ')'} />
                      <rect className="viz-rim" x={-CALL_W / 2} y={-CALL_H / 2} width={CALL_W} height={CALL_H} rx={14} />
                      <rect className="viz-stripe" x={-CALL_W / 2 + 9} y={-CALL_H / 2 + 11} width={4} height={CALL_H - 22} rx={2} />
                      <text className="viz-call-text" x={-CALL_W / 2 + 24} y={retText !== null ? -5 : 5} fontSize={13} fontFamily={MONO}>
                        <tspan className="viz-call-fn">{c.fn}</tspan>
                        <tspan className="viz-call-args">({clip(c.args, argsMax)})</tspan>
                      </text>
                      {retText !== null && (
                        <g className="viz-pill-g" data-kind="return" transform={'translate(' + (-CALL_W / 2 + 24 + rw / 2) + ' 11)'}>
                          <g className="viz-pop">
                            <rect className="viz-pill" x={-rw / 2} y={-9} width={rw} height={18} rx={9} />
                            <text className="viz-pill-text" x={0} y={4} textAnchor="middle" fontSize={12} fontFamily={MONO}>{'\u2192 ' + retText}</text>
                          </g>
                        </g>
                      )}
                      {state === 'divergence' && (
                        <g className="viz-badge-mark viz-badge-mark--bad" transform={'translate(' + (CALL_W / 2 - 16) + ' ' + (-CALL_H / 2 + 4) + ')'}>
                          <circle r={10} />
                          <path d="M-3.4 -3.4 L3.4 3.4 M3.4 -3.4 L-3.4 3.4" />
                        </g>
                      )}
                    </g>
                  </g>
                </g>
              </g>
            );
          })}
          </g>
          </g>
        </svg>
        <div className="viz-tools" onPointerDown={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
          <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoomAt(1.25, W / 2, H / 2)}>+</button>
          <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoomAt(0.8, W / 2, H / 2)}>{'\u2212'}</button>
          <button type="button" title="Reset layout and view" onClick={resetLayout} disabled={!moved}>Reset</button>
        </div>
        {tip && (
          <div className="viz-tip" style={{ left: tipLeft, top: tipTop }} role="tooltip">
            <div className="viz-tip-title" data-state={tip.state}>{tip.title}</div>
            {tip.rows.map(([k, v]) => (
              <div className="viz-tip-row" key={k}><span>{k}</span><b>{v}</b></div>
            ))}
          </div>
        )}
        <div className="viz-hint" aria-hidden="true">Hover for state \u00B7 drag nodes \u00B7 drag background to pan \u00B7 Ctrl+scroll to zoom</div>
      </div>
    </div>
  );
}
