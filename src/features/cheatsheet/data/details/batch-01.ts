import type { ConceptDetail } from '../../types';

export const binarySearchDetail: ConceptDetail = {
  id: 'binary-search',
  overview: {
    essence: 'Halve the search space on each comparison. Needs sorted input or a monotonic predicate.',
    what: 'Find a target in a sorted array by repeatedly comparing the middle element and discarding the half that cannot contain the target.',
    problemSolved: 'Linear scan is O(n); binary search reduces it to O(log n) by exploiting sorted order.',
    whyImportant: 'log₂(n) comparisons is the floor for comparison-based search. Every "minimum X such that feasible(X) is monotonic" problem reduces to binary search.',
    usedIn: [
      'Searching sorted arrays',
      'Finding first / last occurrence (lower / upper bound)',
      'Binary search on the answer (minimize maximum)',
      'Any monotonic predicate',
    ],
  },
  intuition: {
    explanation: 'Each comparison eliminates half the remaining candidates. Sorted order guarantees: if arr[mid] < target, the target is strictly right of mid.',
    analogy: 'Dictionary lookup: open the middle, decide which half contains your word, repeat. You never scan page 1, 2, 3 sequentially.',
  },
  internals: [
    { title: 'Maintain a shrinking range', body: 'lo and hi bound the candidates. Start with lo=0, hi=n-1.' },
    { title: 'Compare mid', body: 'Compute mid = lo + (hi - lo) // 2. Compare arr[mid] to target.' },
    { title: 'Discard one half', body: 'If arr[mid] < target, lo = mid + 1. If greater, hi = mid - 1. If equal, return mid.' },
    { title: 'Terminate', body: 'Loop ends when lo > hi. Return -1 (not found).' },
  ],
  visual: {
    vizId: 'binary-search',
    caption: 'Step through each comparison. Watch the highlighted range shrink by half.',
  },
  approach: {
    summary: 'Narrow a sorted range by halving on each comparison until the target is found or the range is empty.',
    steps: [
      'lo = 0, hi = n - 1',
      'While lo ≤ hi: compute mid = lo + (hi - lo) // 2',
      'If arr[mid] == target, return mid',
      'If arr[mid] < target, lo = mid + 1',
      'Else hi = mid - 1',
      'Return -1',
    ],
    template: {
      code: 'lo, hi = 0, len(a) - 1\nwhile lo <= hi:\n    mid = lo + (hi - lo) // 2\n    if a[mid] == target: return mid\n    if a[mid] < target: lo = mid + 1\n    else: hi = mid - 1\nreturn -1',
    },
  },
  code: {
    python: {
      code: 'def binary_search(a, target):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = lo + (hi - lo) // 2\n        if a[mid] == target:\n            return mid\n        if a[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1',
      notes: ['Python integers are arbitrary precision, so `lo + hi` never overflows — but the pattern is worth keeping consistent across languages.'],
    },
    java: {
      code: 'int binarySearch(int[] a, int target) {\n    int lo = 0, hi = a.length - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}',
      notes: ['Use `lo + (hi - lo) / 2` instead of `(lo + hi) / 2` to avoid overflow when lo + hi exceeds Integer.MAX_VALUE.'],
    },
    cpp: {
      code: 'int binarySearch(const std::vector<int>& a, int target) {\n    int lo = 0, hi = (int)a.size() - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}',
      notes: ['Use std::lower_bound / std::upper_bound for boundary variants.'],
    },
  },
  languageNotes: [
    'Python: bisect.bisect_left / bisect_right give the boundary variants.',
    'Java: Arrays.binarySearch returns a negative insertion point on miss.',
    'C++: std::lower_bound finds the first element ≥ target in O(log n).',
  ],
  complexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    auxiliary: 'O(1)',
    total: 'O(log n)',
    why: [
      { label: 'Halving', reason: 'Each comparison eliminates half the remaining candidates → at most log₂(n) comparisons.' },
      { label: 'Best case', reason: 'If the target is the first mid tried, only one comparison runs.' },
      { label: 'Auxiliary', reason: 'Only lo, hi, mid — constant extra space.' },
    ],
  },
  dryRun: {
    input: 'arr = [1, 3, 5, 7, 9, 11, 13], target = 7',
    initialState: 'lo = 0, hi = 6',
    steps: [
      { step: '1', state: 'lo=0, hi=6, mid=3 → arr[3]=7', note: '7 == target, return 3.' },
    ],
    output: '3',
  },
  whenToUse: [
    'Sorted array + find a target, first occurrence, last occurrence, or insert position.',
    'Monotonic predicate — binary search on the answer.',
    'Finding a boundary in a monotonic function.',
  ],
  whenNotToUse: [
    'Unsorted data — sort first (O(n log n)) or use a hash map for O(1) lookup.',
    'Non-monotonic predicate — plain binary search finds *an* answer, not *the* answer.',
  ],
  mistakes: [
    { mistake: 'Using `while lo < hi` when searching for an exact value.', fix: 'Use `while lo <= hi` for exact search; use `<` only for boundary search.' },
    { mistake: 'Computing mid as `(lo + hi) / 2` in fixed-width languages.', fix: 'Use `lo + (hi - lo) / 2` to avoid overflow.' },
    { mistake: 'Forgetting to exclude mid when updating lo or hi.', fix: 'Set `lo = mid + 1` or `hi = mid - 1`. Never `= mid`.' },
  ],
  interview: {
    questions: [
      'Find the first or last occurrence of a target in a sorted array.',
      'Find the minimum in a rotated sorted array.',
      'Binary search on the answer: ship packages within D days.',
      'Koko eating bananas — minimum speed.',
    ],
    observations: [
      'Binary search is fundamentally about *boundaries*, not just "find target".',
      'In answer-search problems, the "answer" is a value, not an array index.',
      'Monotonicity is the precondition — always check it explicitly.',
    ],
    optimizations: [
      'Standard library lower_bound / bisect_left / upper_bound are tuned and faster than hand-rolled.',
      'For "find minimum X such that feasible(X)", binary search on the range of X.',
    ],
    followUps: [
      'With duplicates — use lower_bound / upper_bound for exact boundaries.',
      'Rotated sorted array — modified binary search with a rotation invariant.',
      '2D matrix — flatten mentally or reduce dimension each step.',
    ],
  },
  related: [
    { id: 'arrays', relation: 'Binary search requires sorted arrays' },
    { id: 'sorting', relation: 'Sorting gives you the sorted precondition' },
    { id: 'two-pointers', relation: 'Both shrink the search space per step' },
  ],
  practice: [
    { title: 'Binary Search', difficulty: 'Easy', why: 'The classic template — get the boundaries right.' },
    { title: 'Search Insert Position', difficulty: 'Easy', why: 'Find the first position ≥ target — practice the boundary variant.' },
    { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', why: 'Modified binary search on a non-trivially sorted array.' },
    { title: 'Koko Eating Bananas', difficulty: 'Medium', why: 'Binary search on the answer with a monotonic feasibility check.' },
  ],
  revision: {
    takeaways: [
      'Halve the search space each step.',
      'O(log n) is the floor for comparison-based search.',
      'Binary search on the answer when the answer is a value and the predicate is monotonic.',
    ],
    formulas: [
      'mid = lo + (hi - lo) // 2',
      'result = lo after loop (boundary search)',
    ],
    complexitySummary: 'O(log n) time, O(1) space. Best case O(1) if the target is the first mid.',
    patterns: ['Sorted array', 'Monotonic predicate', 'Boundary search', 'Minimize maximum'],
    memoryTrick: 'Halve the space, don\'t waste it. mid = lo + (hi - lo)/2. Return lo for boundaries.',
  },
};
