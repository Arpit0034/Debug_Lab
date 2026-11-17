export interface PatternSignal {
  id: string;
  signal: string;
  technique: string;
  conceptId: string;
}

export const PATTERN_SIGNALS: PatternSignal[] = [
  { id: 'sorted-pair', signal: 'Sorted array + find a pair summing to target', technique: 'Two pointers', conceptId: 'two-pointers' },
  { id: 'sorted-search', signal: 'Sorted array + find target / first occurrence', technique: 'Binary search', conceptId: 'binary-search' },
  { id: 'monotonic-minmax', signal: 'Minimum X such that feasible(X) is monotonic', technique: 'Binary search on the answer', conceptId: 'binary-search' },
  { id: 'subarray-sum', signal: 'Contiguous subarray with a sum constraint', technique: 'Sliding window or prefix sum', conceptId: 'sliding-window' },
  { id: 'seen-before', signal: 'Deduplication / "have I seen this"', technique: 'Hash map / hash set', conceptId: 'hash-maps' },
  { id: 'next-greater', signal: 'For each element, find the next greater/smaller', technique: 'Monotonic stack', conceptId: 'stacks-queues' },
  { id: 'balanced-parens', signal: 'Matching pairs of brackets / nested structure', technique: 'Stack', conceptId: 'stacks-queues' },
  { id: 'bfs-shortest', signal: 'Shortest path, unweighted graph', technique: 'BFS', conceptId: 'graph-bfs' },
  { id: 'dfs-connectivity', signal: 'Connectivity, cycle detection, topological order', technique: 'DFS', conceptId: 'graph-dfs' },
  { id: 'count-ways', signal: '"Count the number of ways to…"', technique: 'Dynamic programming', conceptId: 'dynamic-programming' },
  { id: 'all-combos', signal: '"Generate all combinations / permutations / subsets"', technique: 'Backtracking', conceptId: 'backtracking' },
  { id: 'kth-largest', signal: 'K-th largest / smallest element', technique: 'Heap or quickselect', conceptId: 'sorting' },
  { id: 'dictionary-prefix', signal: 'Autocomplete / prefix lookup', technique: 'Trie', conceptId: 'trees' },
  { id: 'components', signal: 'Group elements / connected components', technique: 'Union-find', conceptId: 'graphs' },
  { id: 'tree-structural', signal: 'Tree height / diameter / LCA / balance', technique: 'Post-order recursion', conceptId: 'trees' },
  { id: 'interval-merge', signal: 'Overlapping intervals / scheduling', technique: 'Sort + merge intervals', conceptId: 'sorting' },
];

export interface BugPattern {
  id: string;
  name: string;
  symptom: string;
  relatedConceptIds: string[];
}

export const TOP_BUG_PATTERNS: BugPattern[] = [
  { id: 'off-by-one', name: 'Off-by-one at boundaries', symptom: 'Correct for interior elements, wrong on first or last', relatedConceptIds: ['arrays', 'binary-search'] },
  { id: 'missing-visited', name: 'Missing visited set', symptom: 'DFS/BFS loops forever or revisits nodes', relatedConceptIds: ['graph-dfs', 'graph-bfs'] },
  { id: 'no-undo', name: 'State not undone in backtracking', symptom: 'First solution correct, subsequent ones wrong', relatedConceptIds: ['backtracking'] },
  { id: 'wrong-base-case', name: 'Wrong recursion base case', symptom: 'Off by a constant at every level (e.g., height is n+1)', relatedConceptIds: ['recursion', 'trees'] },
  { id: 'mutate-while-iterating', name: 'Mutating while iterating', symptom: 'Skipped elements or invalid index exceptions', relatedConceptIds: ['arrays', 'linked-lists'] },
  { id: 'integer-overflow', name: 'Integer overflow', symptom: 'Works for small inputs, fails at scale (mid = (lo+hi)/2)', relatedConceptIds: ['binary-search'] },
  { id: 'wrong-comparison', name: 'Wrong comparison direction', symptom: 'Two-pointer goes the wrong way, binary search fails', relatedConceptIds: ['two-pointers', 'binary-search'] },
  { id: 'not-shrink-window', name: 'Sliding window not shrinking', symptom: 'Window grows forever or returns wrong length', relatedConceptIds: ['sliding-window'] },
  { id: 'bst-inequality', name: 'BST inequality is strict', symptom: 'Duplicates break invariant or all values go one side', relatedConceptIds: ['trees'] },
  { id: 'base-case-missing', name: 'Missing base case', symptom: 'Infinite recursion / stack overflow', relatedConceptIds: ['recursion'] },
  { id: 'slice-copy', name: 'Array slice creates a copy', symptom: 'Modifications inside recursion don\'t persist to caller', relatedConceptIds: ['arrays', 'recursion'] },
  { id: 'pointer-lost', name: 'Losing the head pointer', symptom: 'Returned list starts from a later node', relatedConceptIds: ['linked-lists'] },
  { id: 'visited-stale', name: 'Visited set is stale across searches', symptom: 'Later components incorrectly marked visited', relatedConceptIds: ['graph-dfs', 'graph-bfs'] },
  { id: 'nondeterministic-order', name: 'Relies on undefined iteration order', symptom: 'Passes on one machine, fails on another', relatedConceptIds: ['hash-maps'] },
  { id: 'empty-edge', name: 'Unhandled empty input', symptom: 'IndexError / nullptr on empty array or null root', relatedConceptIds: ['arrays', 'trees'] },
];
