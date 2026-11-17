// Generate per-problem trace JSON (v4) by running correct & buggy Python solutions under a tracer.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { problems } from '../src/data/problemRegistry';
import { describeChange, formatSnap } from '../src/features/visualizer/explain';
import type { Kind, Run, Snap, Step, VizData, TreeStructure, GraphStructure } from '../src/features/visualizer/types';

const CFG = {
  eligibleTopics: ['Trees', 'Graphs', 'Recursion', 'Backtracking', 'Divide and Conquer'] as readonly string[],
  maxEvents: 2000,
  timeoutMs: 10000,
  maxSteps: 220,
  maxStoryBytes: 250_000,
  minRecursiveCalls: 3,
  minRecursionDepth: 2,
  setupIters: 2,
  setupSteps: 8,
};

interface TracerTopCall {
  fn: string;
  args: Record<string, Snap>;
  outcome: 'ok' | 'crash' | 'limit';
  result: Snap | null;
  error?: string;
  steps: Step[];
}

interface TracerOut {
  printed: string;
  structure: { tree?: TreeStructure; graph?: GraphStructure };
  topCalls: TracerTopCall[];
}

function pythonAvailable(): boolean {
  return !spawnSync('python3', ['--version'], { encoding: 'utf8' }).error;
}

function runTracer(code: string, driver: string): { ok: true; out: TracerOut } | { ok: false; reason: string } {
  const r = spawnSync('python3', ['scripts/viz/tracer.py'], {
    input: JSON.stringify({ code, driver, maxEvents: CFG.maxEvents, maxItems: 24, setupIters: CFG.setupIters, setupSteps: CFG.setupSteps }),
    encoding: 'utf8',
    timeout: CFG.timeoutMs,
    maxBuffer: 64 * 1024 * 1024,
  });
  const err = r.error as NodeJS.ErrnoException | undefined;
  if (err?.code === 'ETIMEDOUT') return { ok: false, reason: 'tracer timeout' };
  if (r.status !== 0) return { ok: false, reason: (r.stderr || 'tracer failed').trim().slice(0, 200) };
  try { return { ok: true, out: JSON.parse(r.stdout) as TracerOut }; }
  catch { return { ok: false, reason: 'tracer returned invalid JSON' }; }
}

/**
 * Edge direction cannot be read reliably from the data (an edge list looks the same either way),
 * so the problem statement decides: "undirected" -> plain lines, "directed" -> arrows.
 * Falls back to what the tracer detected when the text does not say.
 */
function applyDirection(p: { title: string; description: string; subtopic?: string; tags?: string[]; constraints?: string[] }, st: TracerOut['structure']): void {
  const g = st.graph;
  if (!g) return;
  const txt = [p.title, p.description, p.subtopic ?? '', ...(p.tags ?? []), ...(p.constraints ?? [])].join(' ').toLowerCase();
  const undirected = /undirected/.test(txt);
  const directed = /directed/.test(txt.replace(/undirected/g, ''));
  if (undirected && !directed) {
    if (g.directed) {
      const seen = new Set<string>();
      const edges: ([number, number] | [number, number, number])[] = [];
      for (const e of g.edges as ([number, number] | [number, number, number])[]) {
        const key = Math.min(e[0], e[1]) + '-' + Math.max(e[0], e[1]);
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push(e);
      }
      g.edges = edges as GraphStructure['edges'];
    }
    g.directed = false;
  } else if (directed && !undirected) {
    g.directed = true;
  }
}

function pickCall(c: TracerTopCall[], b: TracerTopCall[]): number {
  const n = Math.min(c.length, b.length);
  for (let i = 0; i < n; i++) {
    if (c[i].outcome !== b[i].outcome || JSON.stringify(c[i].result) !== JSON.stringify(b[i].result)) return i;
  }
  return 0;
}

function hasRecursion(steps: Step[]): boolean {
  const counts = new Map<string, number>();
  let maxDepth = 0;
  for (const s of steps) {
    if (s.depth > maxDepth) maxDepth = s.depth;
    if (s.ev === 'call') counts.set(s.fn, (counts.get(s.fn) ?? 0) + 1);
  }
  if (maxDepth < CFG.minRecursionDepth) return false;
  for (const c of counts.values()) if (c >= CFG.minRecursiveCalls) return true;
  return false;
}

/** Identity of a step for comparing the two runs. Ignores display-only fields (x, sk, cl). */
function stepKey(s: Step): string {
  return JSON.stringify([s.ev, s.fn, s.line, s.locals, s.ret, s.et ?? s.err]);
}

function shortSnap(v: Snap | null | undefined): string {
  const s = formatSnap(v);
  return s.length > 28 ? s.slice(0, 25) + '...' : s;
}

function findDivergence(c: Step[], b: Step[], bOutcome: 'ok' | 'crash' | 'limit'): VizData['divergence'] {
  const n = Math.min(c.length, b.length);
  for (let i = 0; i < n; i++) {
    if (stepKey(c[i]) === stepKey(b[i])) continue;
    const a = c[i];
    const bb = b[i];
    // the line that ran just before the runs started to differ (same call), usually where the bug is
    const before = i > 0 && b[i - 1].call === bb.call && b[i - 1].ev === 'line' ? b[i - 1].line : undefined;
    const after = before !== undefined ? 'After line ' + before + ' ran, ' : '';
    const mk = (reason: string): VizData['divergence'] => ({ correctStep: i, buggyStep: i, reason, causeLine: before });
    if (bb.ev === 'exception') return mk('The buggy run crashes: ' + (bb.err ?? 'error'));
    if (a.ev === 'return' && bb.ev === 'return' && JSON.stringify(a.ret) !== JSON.stringify(bb.ret)) {
      return mk(bb.fn + ' returns ' + shortSnap(bb.ret) + ' but the correct run returns ' + shortSnap(a.ret));
    }
    if (a.ev !== bb.ev && a.fn === bb.fn) {
      if (bb.ev === 'return') return mk(bb.fn + ' returns ' + shortSnap(bb.ret) + ' here, but the correct run keeps going (line ' + a.line + ')');
      if (a.ev === 'return') return mk('The buggy run keeps going (line ' + bb.line + ') where the correct run returns ' + shortSnap(a.ret));
      return mk('The buggy run does a ' + bb.ev + ' at line ' + bb.line + ' where the correct run does a ' + a.ev + ' at line ' + a.line);
    }
    if (a.fn === bb.fn && a.line !== bb.line) {
      return mk('The buggy run goes to line ' + bb.line + ' inside ' + bb.fn + ' where the correct run goes to line ' + a.line);
    }
    const keys = new Set([...Object.keys(a.locals), ...Object.keys(bb.locals)]);
    for (const k of keys) {
      if (JSON.stringify(a.locals[k]) === JSON.stringify(bb.locals[k])) continue;
      // name the exact list index / key that differs, e.g. "state[3] is 1 but should be 2"
      const d = describeChange(a.locals[k], bb.locals[k]);
      if (d !== null && d.startsWith('[') && !d.includes(', [')) {
        const m = /^\[(\d+)\]: (.*) \u2192 (.*)$/.exec(d);
        if (m) return mk(after + k + '[' + m[1] + '] is ' + m[3] + ' but should be ' + m[2]);
      }
      const got = shortSnap(bb.locals[k]);
      const want = shortSnap(a.locals[k]);
      if (got === want) return mk(after + k + ' points to a different node (it has the same value ' + got + ')');
      return mk(after + k + ' is ' + got + ' but should be ' + want);
    }
    return mk('Execution diverges here');
  }
  if (bOutcome === 'crash') {
    return { correctStep: Math.max(0, c.length - 1), buggyStep: Math.max(0, b.length - 1), reason: 'Crashes near the end' };
  }
  if (bOutcome === 'limit') {
    return { correctStep: Math.max(0, c.length - 1), buggyStep: Math.max(0, b.length - 1), reason: 'Never stops (step limit)' };
  }
  return null;
}

function trimSteps(steps: Step[], cap: number): { steps: Step[]; truncated: boolean } {
  if (steps.length <= cap) return { steps: steps.slice(), truncated: false };
  return { steps: steps.slice(0, cap), truncated: true };
}

function main(): void {
  if (!pythonAvailable()) {
    console.log('python3 not found; skipping generation.');
    return;
  }
  if (!existsSync('scripts/viz/tracer.py')) {
    console.log('scripts/viz/tracer.py missing.');
    return;
  }
  mkdirSync('src/data/viz/stories', { recursive: true });

  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const only = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--only') {
      let j = i + 1;
      while (j < args.length && !args[j].startsWith('--')) { only.add(args[j]); j++; }
      i = j - 1;
    }
  }

  const tracerHash = createHash('sha1').update(readFileSync('scripts/viz/tracer.py')).update('v4').digest('hex');
  const included: { id: string; kind: Kind }[] = [];
  const includedIds = new Set<string>();
  const report: string[] = [];
  const skipped: string[] = [];

  for (const p of problems) {
    if (only.size > 0 && !only.has(p.id)) continue;
    if (!CFG.eligibleTopics.includes(p.topic)) continue;
    const file = join('src/data/viz/stories', p.id + '.json');
    try {
      if (!force && existsSync(file)) {
        const existing = JSON.parse(readFileSync(file, 'utf8')) as VizData;
        if (existing.version === 4 && existing.problemId === p.id && existing.sourceHash === tracerHash + p.id) {
          included.push({ id: p.id, kind: existing.kind });
          includedIds.add(p.id);
          report.push(p.id + ' ' + existing.kind + ' ' + existing.correct.steps.length + '+' + existing.buggy.steps.length + ' steps');
          continue;
        }
      }

      const h = p.harness;
      if (!h) { skipped.push(p.id + ': no harness'); continue; }
      const driver = h.driver.python;
      if (!driver) { skipped.push(p.id + ': no python driver'); continue; }
      const cCode = p.correctCode.python;
      const bCode = p.buggyCode.python;
      if (cCode === undefined || bCode === undefined) { skipped.push(p.id + ': no python code'); continue; }

      const cr = runTracer(cCode, driver);
      if (!cr.ok) { skipped.push(p.id + ': correct trace failed: ' + cr.reason); continue; }
      if (cr.out.printed.trim() !== h.expected.trim()) { skipped.push(p.id + ': correct output mismatch'); continue; }
      const br = runTracer(bCode, driver);
      if (!br.ok) { skipped.push(p.id + ': buggy trace failed: ' + br.reason); continue; }
      if (cr.out.topCalls.length === 0 || br.out.topCalls.length === 0) { skipped.push(p.id + ': no top-level call'); continue; }

      applyDirection(p, cr.out.structure);
      const idx = pickCall(cr.out.topCalls, br.out.topCalls);
      const ct = cr.out.topCalls[idx];
      const bt = br.out.topCalls[idx];
      if (!ct || !bt) { skipped.push(p.id + ': missing chosen call'); continue; }
      if (ct.outcome !== 'ok') { skipped.push(p.id + ': correct did not finish'); continue; }

      let kind: Kind | null = null;
      if (cr.out.structure.tree) kind = 'tree';
      else if (cr.out.structure.graph) kind = 'graph';
      else if (hasRecursion(ct.steps)) kind = 'calls';
      if (!kind) { skipped.push(p.id + ': no structure and no recursion'); continue; }

      const div = findDivergence(ct.steps, bt.steps, bt.outcome);
      const cTrim = trimSteps(ct.steps, CFG.maxSteps);
      const bTrim = trimSteps(bt.steps, CFG.maxSteps);

      cTrim.steps.forEach((s, i) => { s.i = i; });
      bTrim.steps.forEach((s, i) => { s.i = i; });

      const correctRun: Run = { outcome: ct.outcome, result: ct.result, steps: cTrim.steps };
      if (cTrim.truncated) correctRun.truncated = true;
      const buggyRun: Run = { outcome: bt.outcome, result: bt.result, steps: bTrim.steps };
      if (bTrim.truncated) buggyRun.truncated = true;
      if (ct.error) correctRun.error = ct.error;
      if (bt.error) buggyRun.error = bt.error;

      let adjustedDiv = div;
      if (div && (div.correctStep >= cTrim.steps.length || div.buggyStep >= bTrim.steps.length)) adjustedDiv = null;

      const data: VizData = {
        version: 4,
        problemId: p.id,
        sourceHash: tracerHash + p.id,
        kind,
        structure: cr.out.structure,
        code: { correct: cCode, buggy: bCode },
        buggyLines: p.buggyLines.python ?? [],
        correct: correctRun,
        buggy: buggyRun,
        divergence: adjustedDiv,
      };

      const json = JSON.stringify(data);
      if (json.length > CFG.maxStoryBytes) { skipped.push(p.id + ': story too big (' + json.length + 'B)'); continue; }
      writeFileSync(file, json);
      included.push({ id: p.id, kind });
      includedIds.add(p.id);
      report.push(p.id + ' ' + kind + ' ' + correctRun.steps.length + '+' + buggyRun.steps.length + ' steps');
    } catch (e) {
      skipped.push(p.id + ': ' + (e instanceof Error ? e.message : String(e)).slice(0, 140));
    }
  }

  if (only.size === 0) {
    for (const f of readdirSync('src/data/viz/stories')) {
      if (!f.endsWith('.json')) continue;
      const id = f.slice(0, -5);
      if (!includedIds.has(id)) { try { unlinkSync(join('src/data/viz/stories', f)); } catch { /* ignore */ } }
    }
  }

  const lines: string[] = [];
  lines.push('/* AUTO-GENERATED by scripts/genViz.ts. DO NOT EDIT. */');
  lines.push("import type { Kind } from '../../features/visualizer/types';");
  lines.push('');
  lines.push('export const VIZ_INDEX: Record<string, { kind: Kind }> = {');
  const sorted = included.slice().sort((a, b) => a.id.localeCompare(b.id));
  for (const it of sorted) lines.push('  ' + JSON.stringify(it.id) + ': { kind: ' + JSON.stringify(it.kind) + ' },');
  lines.push('};');
  lines.push('');
  lines.push('export function hasVisualizer(id: string): boolean {');
  lines.push('  return Object.prototype.hasOwnProperty.call(VIZ_INDEX, id);');
  lines.push('}');
  writeFileSync('src/data/viz/vizIndex.ts', lines.join('\n'));

  const reportLines = ['included: ' + included.length, 'skipped: ' + skipped.length, '', ...report, ...skipped.map((s) => 'skip ' + s)];
  writeFileSync('viz-report.txt', reportLines.join('\n') + '\n');

  console.log('Viz generation complete.');
  console.log('Included: ' + included.length);
  console.log('Skipped: ' + skipped.length);
}

main();
