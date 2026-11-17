import type { ConceptDetail } from '../../types';

export const dynamicProgrammingDetail: ConceptDetail = {
  id: 'dynamic-programming',
  overview: {
    essence:
      'DP equals recursion plus a cache. Two branches on the same state leads to memoize one. Overlapping subproblems are the whole trigger.',
    what:
      'Break a problem into overlapping subproblems, store each answer once, combine. Top-down (memoize) or bottom-up (tabulate).',
    problemSolved:
      'Naive recursion is O(branching^depth). Memoization solves each distinct subproblem once, giving O(states times cost).',
    whyImportant:
      'The single most common interview paradigm. Recognition: "count ways", "min cost", "max profit", overlapping recursion.',
    usedIn: [
      'Counting paths / ways',
      'Min cost / max profit',
      'String DP (edit distance, LCS)',
      'Knapsack variants',
      'Interval DP',
      'Tree DP',
    ],
  },
  intuition: {
    explanation:
      'Climbing stairs: from step 5 you can reach step 3 or 4, but "steps remaining = 3" is the same answer regardless of how you got there. Without memoization, you compute it many times. With memoization, once.',
    analogy:
      'A cache for subproblems. You write answers on a whiteboard and reuse them.',
  },
  internals: [
    { title: 'State definition', body: 'The minimal set of variables that determine the subproblem answer. Missing a dimension gives a wrong memo.' },
    { title: 'Recurrence', body: 'How to express dp[state] in terms of smaller states. The core insight.' },
    { title: 'Base cases', body: 'dp of the smallest inputs — the identity elements. Wrong base case gives off-by-one everywhere.' },
    { title: 'Order of computation', body: 'Top-down: recursion computes on demand. Bottom-up: fill in dependency order.' },
    { title: 'Space optimization', body: 'If dp[i] only depends on dp[i-1] and dp[i-2], use two variables instead of an array.' },
  ],
  visual: {
    vizId: 'dp-climbing-stairs',
    caption: 'Watch the DP table fill from base cases upward.',
  },
  approach: {
    summary:
      'Define state, derive recurrence, set base cases, memoize or tabulate. Skip DP if subproblems do not overlap (then it is divide-and-conquer).',
    steps: [
      'Ask: what is my state?',
      'Ask: dp[state] equals f(smaller states)?',
      'Ask: what is the smallest case?',
      'Cache: hash map (top-down) or array (bottom-up).',
    ],
    template: {
      code:
        'def solve(n):\n' +
        '    memo = {}\n' +
        '    def dp(i):\n' +
        '        if i in memo: return memo[i]\n' +
        '        if i <= 1: return 1\n' +
        '        memo[i] = dp(i-1) + dp(i-2)\n' +
        '        return memo[i]\n' +
        '    return dp(n)',
    },
  },
  code: {
    python: {
      code:
        'def climb_stairs(n):\n' +
        '    if n <= 1: return 1\n' +
        '    a, b = 1, 1\n' +
        '    for _ in range(2, n+1):\n' +
        '        a, b = b, a + b\n' +
        '    return b\n\n' +
        'def longest_common_subsequence(s1, s2):\n' +
        '    m, n = len(s1), len(s2)\n' +
        '    dp = [[0]*(n+1) for _ in range(m+1)]\n' +
        '    for i in range(1, m+1):\n' +
        '        for j in range(1, n+1):\n' +
        '            if s1[i-1] == s2[j-1]:\n' +
        '                dp[i][j] = 1 + dp[i-1][j-1]\n' +
        '            else:\n' +
        '                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n' +
        '    return dp[m][n]',
      notes: ['2D DP table for LCS. Roll two rows for O(n) space if needed.'],
    },
    java: {
      code:
        'int climbStairs(int n) {\n' +
        '    if (n <= 1) return 1;\n' +
        '    int a = 1, b = 1;\n' +
        '    for (int i = 2; i <= n; i++) {\n' +
        '        int t = a + b;\n' +
        '        a = b;\n' +
        '        b = t;\n' +
        '    }\n' +
        '    return b;\n' +
        '}\n\n' +
        'int lcs(String s1, String s2) {\n' +
        '    int m = s1.length(), n = s2.length();\n' +
        '    int[][] dp = new int[m+1][n+1];\n' +
        '    for (int i = 1; i <= m; i++) {\n' +
        '        for (int j = 1; j <= n; j++) {\n' +
        '            if (s1.charAt(i-1) == s2.charAt(j-1))\n' +
        '                dp[i][j] = 1 + dp[i-1][j-1];\n' +
        '            else\n' +
        '                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n' +
        '        }\n' +
        '    }\n' +
        '    return dp[m][n];\n' +
        '}',
      notes: ['LCS: two-row space optimization is common.'],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '#include <string>\n' +
        '#include <algorithm>\n\n' +
        'int climb_stairs(int n) {\n' +
        '    if (n <= 1) return 1;\n' +
        '    int a = 1, b = 1;\n' +
        '    for (int i = 2; i <= n; i++) { int t = a + b; a = b; b = t; }\n' +
        '    return b;\n' +
        '}\n\n' +
        'int lcs(const std::string& s1, const std::string& s2) {\n' +
        '    int m = s1.size(), n = s2.size();\n' +
        '    std::vector<std::vector<int>> dp(m+1, std::vector<int>(n+1, 0));\n' +
        '    for (int i = 1; i <= m; i++) {\n' +
        '        for (int j = 1; j <= n; j++) {\n' +
        '            if (s1[i-1] == s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n' +
        '            else dp[i][j] = std::max(dp[i-1][j], dp[i][j-1]);\n' +
        '        }\n' +
        '    }\n' +
        '    return dp[m][n];\n' +
        '}',
      notes: ['Same recurrence, C++ vector of vectors.'],
    },
  },
  complexity: {
    best: 'O(states)',
    average: 'O(states x cost_per_state)',
    worst: 'O(states x cost_per_state)',
    auxiliary: 'O(states)',
    total: 'Time = number of distinct states x work per state',
    why: [
      { label: 'O(states)', reason: 'Each distinct state is computed once. Total equals number of states.' },
      { label: 'O(states x transitions)', reason: 'For each state you may iterate over all outgoing transitions.' },
      { label: 'Auxiliary O(states)', reason: 'The memo table has one entry per state. Often reduceable by rolling.' },
    ],
  },
  dryRun: {
    input: 'n = 5 (climb stairs)',
    initialState: 'dp[0] = 1, dp[1] = 1',
    steps: [
      { step: '1', state: 'dp[2] = dp[1] + dp[0] = 2', note: '2 ways to climb 2 stairs: [1,1], [2].' },
      { step: '2', state: 'dp[3] = dp[2] + dp[1] = 3', note: '[1,1,1], [1,2], [2,1].' },
      { step: '3', state: 'dp[4] = dp[3] + dp[2] = 5', note: '5 ways.' },
      { step: '4', state: 'dp[5] = dp[4] + dp[3] = 8', note: '8 ways.' },
    ],
    output: '8',
  },
  whenToUse: [
    'Count the number of ways to reach a target.',
    'Min cost or max profit.',
    'Recursion that revisits the same arguments.',
    'Optimal substructure plus overlapping subproblems.',
  ],
  whenNotToUse: [
    'Subproblems are disjoint — divide and conquer.',
    'You only need one path, not the best — greedy may work.',
    'State space is too large to memoize.',
  ],
  mistakes: [
    { mistake: 'Forgetting a dimension in the state.', fix: 'Ask: what affects future decisions? That is your state.' },
    { mistake: 'Bottom-up order wrong.', fix: 'You can only fill dp[i] after all dp[j] it depends on.' },
    { mistake: 'Not recognizing overlap.', fix: 'If subproblems do not overlap, memoization gains nothing.' },
    { mistake: 'Always using arrays.', fix: 'Sparse states — hash map memo.' },
  ],
  interview: {
    questions: [
      'Climbing stairs / house robber.',
      'Longest common subsequence / edit distance.',
      '0/1 knapsack / coin change.',
      'Longest increasing subsequence.',
      'Word break.',
    ],
    observations: [
      'State definition is the whole problem.',
      'Space can almost always shrink to O(n) or O(k).',
      'Top-down is easier to write; bottom-up is faster in practice.',
    ],
    optimizations: [
      'Rolling arrays: O(n) space for 1D DP.',
      'Bitmask DP for subset problems with n up to 20.',
      'Memoize with hash map when states are sparse.',
    ],
    followUps: [
      'What if you also need to reconstruct the path? — store parent pointers.',
      'What if the constraints double? — likely O(n^2) DP.',
    ],
  },
  related: [
    { id: 'recursion', relation: 'DP is memoized recursion' },
    { id: 'greedy', relation: 'Greedy is DP without backtracking' },
    { id: 'lcs', relation: 'LCS is a canonical 2D DP' },
    { id: 'knapsack-01', relation: '0/1 knapsack is a canonical DP template' },
    { id: 'unbounded-knapsack', relation: 'Unbounded knapsack reuses the DP shape' },
    { id: 'interval-dp', relation: 'Interval DP is a specific DP structure' },
    { id: 'bitmask-dp', relation: 'Bitmask DP uses integer subset states' },
  ],
  practice: [
    { title: 'Climbing Stairs', difficulty: 'Easy', why: 'The Hello World of DP.' },
    { title: 'House Robber', difficulty: 'Medium', why: 'State equals max so far excluding current.' },
    { title: 'Coin Change', difficulty: 'Medium', why: 'Min coins, unbounded knapsack.' },
    { title: 'Longest Common Subsequence', difficulty: 'Medium', why: '2D DP, generalization to edit distance.' },
    { title: 'Edit Distance', difficulty: 'Hard', why: 'Three-way recurrence.' },
  ],
  revision: {
    takeaways: [
      'DP equals recursion plus cache.',
      'Overlapping subproblems is the trigger.',
      'State definition matters most.',
      'Space can almost always shrink.',
    ],
    formulas: [
      'dp[i] = f(dp[i-1], dp[i-2], ...)',
      'Space opt: if only depends on i-1, use two variables',
    ],
    complexitySummary: 'O(states x cost_per_state) time, O(states) space.',
    patterns: ['Count ways', 'Min/max cost', 'Optimal substructure', 'Overlapping subproblems'],
    memoryTrick: 'Define state, derive recurrence, fix base cases, memoize.',
  },
};
