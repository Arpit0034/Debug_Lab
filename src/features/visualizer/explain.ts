// Turn raw steps into human-readable state and "what's happening" text.
import type { Kind, Snap, Step, TreeStructure, VizData } from './types';

export interface FormatOpts { items?: number; len?: number }

export function formatSnap(v: Snap | null | undefined, opts?: FormatOpts): string {
  const items = opts?.items ?? 6;
  const maxLen = opts?.len ?? 40;
  if (v === undefined || v === null) return 'None';
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (typeof v === 'number' || typeof v === 'string') {
    const s = String(v);
    return s.length > 32 ? s.slice(0, 29) + '...' : s;
  }
  if (v.t === 'node') return formatSnap(v.val);
  if (v.t === 'list') {
    const parts = v.v.slice(0, items).map((x) => formatSnap(x));
    const suffix = v.more || v.v.length > items ? ', ...' : '';
    const s = '[' + parts.join(', ') + suffix + ']';
    return s.length > maxLen ? s.slice(0, maxLen - 3) + '...]' : s;
  }
  if (v.t === 'set') {
    const parts = v.v.slice(0, items).map((x) => formatSnap(x));
    const suffix = v.more || v.v.length > items ? ', ...' : '';
    return '{' + parts.join(', ') + suffix + '}';
  }
  if (v.t === 'dict') {
    const n = Math.max(4, Math.floor(items * 0.7));
    const parts = v.v.slice(0, n).map(([k, val]) => formatSnap(k) + ': ' + formatSnap(val));
    const suffix = v.more || v.v.length > n ? ', ...' : '';
    return '{' + parts.join(', ') + suffix + '}';
  }
  if (v.t === 'str') return v.v;
  return '?';
}

export function shortSnap(v: Snap | null | undefined): string {
  const s = formatSnap(v);
  return s.length > 24 ? s.slice(0, 21) + '...' : s;
}

export interface ChangedVar { name: string; value: string }

export function changedVars(prev: Record<string, Snap> | undefined, cur: Record<string, Snap> | undefined): ChangedVar[] {
  if (!cur) return [];
  const out: ChangedVar[] = [];
  for (const [k, v] of Object.entries(cur)) {
    if (prev === undefined || JSON.stringify(prev[k]) !== JSON.stringify(v)) {
      out.push({ name: k, value: formatSnap(v) });
    }
  }
  return out;
}

export interface Annotations {
  tree: Map<number, { value: string; returnedValue?: string; current: boolean }>;
  graph: Map<number, { current: boolean; visited: boolean; labels: Map<string, string> }>;
  callCurrent: number | null;
  callStack: { call: number; fn: string; args: string; returned?: string }[];
}

function collectNodeIds(v: Snap, out: Set<number>): void {
  if (v === null || typeof v !== 'object' || !('t' in v)) return;
  if (v.t === 'node') { out.add(v.id); return; }
  if (v.t === 'list' || v.t === 'set') { for (const x of v.v) collectNodeIds(x, out); return; }
  if (v.t === 'dict') { for (const p of v.v) { collectNodeIds(p[0], out); collectNodeIds(p[1], out); } }
}

function argSummary(locals: Record<string, Snap>, names?: string[]): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(locals)) {
    if (k === 'self' || k === 'cls') continue;
    if (names && !names.includes(k)) continue;
    parts.push(k + '=' + shortSnap(v));
    if (parts.length >= 3) break;
  }
  return parts.join(', ');
}

export function deriveAnnotations(
  kind: Kind,
  step: Step | null,
  steps: Step[],
  stepIndex: number,
  structure: VizData['structure'],
): Annotations {
  const tree = new Map<number, { value: string; returnedValue?: string; current: boolean }>();
  const graph = new Map<number, { current: boolean; visited: boolean; labels: Map<string, string> }>();
  const callStack: { call: number; fn: string; args: string; returned?: string }[] = [];
  let callCurrent: number | null = null;

  if (kind === 'tree' && structure.tree) {
    for (const n of structure.tree.nodes) tree.set(n.id, { value: formatSnap(n.val), current: false });
    const limit = Math.min(stepIndex, steps.length - 1);
    for (let i = 0; i <= limit; i++) {
      const s = steps[i];
      if (s.ev === 'return') {
        const ids = new Set<number>();
        for (const v of Object.values(s.locals)) collectNodeIds(v, ids);
        for (const id of ids) {
          const entry = tree.get(id);
          if (entry) entry.returnedValue = formatSnap(s.ret);
        }
      }
    }
    if (step) {
      const ids = new Set<number>();
      for (const v of Object.values(step.locals)) collectNodeIds(v, ids);
      for (const id of ids) {
        const entry = tree.get(id);
        if (entry) entry.current = true;
      }
    }
  }

  if (kind === 'graph' && structure.graph) {
    const n = structure.graph.n;
    for (let i = 0; i < n; i++) graph.set(i, { current: false, visited: false, labels: new Map() });
    if (step) {
      const VERTEX_NAMES = new Set(['u', 'v', 'w', 'x', 'i', 'j', 'node', 'cur', 'curr', 'current', 'vertex', 'start', 'src', 'source', 'nxt', 'nbr', 'child', 'neighbor']);
      for (const [name, v] of Object.entries(step.locals)) {
        const lower = name.toLowerCase();
        if (v && typeof v === 'object' && 't' in v && v.t === 'list' && v.v.length === n) {
          const label = lower.replace(/^_+/, '');
          if (!['graph', 'adj', 'edges'].includes(label)) {
            for (let i = 0; i < n; i++) {
              const entry = graph.get(i);
              if (!entry) continue;
              const val = v.v[i];
              const text = formatSnap(val);
              entry.labels.set(label, text);
              if (lower.includes('visit') || lower.includes('seen')) {
                if (val === true || text === 'True' || text === '1') entry.visited = true;
              }
            }
          }
        }
        if (VERTEX_NAMES.has(lower) && typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < n) {
          const entry = graph.get(v);
          if (entry) entry.current = true;
        }
      }
    }
  }

  if (kind === 'calls') {
    const calls = new Map<number, { fn: string; args: string; parent: number | null; returned?: string }>();
    const limit = Math.min(stepIndex, steps.length - 1);
    for (let i = 0; i <= limit; i++) {
      const s = steps[i];
      if (s.ev === 'call' && !calls.has(s.call)) {
        calls.set(s.call, { fn: s.fn, args: argSummary(s.locals, s.ar), parent: s.parent });
      } else if (s.ev === 'return' && calls.has(s.call)) {
        const c = calls.get(s.call)!;
        c.returned = formatSnap(s.ret);
      }
    }
    callCurrent = step ? step.call : null;
    let cursor: number | null = callCurrent;
    const seen = new Set<number>();
    while (cursor !== null && !seen.has(cursor)) {
      seen.add(cursor);
      const c = calls.get(cursor);
      if (!c) break;
      callStack.push({ call: cursor, fn: c.fn, args: c.args, returned: c.returned });
      cursor = c.parent;
    }
    callStack.reverse();
  }

  return { tree, graph, callCurrent, callStack };
}

// ---------------------------------------------------------------------------------------------
// Describing change: "state[2]: 0 → 1" instead of two long lists the reader has to compare.
// ---------------------------------------------------------------------------------------------
function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isList(v: Snap | null | undefined): v is { t: 'list'; v: Snap[]; more?: number } {
  return typeof v === 'object' && v !== null && 't' in v && v.t === 'list';
}
function isDict(v: Snap | null | undefined): v is { t: 'dict'; v: [Snap, Snap][]; more?: number } {
  return typeof v === 'object' && v !== null && 't' in v && v.t === 'dict';
}
function isSet(v: Snap | null | undefined): v is { t: 'set'; v: Snap[]; more?: number } {
  return typeof v === 'object' && v !== null && 't' in v && v.t === 'set';
}

/** Short, human description of how a value changed. Null when nothing changed. */
export function describeChange(prev: Snap | null | undefined, cur: Snap | null | undefined): string | null {
  if (same(prev, cur)) return null;
  const a = prev === undefined ? null : prev;
  if (isList(a) && isList(cur)) {
    if (a.v.length === cur.v.length) {
      const diffs: string[] = [];
      for (let i = 0; i < cur.v.length; i++) {
        if (!same(a.v[i], cur.v[i])) diffs.push('[' + i + ']: ' + formatSnap(a.v[i]) + ' \u2192 ' + formatSnap(cur.v[i]));
      }
      if (diffs.length > 0 && diffs.length <= 3) return diffs.join(', ');
      if (diffs.length > 3) return diffs.length + ' items changed';
    } else if (cur.v.length > a.v.length && same(a.v, cur.v.slice(0, a.v.length))) {
      const added = cur.v.slice(a.v.length).map((x) => formatSnap(x));
      return 'added ' + added.slice(0, 3).join(', ') + (added.length > 3 ? ', ...' : '');
    } else if (cur.v.length < a.v.length && same(cur.v, a.v.slice(0, cur.v.length))) {
      const gone = a.v.slice(cur.v.length).map((x) => formatSnap(x));
      return 'removed ' + gone.slice(0, 3).join(', ') + (gone.length > 3 ? ', ...' : '');
    }
  }
  if (isDict(a) && isDict(cur)) {
    const parts: string[] = [];
    const old = new Map(a.v.map(([k, v]) => [JSON.stringify(k), v] as const));
    for (const [k, v] of cur.v) {
      const key = JSON.stringify(k);
      if (!old.has(key)) parts.push('added ' + formatSnap(k) + ': ' + formatSnap(v));
      else if (!same(old.get(key), v)) parts.push(formatSnap(k) + ': ' + formatSnap(old.get(key)) + ' \u2192 ' + formatSnap(v));
    }
    if (parts.length > 0 && parts.length <= 3) return parts.join(', ');
  }
  if (isSet(a) && isSet(cur)) {
    const old = new Set(a.v.map((x) => JSON.stringify(x)));
    const now = new Set(cur.v.map((x) => JSON.stringify(x)));
    const added = cur.v.filter((x) => !old.has(JSON.stringify(x))).map((x) => formatSnap(x));
    const gone = a.v.filter((x) => !now.has(JSON.stringify(x))).map((x) => formatSnap(x));
    const parts: string[] = [];
    if (added.length) parts.push('added ' + added.slice(0, 3).join(', '));
    if (gone.length) parts.push('removed ' + gone.slice(0, 3).join(', '));
    if (parts.length) return parts.join('; ');
  }
  if (prev === undefined) return null;
  return 'was ' + formatSnap(prev);
}

/** Variables that differ between two steps, with a description of how they changed. */
export interface VarChange { name: string; text: string; isNew: boolean }

export function changeList(prev: Record<string, Snap> | undefined, cur: Record<string, Snap> | undefined): VarChange[] {
  if (!prev || !cur) return [];
  const out: VarChange[] = [];
  for (const [k, v] of Object.entries(cur)) {
    if (!(k in prev)) { out.push({ name: k, text: formatSnap(v), isNew: true }); continue; }
    const d = describeChange(prev[k], v);
    if (d !== null) out.push({ name: k, text: d.startsWith('was ') ? formatSnap(prev[k]) + ' \u2192 ' + formatSnap(v) : d, isNew: false });
  }
  return out;
}

/** "state[2]: 0 → 1", "total = 5" */
export function formatVarChange(c: VarChange): string {
  if (c.isNew) return c.name + ' = ' + c.text;
  return c.text.startsWith('[') ? c.name + c.text : c.name + ': ' + c.text;
}

// ---------------------------------------------------------------------------------------------
// Step narration. Reads like a paper dry run: what the line is, what the values are, what happened.
// ---------------------------------------------------------------------------------------------
export interface StepContext {
  /** The call that made the current call (second to last on the call stack). */
  caller?: { fn: string; args: string } | null;
  /** The step that follows this one in the same run, used to show what a line will change. */
  next?: Step | null;
}

export type Tone = 'neutral' | 'good' | 'warn' | 'bad';

export interface StepExplanation {
  headline: string;
  detail: string;
  lineText: string;
  lineNo: number;
  /** How a check or loop turned out, as a short label ("True", "False", "next item"...). */
  verdict?: { label: string; tone: Tone };
  /** Extra lines: what the line is about to change, loop variable values... */
  notes: string[];
  /** e.g. "5 repeated setup steps skipped (lines 3-4)" */
  skipped?: string;
}

/** "7 repeated setup steps skipped (lines 3-4)". Undefined when nothing was skipped. */
export function skipText(step: Step | null): string | undefined {
  const sk = step?.sk;
  if (!sk || sk.n <= 0) return undefined;
  const lines = sk.a === sk.b ? 'line ' + sk.a : 'lines ' + sk.a + '\u2013' + sk.b;
  return sk.n + ' repeated setup step' + (sk.n === 1 ? '' : 's') + ' skipped (' + lines + ')';
}

function callerText(c: StepContext['caller']): string {
  return c ? c.fn + '(' + c.args + ')' : '';
}

function loopVars(iv: Record<string, Snap> | undefined): string {
  if (!iv) return '';
  return Object.entries(iv).map(([k, v]) => k + ' = ' + formatSnap(v)).join(', ');
}

function effectNote(step: Step, next: Step | null | undefined): string | null {
  if (!next || next.call !== step.call || next.sk) return null;
  const ch = changeList(step.locals, next.locals);
  if (ch.length === 0) return 'This line changes none of the variables shown.';
  return 'After this line: ' + ch.slice(0, 3).map(formatVarChange).join('; ');
}

export function explainStep(step: Step | null, prev: Step | null, code: string, ctx: StepContext = {}): StepExplanation {
  if (!step) return { headline: 'No steps yet.', detail: '', lineText: '', lineNo: 0, notes: [] };
  const lines = code.split('\n');
  const lineText = (lines[step.line - 1] ?? '').trim();
  const base = { lineText, lineNo: step.line, notes: [] as string[], skipped: skipText(step) };
  const x = step.x;
  const args = argSummary(step.locals, step.ar);

  if (step.ev === 'call') {
    const from = step.cl !== undefined
      ? 'Called from line ' + step.cl + (ctx.caller ? ' of ' + callerText(ctx.caller) : '') + '.'
      : 'This is where the test calls your function.';
    return { ...base, headline: 'Calling ' + step.fn + '(' + args + ')', detail: from + ' Call depth ' + (step.depth + 1) + '.' };
  }

  if (step.ev === 'return') {
    const ret = formatSnap(step.ret);
    const notes: string[] = [];
    let detail: string;
    if (x?.k === 'end') detail = 'Reached the end of the function without a return statement, so it gives back None.';
    else if (x?.s !== undefined && x.s !== ret && x.s !== 'None') detail = 'Computed from: return ' + (x.v ?? x.s);
    else detail = 'Hands this value back to the caller.';
    if (ctx.caller) notes.push('Back in ' + callerText(ctx.caller));
    return { ...base, headline: step.fn + '(' + args + ') returns ' + ret, detail, notes };
  }

  if (step.ev === 'exception') {
    const e = explainError(step);
    return { ...base, headline: 'Error: ' + e.title + (e.message ? ' \u2014 ' + e.message : ''), detail: e.plain, notes: e.facts };
  }

  // ----- a normal line -----
  const code1 = x?.s ?? lineText;
  const notes: string[] = [];
  const effect = (): void => { const n = effectNote(step, ctx.next); if (n) notes.push(n); };
  switch (x?.k) {
    case 'if':
    case 'elif': {
      const verdict = x.o === 'T' ? { label: 'True', tone: 'good' as Tone } : x.o === 'F' ? { label: 'False', tone: 'warn' as Tone } : undefined;
      const val = x.v ? x.v + '  \u2192  ' : '';
      const result = x.o === 'T' ? 'True \u2014 enter this block.' : x.o === 'F' ? 'False \u2014 skip this block.' : '';
      return { ...base, headline: (x.k === 'elif' ? 'Else-if check: ' : 'Check: ') + code1, detail: (val + result).trim(), verdict };
    }
    case 'while': {
      const verdict = x.o === 'T' ? { label: 'True', tone: 'good' as Tone } : x.o === 'F' ? { label: 'False', tone: 'warn' as Tone } : undefined;
      const val = x.v ? x.v + '  \u2192  ' : '';
      const result = x.o === 'T' ? 'True \u2014 run the loop body.' : x.o === 'F' ? 'False \u2014 leave the loop.' : '';
      return { ...base, headline: 'Loop check: ' + code1, detail: (val + result).trim(), verdict };
    }
    case 'for': {
      if (x.o === 'N') {
        const vars = loopVars(x.iv);
        return { ...base, headline: 'Loop over ' + code1 + (vars ? ':  ' + vars : ''), detail: 'Takes the next item and runs the loop body.', verdict: { label: 'next item', tone: 'good' } };
      }
      if (x.o === 'D') {
        return { ...base, headline: 'Loop over ' + code1 + ' is finished', detail: 'No items left \u2014 continue after the loop.', verdict: { label: 'done', tone: 'warn' } };
      }
      return { ...base, headline: 'Loop over ' + code1, detail: x.t ? 'Loop variable: ' + x.t : '' };
    }
    case 'assign':
    case 'aug':
      effect();
      return { ...base, headline: 'Run: ' + code1, detail: '', notes };
    case 'expr':
      effect();
      return { ...base, headline: 'Run: ' + code1, detail: '', notes };
    case 'return':
      return { ...base, headline: 'Work out the return value: ' + code1, detail: x.v && x.v !== code1 ? x.v : 'Calls inside it run first, then the function returns.' };
    case 'break':
      return { ...base, headline: 'break', detail: 'Leaves the loop right away.' };
    case 'continue':
      return { ...base, headline: 'continue', detail: 'Skips the rest of this round and jumps to the next one.' };
    case 'pass':
      return { ...base, headline: 'pass', detail: 'Does nothing.' };
    case 'except':
      return { ...base, headline: 'Error caught: ' + lineText.replace(/:$/, ''), detail: 'The except block runs instead of stopping the program.' };
    case 'raise':
      return { ...base, headline: 'Raise an error: ' + lineText, detail: '' };
    default:
      break;
  }
  void prev;
  return { ...base, headline: 'Run line ' + step.line + ': ' + (lineText || '(blank)'), detail: '' };
}

// ---------------------------------------------------------------------------------------------
// Errors: say what happened in plain words, not just "Error: GeneratorExit:".
// ---------------------------------------------------------------------------------------------
export interface ErrorExplanation {
  title: string;
  message: string;
  plain: string;
  facts: string[];
  handled: boolean;
  /** True for interpreter bookkeeping (e.g. GeneratorExit) that is not a real error. */
  internal: boolean;
}

const INTERNAL_ERRORS = new Set(['GeneratorExit', 'StopIteration', 'StopAsyncIteration', 'KeyboardInterrupt']);

const ERROR_HELP: Record<string, string> = {
  IndexError: 'The code asked for a position that does not exist. Valid positions run from 0 to length-1.',
  KeyError: 'The code looked up a key that is not in the dictionary.',
  ZeroDivisionError: 'The code divided (or took a remainder) by zero.',
  RecursionError: 'Calls kept nesting without ever stopping. The base case is missing or is never reached.',
  UnboundLocalError: 'A variable was used before it was given a value.',
  NameError: 'A name was used that does not exist (typo, or defined later).',
  ValueError: 'A function got a value of the right type but with an unacceptable content.',
  AssertionError: 'An assert check failed.',
  OverflowError: 'A number became too large.',
};

export function explainError(step: Step): ErrorExplanation {
  const raw = step.err ?? '';
  const colon = raw.indexOf(':');
  const title = step.et ?? (colon >= 0 ? raw.slice(0, colon) : raw) ?? 'Error';
  const message = (step.em ?? (colon >= 0 ? raw.slice(colon + 1) : '')).trim();
  let plain = ERROR_HELP[title] ?? 'The program stopped because of an unexpected problem.';
  if (title === 'AttributeError' && message.includes('NoneType')) {
    plain = 'The code read something from a value that is None (for example node.left when node is None). A None check or base case is missing.';
  } else if (title === 'AttributeError') {
    plain = 'The object has no attribute with that name.';
  } else if (title === 'TypeError' && message.includes('NoneType')) {
    plain = 'A value that is None was used like a real value (indexed, called, or used in math).';
  } else if (title === 'TypeError') {
    plain = 'An operation was used on values of the wrong type.';
  }
  return {
    title: title || 'Error',
    message,
    plain,
    facts: step.facts ?? [],
    handled: step.h === true,
    internal: INTERNAL_ERRORS.has(title),
  };
}

export function summarizeRun(outcome: 'ok' | 'crash' | 'limit', result: Snap | null, error?: string, truncated?: boolean): string {
  if (outcome === 'crash') return 'crashed: ' + (error ?? 'error');
  if (outcome === 'limit') return 'did not finish (step limit)';
  if (truncated) return 'returned ' + formatSnap(result) + ' (first steps shown)';
  return 'returned ' + formatSnap(result);
}
