export interface ArrayData {
  kind: 'array';
  values: (number | string)[];
  labels?: string[];
}

export interface TableData {
  kind: 'table';
  rows: (string | number)[][];
  rowLabels?: string[];
  colLabels?: string[];
}

export interface GraphNode {
  id: number;
  label?: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

export interface GraphData {
  kind: 'graph';
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed?: boolean;
}

export interface TreeNode {
  id: number;
  label: string;
  left?: number;
  right?: number;
}

export interface TreeData {
  kind: 'tree';
  nodes: TreeNode[];
  root: number;
}

export type VizData = ArrayData | TableData | GraphData | TreeData;

export type HighlightColor = 'ok' | 'warn' | 'bad' | 'active';

export interface Highlight {
  index: number;
  color: HighlightColor;
}

export type VarValue = string | number | boolean;

export interface Frame {
  step: number;
  description: string;
  activeLine?: number;
  data: VizData;
  highlights?: Highlight[];
  vars?: Record<string, VarValue>;
  done?: boolean;
}

export type StepGenerator<I> = (input: I) => Frame[];

export interface VizDefinition<I = unknown> {
  id: string;
  title: string;
  description: string;
  generator: StepGenerator<I>;
  defaultInput: I;
  /** Human-readable label for the input, e.g. "array = [3, 7, 1, 9]" */
  describeInput: (input: I) => string;
  /** Reference implementation, used by tests to verify the generator's final result */
  reference: (input: I) => unknown;
}
