// Shared types for the v4 execution visualizer.
export type Snap =
  | null
  | boolean
  | number
  | string
  | { t: 'list' | 'set'; v: Snap[]; more?: number }
  | { t: 'dict'; v: [Snap, Snap][]; more?: number }
  | { t: 'node'; id: number; val: Snap }
  | { t: 'str'; v: string };

/**
 * What a line is, written the way you would write it on paper.
 * k: statement kind. s: the statement/condition with variable names replaced by their current values.
 * v: the same with indexes/attributes evaluated too. t: loop variable(s) of a `for`.
 * o: how a check/loop turned out (T/F = condition true/false, N/D = next item/loop done).
 * iv: the loop variable values for the item just taken.
 */
export interface StepInfo {
  k: string;
  s?: string;
  v?: string;
  t?: string;
  o?: 'T' | 'F' | 'N' | 'D';
  iv?: Record<string, Snap>;
}

export interface Step {
  i: number;
  ev: 'call' | 'line' | 'return' | 'exception';
  call: number;
  parent: number | null;
  depth: number;
  fn: string;
  line: number;
  locals: Record<string, Snap>;
  ret?: Snap;
  err?: string;
  /** Statement description for this step (see StepInfo). */
  x?: StepInfo;
  /** Setup steps skipped just before this step: how many, and the line range they came from. */
  sk?: { n: number; a: number; b: number };
  /** Names of the function's own parameters (call/return steps), so closure variables are not shown as arguments. */
  ar?: string[];
  /** For a call step: the line of the caller that made the call. */
  cl?: number;
  /** Exception type and message (exception steps only). */
  et?: string;
  em?: string;
  /** Concrete reasons read from live values, e.g. "index 7 is out of range: `a` has 4 items". */
  facts?: string[];
  /** True when the program survives this exception (try/except). */
  h?: boolean;
}

export interface Run {
  outcome: 'ok' | 'crash' | 'limit';
  result: Snap | null;
  error?: string;
  steps: Step[];
  /** True when only the first part of a longer run is stored. */
  truncated?: boolean;
}

export type Kind = 'tree' | 'graph' | 'calls';

export interface TreeNode {
  id: number;
  val: Snap;
  left: number | null;
  right: number | null;
}

export interface TreeStructure {
  root: number | null;
  nodes: TreeNode[];
}

export interface GraphStructure {
  directed: boolean;
  n: number;
  edges: [number, number][] | [number, number, number][];
}

export interface Divergence {
  correctStep: number;
  buggyStep: number;
  reason: string;
  /** Line of the buggy run that ran just before the runs started to differ. */
  causeLine?: number;
}

export interface VizData {
  version: 4;
  problemId: string;
  sourceHash: string;
  kind: Kind;
  structure: { tree?: TreeStructure; graph?: GraphStructure };
  code: { correct: string; buggy: string };
  buggyLines: number[];
  correct: Run;
  buggy: Run;
  divergence: Divergence | null;
}
