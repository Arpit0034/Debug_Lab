import type { ConceptDetail } from '../../types';

export const sortingDetail: ConceptDetail = {
  id: 'sorting',
  overview: {
    essence:
      'Every comparison sort is at least O(n log n). Merge = stable. Quick = in-place. Heap = O(1) worst-case space. Use the built-in unless you have a reason not to.',
    what: 'Rearranging elements by a comparison. Most general-purpose sorts are O(n log n); special cases (counting, radix, bucket) can be faster.',
    problemSolved:
      'Sorted data unlocks binary search, two-pointer pair-sum, greedy on intervals, deduplication, and more. Many problems become trivial once sorted.',
    whyImportant:
      'Sort-then-scan is one of the most common patterns. Understanding which sort to pick, when stability matters, and how custom comparators work is essential.',
    usedIn: [
      'Binary search (needs sorted)',
      'Two-pointer pair sum (needs sorted)',
      'Interval merging',
      'Deduplication',
      'Top-k via heap',
      'Custom ordering (comparators)',
    ],
  },
  intuition: {
    explanation:
      'Comparison-based sorting is a decision tree. There are n! possible permutations. Each comparison gives one bit. So you need at least log₂(n!) ≈ n log n comparisons to distinguish all orderings. This is the lower bound — no comparison sort can beat it. Merge sort achieves it. Quick sort achieves it on average. Heap sort achieves it in the worst case with O(1) space.',
    analogy:
      'Sorting is deduplicating and grouping. Once items are in order, similar items cluster, boundaries are easy to find, and lookups become O(log n).',
  },
  internals: [
    { title: 'Merge sort', body: 'Split array in half, sort each half recursively, merge two sorted halves in O(n). O(n log n) always. Stable. O(n) space.' },
    { title: 'Quick sort', body: 'Pick a pivot, partition into < pivot and > pivot, recurse. O(n log n) average, O(n²) worst case (sorted input + bad pivot). In-place. Not stable.' },
    { title: 'Heap sort', body: 'Build a max-heap, repeatedly extract max. O(n log n) always. In-place (uses array as heap). Not stable. Poor cache locality.' },
    { title: 'Comparison sorts are Ω(n log n)', body: 'Information-theoretic lower bound. No comparison sort can beat it. Counting/radix/bucket are not comparison sorts — they exploit structure.' },
    { title: 'Stability', body: 'Stable = equal elements keep their original relative order. Matters when sorting objects by one key while preserving another.' },
    { title: 'Custom comparators', body: 'Sort by any rule: by tuple, by length, by negative value, by "concatenation order". The comparator must be consistent (transitive).' },
  ],
  visual: {
    vizId: 'merge-sort',
    caption:
      'Merge sort: split recursively, then merge two sorted halves. Each level of the merge tree touches every element once — log n levels → O(n log n).',
  },
  approach: {
    summary:
      'Use the built-in sort (Timsort in Python/Java, Introsort in C++). Write a custom comparator only when the natural order is not what you need. Pick a different algorithm only if stability, in-place, or O(1) space matters specifically.',
    steps: [
      'Default: use sorted() / a.sort() / std::sort.',
      'Need stability? → merge sort or the stable built-in (Python sort is stable, Java Collections.sort is stable, C++ std::stable_sort).',
      'Need O(1) space? → heap sort or std::sort (usually O(log n) but effectively O(1) stack).',
      'Need custom order? → pass a key function (Python) or comparator (Java/C++).',
      'Non-comparison speedup? → counting sort (small int range), radix sort (fixed-width keys).',
    ],
    template: {
      code:
        '# Python: key-based\n' +
        'sorted(items, key=lambda x: x[1])           # by second element\n' +
        'sorted(items, key=lambda x: (-x[0], x[1]))  # by 1st desc, 2nd asc\n' +
        '\n' +
        '# Java: Comparator\n' +
        'list.sort((a, b) -> Integer.compare(a[1], b[1]));\n' +
        '\n' +
        '# C++: lambda comparator\n' +
        'std::sort(v.begin(), v.end(),\n' +
        '          [](auto& a, auto& b){ return a.second < b.second; });',
      notes: ['Comparator must be strict-weak-ordering: no cycles, must be consistent.'],
    },
  },
  code: {
    python: {
      code:
        '# Merge sort\n' +
        'def merge_sort(a):\n' +
        '    if len(a) <= 1: return a\n' +
        '    mid = len(a) // 2\n' +
        '    left = merge_sort(a[:mid])\n' +
        '    right = merge_sort(a[mid:])\n' +
        '    return merge(left, right)\n' +
        '\n' +
        'def merge(left, right):\n' +
        '    out, i, j = [], 0, 0\n' +
        '    while i < len(left) and j < len(right):\n' +
        '        if left[i] <= right[j]: out.append(left[i]); i += 1\n' +
        '        else: out.append(right[j]); j += 1\n' +
        '    out.extend(left[i:])\n' +
        '    out.extend(right[j:])\n' +
        '    return out\n' +
        '\n' +
        '# Quick sort (in-place, Lomuto partition)\n' +
        'def quick_sort(a, lo=0, hi=None):\n' +
        '    if hi is None: hi = len(a) - 1\n' +
        '    if lo >= hi: return\n' +
        '    pivot = a[hi]\n' +
        '    i = lo\n' +
        '    for j in range(lo, hi):\n' +
        '        if a[j] <= pivot:\n' +
        '            a[i], a[j] = a[j], a[i]\n' +
        '            i += 1\n' +
        '    a[i], a[hi] = a[hi], a[i]\n' +
        '    quick_sort(a, lo, i - 1)\n' +
        '    quick_sort(a, i + 1, hi)',
      notes: ['Python’s built-in sort is Timsort — stable, O(n log n) worst case.'],
    },
    java: {
      code:
        'void mergeSort(int[] a) {\n' +
        '    if (a.length < 2) return;\n' +
        '    int[] tmp = new int[a.length];\n' +
        '    mergeSort(a, tmp, 0, a.length - 1);\n' +
        '}\n' +
        '\n' +
        'void mergeSort(int[] a, int[] tmp, int lo, int hi) {\n' +
        '    if (lo >= hi) return;\n' +
        '    int mid = lo + (hi - lo) / 2;\n' +
        '    mergeSort(a, tmp, lo, mid);\n' +
        '    mergeSort(a, tmp, mid + 1, hi);\n' +
        '    merge(a, tmp, lo, mid, hi);\n' +
        '}\n' +
        '\n' +
        'void merge(int[] a, int[] tmp, int lo, int mid, int hi) {\n' +
        '    for (int i = lo; i <= hi; i++) tmp[i] = a[i];\n' +
        '    int i = lo, j = mid + 1, k = lo;\n' +
        '    while (i <= mid && j <= hi) {\n' +
        '        a[k++] = (tmp[i] <= tmp[j]) ? tmp[i++] : tmp[j++];\n' +
        '    }\n' +
        '    while (i <= mid) a[k++] = tmp[i++];\n' +
        '    while (j <= hi) a[k++] = tmp[j++];\n' +
        '}\n' +
        '\n' +
        '// Custom comparator\n' +
        'java.util.List<int[]> pairs = new java.util.ArrayList<>();\n' +
        'pairs.sort((p, q) -> Integer.compare(p[1], q[1]));',
      notes: ['Collections.sort and Arrays.sort (for objects) are stable. Primitive Arrays.sort is dual-pivot quicksort, not stable.'],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '#include <algorithm>\n' +
        '\n' +
        'void merge_sort(std::vector<int>& a, int lo, int hi) {\n' +
        '    if (lo >= hi) return;\n' +
        '    int mid = lo + (hi - lo) / 2;\n' +
        '    merge_sort(a, lo, mid);\n' +
        '    merge_sort(a, mid + 1, hi);\n' +
        '    std::vector<int> tmp;\n' +
        '    tmp.reserve(hi - lo + 1);\n' +
        '    int i = lo, j = mid + 1;\n' +
        '    while (i <= mid && j <= hi)\n' +
        '        tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);\n' +
        '    while (i <= mid) tmp.push_back(a[i++]);\n' +
        '    while (j <= hi) tmp.push_back(a[j++]);\n' +
        '    std::copy(tmp.begin(), tmp.end(), a.begin() + lo);\n' +
        '}\n' +
        '\n' +
        '// Custom comparator — sort pairs by second element\n' +
        'std::vector<std::pair<int,int>> v;\n' +
        'std::sort(v.begin(), v.end(),\n' +
        '          [](auto& a, auto& b){ return a.second < b.second; });',
      notes: ['std::sort is not stable; std::stable_sort is. std::sort is O(n log n) average.'],
    },
  },
  languageNotes: [
    'Python: list.sort() and sorted() use Timsort — stable, O(n log n) worst case. Key function is faster than cmp_to_key.',
    'Java: Arrays.sort for primitives is dual-pivot quicksort (not stable). For objects, TimSort (stable). Collections.sort is stable.',
    'C++: std::sort (introsort) is not stable, O(n log n) average. std::stable_sort is stable, O(n log n) time but O(n) space.',
  ],
  complexity: {
    best: 'O(n) for Timsort on already-sorted data',
    average: 'O(n log n)',
    worst: 'O(n log n) merge / heap · O(n²) quick',
    auxiliary: 'O(n) merge · O(log n) quick · O(1) heap',
    total: 'Comparison sorts are Ω(n log n) information-theoretically',
    why: [
      { label: 'Ω(n log n) lower bound', reason: 'n! possible permutations. Each comparison gives at most one bit. Need ≥ log₂(n!) ≈ n log n comparisons.' },
      { label: 'Merge sort: O(n log n) always', reason: 'log n levels of splitting. Each level merges all n elements in O(n).' },
      { label: 'Quick sort: O(n log n) average', reason: 'Random pivot gives expected O(log n) depth. Worst case O(n²) on sorted input with fixed pivot.' },
      { label: 'Heap sort: O(n log n) worst', reason: 'Heapify O(n), each of n extract-max operations is O(log n). O(1) extra space.' },
      { label: 'Non-comparison sorts beat Ω(n log n)', reason: 'Counting sort uses value range, not comparisons. O(n + k) where k = range.' },
    ],
  },
  dryRun: {
    input: '[38, 27, 43, 3, 9, 82, 10]',
    initialState: 'Merge sort: split recursively, merge sorted halves',
    steps: [
      { step: '1', state: 'Split [38,27,43,3,9,82,10] → [38,27,43] and [3,9,82,10]', note: 'Divide.' },
      { step: '2', state: 'Split [38,27,43] → [38] and [27,43]', note: 'Base cases.' },
      { step: '3', state: 'Split [27,43] → [27] and [43]', note: 'Base.' },
      { step: '4', state: 'Merge [27] + [43] → [27,43]', note: 'Sorted.' },
      { step: '5', state: 'Merge [38] + [27,43] → [27,38,43]', note: 'Compare 38 vs 27 → 27, then 38 vs 43 → 38, then 43.' },
      { step: '6', state: 'Similar for right half → [3,9,10,82]', note: 'Recursive merge.' },
      { step: '7', state: 'Merge [27,38,43] + [3,9,10,82] → [3,9,10,27,38,43,82]', note: 'Final merge.' },
    ],
    output: '[3, 9, 10, 27, 38, 43, 82]',
  },
  whenToUse: [
    'You need sorted data — binary search, two-pointer, deduplication, greedy on intervals.',
    'You need a custom ordering — pass a comparator.',
    'Top-k problems — sort, or heap-based partial sort.',
    'Interval merging — sort by start, then scan.',
    'Stability matters — merge sort or built-in stable sort.',
    'In-place sorting required — heap sort or quicksort.',
  ],
  whenNotToUse: [
    'Sorting is not the answer — hash map gives O(n) lookup without sorting.',
    'You need the k-th element only — quickselect is O(n) average vs O(n log n) full sort.',
    'Range queries on a static array — preprocess instead.',
    'Comparison sort will not beat Ω(n log n) — use counting / radix / bucket if the key space allows.',
  ],
  mistakes: [
    { mistake: 'Assuming Python\'s sort is fast for large data — it is O(n log n) but the constant matters.', fix: 'For huge inputs, consider numpy sort or radix sort for integers.' },
    { mistake: 'Comparing tuples by accident with sorted(pairs).', fix: 'sorted(pairs) sorts by first then second. Use key=lambda p: p[1] to sort by second only.' },
    { mistake: 'Unstable sort when stability is required.', fix: 'Check: is your sort stable? Python sorted() is stable. C++ std::sort is NOT. Use std::stable_sort.' },
    { mistake: 'Quicksort on already-sorted input.', fix: 'Fixed pivot + sorted input = O(n²). Use random pivot or median-of-three.' },
    { mistake: 'Comparator violates strict-weak-ordering.', fix: 'Comparator must be consistent (a < b, b < c → a < c) and never return true for (a, a). Otherwise undefined behavior in Java/C++.' },
    { mistake: 'Sorting objects by reference using ==.', fix: 'Use .equals() in Java. Use identity vs value comparison carefully.' },
  ],
  interview: {
    questions: [
      'Sort an array of 0s, 1s, and 2s (Dutch national flag).',
      'Sort by custom comparator (e.g., largest number).',
      'Merge intervals.',
      'K-th largest element — sort or quickselect.',
      'Find the median — partial sort.',
      'Meeting rooms — sort by start.',
    ],
    observations: [
      'Sort-then-scan is a common pattern: sort the input, then a single linear pass answers the question.',
      'Stability matters for multi-key sorts: sort by secondary key first, then primary key — the stable sort preserves the previous order.',
      'For k-th element, quickselect is O(n) average and O(1) space, better than O(n log n) full sort.',
    ],
    optimizations: [
      'Partial sort: Python heapq.nlargest(k), Java PriorityQueue for top-k.',
      'Counting sort for integer ranges up to millions.',
      'Radix sort for fixed-width keys (integers, fixed-length strings).',
      'For small arrays (< 16 elements), insertion sort beats quicksort due to lower constants.',
    ],
    followUps: [
      'What if the array is nearly sorted? — insertion sort or Timsort (Python default).',
      'What if you have 100 million integers? — external sort or counting sort if range permits.',
      'What if you need stable sort in-place? — in-place stable sort (merge sort with rotation) is O(n log² n), which is why most languages use merge sort + O(n) space.',
    ],
  },
  related: [
    { id: 'binary-search', relation: 'Binary search requires sorted input' },
    { id: 'two-pointers', relation: 'Two-pointer pair-sum requires sorted input' },
    { id: 'hash-maps', relation: 'Hash map avoids the sort when ordering is not needed' },
  ],
  practice: [
    { title: 'Sort Colors', difficulty: 'Medium', why: 'Dutch national flag — three-way partition in one pass.' },
    { title: 'Merge Intervals', difficulty: 'Medium', why: 'Sort by start, then merge adjacent.' },
    { title: 'Largest Number', difficulty: 'Medium', why: 'Custom comparator by concatenated string order.' },
    { title: 'Kth Largest Element in an Array', difficulty: 'Medium', why: 'Quickselect — O(n) average vs full sort.' },
    { title: 'Meeting Rooms II', difficulty: 'Medium', why: 'Sort by start, min-heap of end times.' },
    { title: 'Sort an Array', difficulty: 'Medium', why: 'Implement merge sort or quick sort from scratch.' },
  ],
  revision: {
    takeaways: [
      'Every comparison sort is Ω(n log n) — this is a lower bound.',
      'Merge = stable, O(n) extra space. Quick = in-place, O(n²) worst. Heap = O(n log n) always, O(1) space.',
      'Stability matters for multi-key sorts.',
      'Use the built-in. Write a custom comparator only when the natural order is wrong.',
      'Non-comparison sorts (counting, radix) can beat O(n log n) if the key space is small.',
    ],
    formulas: [
      'Merge sort: T(n) = 2 T(n/2) + O(n) = O(n log n)',
      'Quick sort: T(n) = T(k) + T(n−k−1) + O(n), avg O(n log n)',
      'Heap sort: O(n) heapify + n × O(log n) extract-max = O(n log n)',
    ],
    complexitySummary: 'Comparison sorts: Ω(n log n). Merge: O(n log n) always. Quick: O(n²) worst, O(n log n) average. Heap: O(n log n) always.',
    patterns: ['Sort then scan', 'Custom comparator', 'Stability', 'In-place vs extra space', 'Partial sort / top-k'],
    memoryTrick: 'Merge = stable. Quick = in-place. Heap = O(1) space. All comparison sorts = Ω(n log n). Use built-in.',
  },
};
