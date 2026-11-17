import type { ConceptDetail } from '../../types';

export const heapsDetail: ConceptDetail = {
  id: 'heaps',
  overview: {
    essence:
      'A heap is a binary tree where parent <= (or >=) children. That single constraint gives O(1) peek and O(log n) push/pop of the min (or max).',
    what:
      'A complete binary tree (implicitly stored in an array) satisfying the heap property: every parent is <= or >= its children.',
    problemSolved:
      'Repeatedly need the minimum (or maximum) element while the collection changes. Sorting is O(n log n) once; a heap gives O(log n) per operation.',
    whyImportant:
      'Priority queues are everywhere: Dijkstra, best-first search, top-k, scheduling. Every major language ships a heap.',
    usedIn: [
      'Priority queue',
      'Top-k / k-th largest',
      'Dijkstra / Prim',
      'Streaming median',
      'Task scheduling',
      'Merge k sorted lists',
    ],
  },
  intuition: {
    explanation:
      'A heap is not sorted. It only guarantees that the root is the min (or max). That is enough for "give me the smallest" in O(1), and swapping the root with the last leaf plus sifting down restores the property in O(log n).',
    analogy:
      'A tournament bracket. The winner (root) is guaranteed to be the best, but you do not know the second-best without replaying a few matches.',
  },
  internals: [
    { title: 'Array representation', body: 'Node at index i has children 2i+1 and 2i+2, parent (i-1)//2. No pointers needed.' },
    { title: 'Sift-up (push)', body: 'Insert at end. While parent > new: swap. O(log n).' },
    { title: 'Sift-down (pop)', body: 'Move last element to root. Swap with smaller child until heap property holds. O(log n).' },
    { title: 'Heapify', body: 'Build a heap from an unsorted array. Bottom-up, O(n) — not O(n log n), which is a common confusion.' },
  ],
  visual: {
    diagram:
      'Min-heap (array: [1, 3, 5, 7, 9, 6]):\n' +
      '        1\n' +
      '       / \\\n' +
      '      3   5\n' +
      '     / \\ /\n' +
      '    7  9 6\n\n' +
      'Root = 1 (always the min).\n' +
      'Parent of i: (i-1)//2. Children: 2i+1, 2i+2.',
    caption: 'A min-heap: parent <= children. Root is the min.',
  },
  approach: {
    summary:
      'Use a heap when you need repeated min/max with mutations. Push O(log n), pop O(log n), peek O(1). Built-in in all major languages.',
    steps: [
      'Python: heapq (min-heap). Negate values for max-heap.',
      'Java: PriorityQueue (default min-heap). Reverse comparator for max.',
      'Top-k: keep a heap of size k.',
    ],
    template: {
      code:
        'import heapq\n\n' +
        'h = []\n' +
        'heapq.heappush(h, 3)\n' +
        'heapq.heappush(h, 1)\n' +
        'smallest = heapq.heappop(h)  # 1\n\n' +
        '# Max-heap in Python: negate\n' +
        'max_h = [-x for x in [3, 1, 2]]\n' +
        'heapq.heapify(max_h)',
    },
  },
  code: {
    python: {
      code:
        'import heapq\n\n' +
        'def k_largest(nums, k):\n' +
        '    h = []\n' +
        '    for n in nums:\n' +
        '        heapq.heappush(h, n)\n' +
        '        if len(h) > k:\n' +
        '            heapq.heappop(h)\n' +
        '    return sorted(h, reverse=True)\n\n' +
        'def merge_k_sorted(lists):\n' +
        '    h = []\n' +
        '    for i, l in enumerate(lists):\n' +
        '        if l: heapq.heappush(h, (l[0], i, 0))\n' +
        '    result = []\n' +
        '    while h:\n' +
        '        val, li, idx = heapq.heappop(h)\n' +
        '        result.append(val)\n' +
        '        if idx + 1 < len(lists[li]):\n' +
        '            heapq.heappush(h, (lists[li][idx+1], li, idx+1))\n' +
        '    return result',
      notes: ['Python heapq is a min-heap only. Negate for max.'],
    },
    java: {
      code:
        'PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n' +
        'PriorityQueue<Integer> maxHeap = new PriorityQueue<>(java.util.Collections.reverseOrder());\n\n' +
        'int kLargest(int[] nums, int k) {\n' +
        '    PriorityQueue<Integer> h = new PriorityQueue<>();\n' +
        '    for (int n : nums) {\n' +
        '        h.add(n);\n' +
        '        if (h.size() > k) h.poll();\n' +
        '    }\n' +
        '    return h.peek();\n' +
        '}',
      notes: ['PriorityQueue defaults to min-heap. Pass a comparator for max-heap.'],
    },
  },
  complexity: {
    best: 'O(1) peek',
    average: 'O(log n) push/pop',
    worst: 'O(log n) push/pop',
    auxiliary: 'O(n)',
    total: 'O(1) peek, O(log n) push/pop, O(n) heapify',
    why: [
      { label: 'O(1) peek', reason: 'The min/max is always at index 0.' },
      { label: 'O(log n) push/pop', reason: 'Sift-up or sift-down walks one path from root to leaf — height is log n.' },
      { label: 'O(n) heapify', reason: 'Bottom-up heapify only does O(log n) work per node at the top, O(1) at the bottom.' },
    ],
  },
  dryRun: {
    input: 'push [3, 1, 4, 1, 5] into min-heap',
    initialState: 'h = []',
    steps: [
      { step: '1', state: 'push 3 -> [3]', note: 'Trivial.' },
      { step: '2', state: 'push 1 -> [1, 3]', note: 'Sift-up.' },
      { step: '3', state: 'push 4 -> [1, 3, 4]', note: 'Level 1 right.' },
      { step: '4', state: 'push 1 -> [1, 1, 4, 3]', note: 'Ties at root.' },
      { step: '5', state: 'push 5 -> [1, 1, 4, 3, 5]', note: '' },
    ],
    output: 'min = 1, then 1, then 3, then 4, then 5',
  },
  whenToUse: [
    'Top-k / k-th largest.',
    'Repeatedly need min/max with mutations.',
    'Dijkstra, Prim.',
    'Merge k sorted lists.',
    'Streaming median (two heaps).',
  ],
  whenNotToUse: [
    'You need sorted order — sort instead.',
    'You need O(1) search by arbitrary value — hash map.',
    'You need both min and max at once — balanced tree or two heaps.',
  ],
  mistakes: [
    { mistake: 'Assuming Python heapq is a max-heap.', fix: 'It is min-heap only. Negate values or use a wrapper class.' },
    { mistake: 'Thinking heapify is O(n log n).', fix: 'It is O(n) — bottom-up construction, not n insertions.' },
    { mistake: 'Using a heap when a sorted array would do.', fix: 'If the collection is static, sort once.' },
  ],
  interview: {
    questions: [
      'K-th largest element.',
      'Merge k sorted lists.',
      'Top k frequent elements.',
      'Find median from data stream.',
      'Task scheduler.',
    ],
    observations: [
      'Top-k = min-heap of size k.',
      'Streaming median = max-heap + min-heap balanced.',
      'Dijkstra uses a min-heap of (distance, node).',
    ],
    optimizations: [
      'Quickselect finds k-th in O(n) average.',
      'Two heaps for median — always balanced.',
    ],
    followUps: [
      'What if the stream is huge? — bounded-size heap (top-k).',
      'What if you need to delete arbitrary elements? — indexed heap or balanced BST.',
    ],
  },
  related: [
    { id: 'trees', relation: 'Heaps are complete binary trees stored in arrays' },
    { id: 'sorting', relation: 'Heap sort is O(n log n) using a heap' },
    { id: 'dijkstra', relation: 'Dijkstra uses a min-heap frontier' },
  ],
  practice: [
    { title: 'Kth Largest Element in an Array', difficulty: 'Medium', why: 'Min-heap of size k.' },
    { title: 'Top K Frequent Elements', difficulty: 'Medium', why: 'Count then heap of size k.' },
    { title: 'Merge k Sorted Lists', difficulty: 'Hard', why: 'Heap of (value, list_index, node_index).' },
    { title: 'Find Median from Data Stream', difficulty: 'Hard', why: 'Two heaps balanced.' },
  ],
  revision: {
    takeaways: [
      'O(1) peek, O(log n) push/pop.',
      'Heapify is O(n), not O(n log n).',
      'Python heapq is min only.',
      'Top-k = min-heap of size k.',
    ],
    formulas: [
      'Children of i: 2i+1, 2i+2',
      'Parent of i: (i-1)//2',
    ],
    complexitySummary: 'Peek O(1), push/pop O(log n), heapify O(n).',
    patterns: ['Top-k', 'Streaming median', 'Merge k sorted', 'Dijkstra frontier'],
    memoryTrick: 'Heap = tournament bracket. Root = winner. Top-k = keep the small heap small.',
  },
};
