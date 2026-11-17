export type GrowthFunction = (n: number) => number;

export interface ComplexityClass {
  name: string;
  notation: string;
  example: string;
  when: string;
  growth: GrowthFunction;
}

/**
 * Growth functions use log-space when the value would overflow.
 * For very large n, use logGrowth to compute log10(operations).
 */
export const COMPLEXITY_CLASSES: ComplexityClass[] = [
  { name: 'Constant', notation: 'O(1)', example: 'Array index access, hash map lookup', when: 'Operation takes the same time regardless of input size.', growth: () => 1 },
  { name: 'Logarithmic', notation: 'O(log n)', example: 'Binary search, balanced BST height', when: 'Each step halves the remaining work.', growth: (n) => Math.max(1, Math.log2(Math.max(1, n))) },
  { name: 'Linear', notation: 'O(n)', example: 'Array traversal, counting', when: 'One pass over the input.', growth: (n) => Math.max(1, n) },
  { name: 'Linearithmic', notation: 'O(n log n)', example: 'Merge sort, most comparison sorts', when: 'Sort-then-scan; divide-and-conquer with O(n) merge.', growth: (n) => Math.max(1, n) * Math.max(1, Math.log2(Math.max(1, n))) },
  { name: 'Quadratic', notation: 'O(n²)', example: 'All pairs, nested loops', when: 'Two nested loops over the input, or pairwise comparison.', growth: (n) => Math.max(1, n) * Math.max(1, n) },
  { name: 'Cubic', notation: 'O(n³)', example: 'Triple nested loops, naive matrix multiply', when: 'Three nested loops over the input.', growth: (n) => Math.max(1, n) ** 3 },
  { name: 'Exponential', notation: 'O(2ⁿ)', example: 'Subset enumeration, naive recursive branching', when: 'Each decision doubles the number of branches.', growth: (n) => Math.pow(2, Math.max(1, n)) },
  { name: 'Factorial', notation: 'O(n!)', example: 'Permutation generation by naive recursion', when: 'Each element can appear in any remaining slot.', growth: (n) => factorial(Math.max(1, Math.floor(n))) },
];

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export interface DataStructureOps {
  name: string;
  access: { avg: string; worst: string };
  search: { avg: string; worst: string };
  insert: { avg: string; worst: string };
  delete: { avg: string; worst: string };
}

export const DATA_STRUCTURE_OPS: DataStructureOps[] = [
  { name: 'Array', access: { avg: 'O(1)', worst: 'O(1)' }, search: { avg: 'O(n)', worst: 'O(n)' }, insert: { avg: 'O(n)', worst: 'O(n)' }, delete: { avg: 'O(n)', worst: 'O(n)' } },
  { name: 'Dynamic Array (list / ArrayList / vector)', access: { avg: 'O(1)', worst: 'O(1)' }, search: { avg: 'O(n)', worst: 'O(n)' }, insert: { avg: 'O(1)*', worst: 'O(n)' }, delete: { avg: 'O(n)', worst: 'O(n)' } },
  { name: 'Linked List', access: { avg: 'O(n)', worst: 'O(n)' }, search: { avg: 'O(n)', worst: 'O(n)' }, insert: { avg: 'O(1)', worst: 'O(1)' }, delete: { avg: 'O(1)', worst: 'O(1)' } },
  { name: 'Hash Map', access: { avg: 'O(1)', worst: 'O(n)' }, search: { avg: 'O(1)', worst: 'O(n)' }, insert: { avg: 'O(1)', worst: 'O(n)' }, delete: { avg: 'O(1)', worst: 'O(n)' } },
  { name: 'Stack', access: { avg: 'O(n)', worst: 'O(n)' }, search: { avg: 'O(n)', worst: 'O(n)' }, insert: { avg: 'O(1)', worst: 'O(1)' }, delete: { avg: 'O(1)', worst: 'O(1)' } },
  { name: 'Queue', access: { avg: 'O(n)', worst: 'O(n)' }, search: { avg: 'O(n)', worst: 'O(n)' }, insert: { avg: 'O(1)', worst: 'O(1)' }, delete: { avg: 'O(1)', worst: 'O(1)' } },
  { name: 'Heap / Priority Queue', access: { avg: 'O(1) peek', worst: 'O(1) peek' }, search: { avg: 'O(n)', worst: 'O(n)' }, insert: { avg: 'O(log n)', worst: 'O(log n)' }, delete: { avg: 'O(log n)', worst: 'O(log n)' } },
  { name: 'BST (balanced)', access: { avg: 'O(log n)', worst: 'O(n)' }, search: { avg: 'O(log n)', worst: 'O(n)' }, insert: { avg: 'O(log n)', worst: 'O(n)' }, delete: { avg: 'O(log n)', worst: 'O(n)' } },
  { name: 'AVL Tree', access: { avg: 'O(log n)', worst: 'O(log n)' }, search: { avg: 'O(log n)', worst: 'O(log n)' }, insert: { avg: 'O(log n)', worst: 'O(log n)' }, delete: { avg: 'O(log n)', worst: 'O(log n)' } },
  { name: 'Trie', access: { avg: 'O(k)', worst: 'O(k)' }, search: { avg: 'O(k)', worst: 'O(k)' }, insert: { avg: 'O(k)', worst: 'O(k)' }, delete: { avg: 'O(k)', worst: 'O(k)' } },
  { name: 'Union-Find (DSU)', access: { avg: '—', worst: '—' }, search: { avg: 'O(α(n))', worst: 'O(α(n))' }, insert: { avg: 'O(α(n))', worst: 'O(α(n))' }, delete: { avg: '—', worst: '—' } },
  { name: 'Segment Tree', access: { avg: 'O(log n)', worst: 'O(log n)' }, search: { avg: 'O(log n)', worst: 'O(log n)' }, insert: { avg: 'O(log n)', worst: 'O(log n)' }, delete: { avg: '—', worst: '—' } },
  { name: 'Fenwick Tree (BIT)', access: { avg: 'O(log n)', worst: 'O(log n)' }, search: { avg: 'O(log n)', worst: 'O(log n)' }, insert: { avg: 'O(log n)', worst: 'O(log n)' }, delete: { avg: '—', worst: '—' } },
];

export const CALCULATOR_DEFAULTS = {
  opsPerSecond: 1e8,
  timeLimitSec: 1,
  assumedMaxInput: 100000,
};
