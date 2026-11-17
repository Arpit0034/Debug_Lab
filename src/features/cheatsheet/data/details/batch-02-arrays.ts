import type { ConceptDetail } from '../../types';

export const arraysDetail: ConceptDetail = {
  id: 'arrays',
  overview: {
    essence: 'Contiguous memory, O(1) access by index, O(n) insert/delete. Foundation for everything else.',
    what: 'A contiguous block of same-type elements accessed by an integer index. Offset from a base address gives O(1) access.',
    problemSolved: 'Random access in constant time. Sequential access with excellent cache locality.',
    whyImportant:
      'Almost every other structure builds on it (dynamic arrays, hash maps, heaps, matrices). Complexity of array operations is the reference point for comparing everything else.',
    usedIn: [
      'Sorting and searching',
      'Sliding window / two pointers',
      'Prefix sums and difference arrays',
      'DP tables and matrix operations',
      'Any problem that says "subarray" or "in-place"',
    ],
  },
  intuition: {
    explanation:
      'Index i addresses the element at base + i × elementSize. Because every element is the same size and they sit back-to-back, the address is computable without traversal — hence O(1). Inserting or deleting in the middle forces every later element to shift — hence O(n).',
    analogy:
      'Numbered houses on one street. To visit house 42, you walk straight to #42 — you do not knock on every door. But to put a new house between #10 and #11, every house after it must move over.',
  },
  internals: [
    { title: 'Contiguous memory', body: 'Elements sit back-to-back in one block. No per-element pointer overhead.' },
    { title: 'Fixed element size', body: 'All elements are the same type (usually), so index → address is a multiplication.' },
    { title: 'O(1) access', body: 'address(i) = base + i × sizeof(elem). No traversal.' },
    { title: 'O(n) insert/delete in middle', body: 'Every element after the insertion/deletion point must shift one slot.' },
    { title: 'Amortized O(1) append', body: 'Dynamic arrays (list, ArrayList, vector) double capacity on overflow; the doubling makes n appends O(n) total.' },
  ],
  visual: {
    diagram:
      '  [ 10 | 20 | 30 | 40 | 50 ]\n' +
      '    0    1    2    3    4\n' +
      '    ^                    ^\n' +
      '   a[0]                 a[4]\n' +
      '\n' +
      '  access:  a[i]        O(1)\n' +
      '  insert:  in middle   O(n)  (shift right)\n' +
      '  delete:  in middle   O(n)  (shift left)\n' +
      '  append:  at end      amortized O(1)',
    caption: 'Contiguous layout. Index access is arithmetic; insert/delete shifts.',
  },
  approach: {
    summary: 'Use indexing for O(1) access. Iterate with a pointer. For in-place transformations, use a two-pointer (left/right) pattern.',
    steps: [
      'Access: a[i] — O(1).',
      'Traversal: for i in range(len(a)) — O(n).',
      'Append at end: dynamic arrays only — amortized O(1).',
      'Insert/delete in middle: shift O(n) elements.',
      'Reverse in place: swap a[i] and a[n-1-i] while i < n/2 — O(n) time, O(1) space.',
    ],
    template: {
      code: 'for i in range(len(a)):\n    # use a[i]',
      notes: ['Half-open index convention: [0, n) — last valid index is n - 1.'],
    },
  },
  code: {
    python: {
      code:
        'def reverse_in_place(a):\n' +
        '    left, right = 0, len(a) - 1\n' +
        '    while left < right:\n' +
        '        a[left], a[right] = a[right], a[left]\n' +
        '        left += 1\n' +
        '        right -= 1\n' +
        '\n' +
        'a = [10, 20, 30, 40]\n' +
        'x = a[2]              # O(1) access → 30\n' +
        'a.append(50)          # amortized O(1) at end\n' +
        'a.insert(0, 5)        # O(n) — shifts every element right\n' +
        'del a[0]              # O(n) — shifts every element left',
      notes: ['Python list is a dynamic array — contiguous, amortized O(1) append, O(n) insert/delete.'],
    },
    java: {
      code:
        'void reverseInPlace(int[] a) {\n' +
        '    int left = 0, right = a.length - 1;\n' +
        '    while (left < right) {\n' +
        '        int t = a[left];\n' +
        '        a[left] = a[right];\n' +
        '        a[right] = t;\n' +
        '        left++;\n' +
        '        right--;\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        'int[] a = {10, 20, 30, 40};\n' +
        'int x = a[2];                 // O(1) access\n' +
        '// Fixed arrays cannot append. Use ArrayList for dynamic behavior.\n' +
        'java.util.List<Integer> list = new java.util.ArrayList<>();\n' +
        'list.add(50);                 // amortized O(1) at end\n' +
        'list.add(0, 5);               // O(n) — shifts right\n' +
        'list.remove(0);               // O(n) — shifts left',
      notes: ['int[] is fixed size. ArrayList is the dynamic variant.'],
    },
    cpp: {
      code:
        'void reverse_in_place(std::vector<int>& a) {\n' +
        '    int left = 0, right = (int)a.size() - 1;\n' +
        '    while (left < right) {\n' +
        '        std::swap(a[left], a[right]);\n' +
        '        left++;\n' +
        '        right--;\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        'std::vector<int> a = {10, 20, 30, 40};\n' +
        'int x = a[2];                   // O(1) access\n' +
        'a.push_back(50);                // amortized O(1) at end\n' +
        'a.insert(a.begin(), 5);         // O(n) — shifts right\n' +
        'a.erase(a.begin());             // O(n) — shifts left',
      notes: ['vector is the dynamic array. std::array<int, N> is fixed size.'],
    },
  },
  languageNotes: [
    'Python list is a dynamic array — no fixed-size primitive for ints.',
    'Java int[] is fixed; ArrayList<Integer> is dynamic but boxes primitives.',
    'C++ std::vector is dynamic; std::array<T,N> is fixed (C++11).',
    'All three (list, ArrayList, vector) allocate geometrically — n appends is O(n) total.',
  ],
  complexity: {
    best: 'O(1) access',
    average: 'O(1) access, O(n) insert/delete in middle',
    worst: 'O(n) insert/delete in middle',
    auxiliary: 'O(1)',
    total: 'Operation-dependent: access O(1), middle insert/delete O(n)',
    why: [
      { label: 'Access is O(1)', reason: 'Address is arithmetic — base + i × sizeof(elem). No traversal.' },
      { label: 'Middle insert/delete is O(n)', reason: 'Every element after the operation must shift one slot to open or close a gap.' },
      { label: 'Append is amortized O(1)', reason: 'Dynamic arrays double capacity on overflow. Each element is copied at most log(n) times, so n appends total O(n).' },
      { label: 'Auxiliary O(1)', reason: 'In-place operations use only a handful of local variables (left, right, temp).' },
    ],
  },
  dryRun: {
    input: 'arr = [10, 25, 8, 42, 17]',
    initialState: 'max = -∞, i = 0',
    steps: [
      { step: '1', state: 'i=0, arr[0]=10 → max=10', note: 'First element becomes max.' },
      { step: '2', state: 'i=1, arr[1]=25 > 10 → max=25', note: 'New max.' },
      { step: '3', state: 'i=2, arr[2]=8 < 25 → max stays 25', note: 'Not larger.' },
      { step: '4', state: 'i=3, arr[3]=42 > 25 → max=42', note: 'New max.' },
      { step: '5', state: 'i=4, arr[4]=17 < 42 → max stays 42', note: 'Not larger.' },
    ],
    output: '42',
  },
  whenToUse: [
    'You need O(1) random access by index.',
    'You iterate mostly sequentially (cache-friendly).',
    'You know the size up front, or can accept amortized O(1) append.',
    'You need in-place modification with O(1) extra space.',
    'The problem says "subarray", "contiguous", or "in-place".',
  ],
  whenNotToUse: [
    'Insert/delete in the middle dominates — linked list or balanced tree.',
    'You need frequent "have I seen this?" — hash map.',
    'You need ordered iteration with insertion — balanced tree.',
  ],
  mistakes: [
    { mistake: 'Using range(len(a)) when you need indices up to len(a) - 1.', fix: 'range(len(a)) is already 0..n-1. The last valid index is len(a) - 1. Watch out for `a[i+1]` inside loops.' },
    { mistake: 'Modifying a list while iterating over it.', fix: 'Collect indices or items first, then mutate. Or iterate from the end when deleting.' },
    { mistake: 'Assuming append is O(1) in the worst case.', fix: 'It is amortized O(1). A single append can be O(n) when capacity must double.' },
    { mistake: 'Treating list.pop(0) as O(1).', fix: 'It shifts every element left — O(n). Use collections.deque for queues.' },
  ],
  interview: {
    questions: [
      'Reverse an array in place (O(1) extra space).',
      'Move zeroes to the end while preserving the order of non-zero elements.',
      'Rotate an array k steps to the right.',
      'Container with most water — two pointers.',
      'Maximum subarray sum — Kadane’s algorithm.',
    ],
    observations: [
      'Contiguous memory → excellent cache locality. Iterating an array is one of the fastest operations in computing.',
      'In-place transformations almost always use two pointers (one from each end).',
      'When a problem says "no extra space", arrays are usually the answer.',
    ],
    optimizations: [
      'Sort + two-pointer often beats a hash map on sorted input (O(n log n) vs O(n), but with better constants and O(1) space).',
      'Prefix sums turn range-sum queries from O(n) to O(1).',
    ],
    followUps: [
      'What if you cannot sort? → hash map for pair-sum.',
      'What if the array is rotated sorted? → modified binary search.',
      'What if the array has duplicates? → sort first, then dedupe.',
    ],
  },
  related: [
    { id: 'binary-search', relation: 'Binary search requires a sorted array' },
  ],
  practice: [
    { title: 'Two Sum', difficulty: 'Easy', why: 'Hash map (O(n)) vs sort+two-pointer (O(n log n)).' },
    { title: 'Move Zeroes', difficulty: 'Easy', why: 'In-place two-pointer with O(1) space.' },
    { title: 'Rotate Array', difficulty: 'Medium', why: 'Reverse-in-place trick — three reversals.' },
    { title: 'Maximum Subarray', difficulty: 'Medium', why: 'Kadane’s — one pass, O(1) space.' },
    { title: 'Container With Most Water', difficulty: 'Medium', why: 'Two-pointer with a comparison-based advance rule.' },
  ],
  revision: {
    takeaways: [
      'O(1) access by index — the address is arithmetic.',
      'O(n) insert/delete in the middle — everything shifts.',
      'Amortized O(1) append — geometric capacity doubling.',
      'In-place operations usually use two pointers.',
    ],
    formulas: [
      'address(i) = base + i × sizeof(element)',
      'Reverse in place: swap a[i] and a[n-1-i] while i < n/2',
    ],
    complexitySummary: 'Access O(1) · insert/delete middle O(n) · append amortized O(1) · space O(n).',
    patterns: ['Random access by index', 'Contiguous subarray', 'In-place modification', 'Two-pointer from ends'],
    memoryTrick: 'Contiguous = constant access. Shift = linear cost. Two ends = in place.',
  },
};
