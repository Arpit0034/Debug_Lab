import type { ConceptDetail } from '../../types';

export const greedyDetail: ConceptDetail = {
  id: 'greedy',
  overview: {
    essence:
      'Pick the locally best choice now and trust it leads to the global optimum. Only works if proven — otherwise you need DP.',
    what:
      'A paradigm: at each step, take the locally optimal choice without reconsidering. No backtracking, no DP table.',
    problemSolved:
      'When the exchange argument holds (local optimum implies global optimum), greedy is O(n log n) or O(n) instead of exponential.',
    whyImportant:
      'The fastest paradigm. But the danger is silent wrong answers — greedy fails on many problems that look similar.',
    usedIn: [
      'Interval scheduling',
      'Huffman coding',
      'Dijkstra',
      'Kruskal / Prim MST',
      'Jump game',
      'Gas station',
    ],
  },
  intuition: {
    explanation:
      'A greedy algorithm is a bet: "the locally best choice leads to the globally best answer." The bet pays off when there is an exchange argument proving that any optimal solution can be transformed into one that uses the greedy choice first.',
    analogy:
      'You are on a hike, always taking the path that climbs highest in the next 5 minutes. Works if the mountain is a single peak; fails on a hilly landscape with a taller peak elsewhere.',
  },
  internals: [
    { title: 'Greedy choice', body: 'The local decision at each step. Usually: sort, then take the smallest / largest / earliest.' },
    { title: 'Exchange argument', body: 'Prove the greedy choice is safe: if an optimal solution differs from greedy, swapping in the greedy choice does not worsen it.' },
    { title: 'No reconsideration', body: 'Once committed, greedy never undoes a choice. Fast and fragile.' },
    { title: 'When it fails', body: 'If local choice can block a better global path, greedy is wrong. Use DP or backtracking.' },
  ],
  visual: {
    diagram:
      'Interval scheduling (max non-overlapping):\n' +
      '  Intervals: [1,3], [2,4], [3,5]\n' +
      '  Greedy by earliest END: pick [1,3], then [3,5] -> 2\n' +
      '  Greedy by earliest START: pick [1,3], then [3,5] -> 2\n' +
      '  Greedy by SHORTEST: pick [2,4] -> 1 (WRONG)\n\n' +
      'The "sort by end time" choice is provably optimal.',
    caption: 'Greedy: sort by end time, take the next non-overlapping interval.',
  },
  approach: {
    summary:
      'Identify the greedy choice. Sort input by the key that makes the choice obvious. Iterate, taking each valid choice. Prove correctness via exchange argument.',
    steps: [
      'Sort by the right key (usually: end time, weight, ratio).',
      'Iterate over sorted items.',
      'Take the item if it is compatible with prior choices.',
      'Prove: the greedy choice never worsens the optimum.',
    ],
    template: {
      code:
        'intervals.sort(key=lambda x: x[1])  # by end time\n' +
        'count, last_end = 0, -float("inf")\n' +
        'for start, end in intervals:\n' +
        '    if start >= last_end:\n' +
        '        count += 1\n' +
        '        last_end = end\n' +
        'return count',
    },
  },
  code: {
    python: {
      code:
        'def activity_selection(intervals):\n' +
        '    intervals.sort(key=lambda x: x[1])\n' +
        '    count, last = 0, -1\n' +
        '    for s, e in intervals:\n' +
        '        if s >= last:\n' +
        '            count += 1\n' +
        '            last = e\n' +
        '    return count\n\n' +
        'def jump_game(nums):\n' +
        '    reach = 0\n' +
        '    for i, n in enumerate(nums):\n' +
        '        if i > reach: return False\n' +
        '        reach = max(reach, i + n)\n' +
        '    return True',
      notes: ['Interval scheduling: sort by end. Jump game: track farthest reachable.'],
    },
    java: {
      code:
        'int activitySelection(int[][] intervals) {\n' +
        '    java.util.Arrays.sort(intervals, (a, b) -> a[1] - b[1]);\n' +
        '    int count = 0, last = -1;\n' +
        '    for (int[] i : intervals) {\n' +
        '        if (i[0] >= last) {\n' +
        '            count++;\n' +
        '            last = i[1];\n' +
        '        }\n' +
        '    }\n' +
        '    return count;\n' +
        '}\n\n' +
        'boolean jumpGame(int[] nums) {\n' +
        '    int reach = 0;\n' +
        '    for (int i = 0; i < nums.length; i++) {\n' +
        '        if (i > reach) return false;\n' +
        '        reach = Math.max(reach, i + nums[i]);\n' +
        '    }\n' +
        '    return true;\n' +
        '}',
      notes: ['Comparator-based sort. Track the farthest reach at each index.'],
    },
  },
  complexity: {
    best: 'O(n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    auxiliary: 'O(1)',
    total: 'O(n log n) with sort, O(n) after',
    why: [
      { label: 'O(n log n) with sort', reason: 'Sorting dominates. The greedy loop itself is O(n).' },
      { label: 'O(n) without sort', reason: 'If input is already sorted or bucketed, greedy is linear.' },
      { label: 'O(1) space', reason: 'Typically only local variables — count, last_end, reach.' },
    ],
  },
  dryRun: {
    input: 'intervals = [[1,3], [2,4], [3,5]]',
    initialState: 'sort by end: [[1,3], [2,4], [3,5]]',
    steps: [
      { step: '1', state: '[1,3]: start=1 >= last=-1 -> pick. count=1, last=3', note: 'First always picked.' },
      { step: '2', state: '[2,4]: start=2 < 3 -> skip', note: 'Overlaps [1,3].' },
      { step: '3', state: '[3,5]: start=3 >= 3 -> pick. count=2, last=5', note: 'Non-overlapping.' },
    ],
    output: '2',
  },
  whenToUse: [
    'You can prove the greedy choice is optimal (exchange argument).',
    'Interval scheduling, coin change (canonical), Huffman, MST.',
    'Problems where a "take the best now" rule clearly terminates with a good answer.',
  ],
  whenNotToUse: [
    'You cannot prove the greedy choice is safe.',
    'The problem requires exploring combinations — DP or backtracking.',
    'Knapsack with arbitrary weights (greedy by value/weight fails).',
  ],
  mistakes: [
    { mistake: 'Assuming greedy works because it looks similar.', fix: 'Prove it. Try to construct a counterexample.' },
    { mistake: 'Sorting by the wrong key.', fix: 'Interval scheduling: sort by END, not start.' },
    { mistake: 'Trying to apply greedy to a knapsack with weights.', fix: 'Value/weight ratio fails — need DP.' },
  ],
  interview: {
    questions: [
      'Activity selection / meeting rooms.',
      'Jump game.',
      'Gas station.',
      'Huffman coding.',
      'Task scheduler.',
    ],
    observations: [
      'If a DP solution exists and no obvious greedy choice, DP is safer.',
      'Greedy + sort is often "sort then one pass".',
      'Exchange argument is the standard proof technique.',
    ],
    optimizations: [
      'Heap-based greedy for "pick smallest / largest each step".',
      'Union-find + sorted edges for Kruskal MST.',
    ],
    followUps: [
      'What if weights vary? — likely DP, not greedy.',
      'What if intervals overlap partially? — still greedy, sort by end.',
    ],
  },
  related: [
    { id: 'sorting', relation: 'Greedy usually starts with a sort' },
    { id: 'minimum-spanning-tree', relation: 'Kruskal and Prim are greedy algorithms' },
    { id: 'merge-intervals', relation: 'Interval scheduling is greedy on intervals' },
  ],
  practice: [
    { title: 'Jump Game', difficulty: 'Medium', why: 'Track reachable range — invariant is farthest reachable.' },
    { title: 'Non-overlapping Intervals', difficulty: 'Medium', why: 'Sort by end, count removals.' },
    { title: 'Gas Station', difficulty: 'Medium', why: 'Greedy reset when tank goes negative.' },
    { title: 'Task Scheduler', difficulty: 'Medium', why: 'Max-heap + cooldown.' },
    { title: 'Merge Intervals', difficulty: 'Medium', why: 'Sort by start, merge overlapping.' },
  ],
  revision: {
    takeaways: [
      'Greedy: pick the locally best and do not look back.',
      'Proof required — exchange argument.',
      'Usually sort first.',
      'If greedy fails, try DP.',
    ],
    formulas: [
      'Interval scheduling: sort by end, count non-overlapping',
      'Jump game: reach = max(reach, i + nums[i])',
    ],
    complexitySummary: 'O(n log n) with sort, O(n) without. O(1) auxiliary.',
    patterns: ['Sort + one pass', 'Interval scheduling', 'Farthest reach', 'Priority-queue greedy'],
    memoryTrick: 'Greedy = commit and never look back. Only safe with an exchange proof.',
  },
};
