import type { ConceptDetail } from '../../types';

export const slidingWindowDetail: ConceptDetail = {
  id: 'sliding-window',
  overview: {
    essence:
      'A contiguous window [left, right] grows to the right and shrinks from the left. Each element enters and exits the window exactly once, so total work is O(n).',
    what: 'Two pointers, both moving forward only. right extends the window; left retracts it while the window violates a property. The window is always contiguous.',
    problemSolved:
      'Enumerating all subarrays is O(n²). Sliding window visits each subarray that matters exactly once — O(n).',
    whyImportant:
      'Every "contiguous subarray with property X" or "longest/shortest substring" problem is a sliding window. The trick is to identify what state the window tracks and when to shrink.',
    usedIn: [
      'Longest subarray with sum ≤ S',
      'Longest substring with at most k distinct characters',
      'Minimum window containing all characters of a target',
      'Fixed-size window sums',
      'Longest substring without repeating characters',
      'Find all anagrams in a string',
    ],
  },
  intuition: {
    explanation:
      'For each right, you want the best possible left. But you never reset left to 0 — once left has advanced past a position, it never goes back. That is what makes the total O(n): left and right each travel at most n steps, for 2n total. The window "expands" with right and "contracts" with left based on a tracked property (sum, distinct count, character frequencies).',
    analogy:
      'A sliding frame on a long strip of photos. You add photos on the right. When the frame violates your rule (too many people, too wide, a duplicate), you push photos off the left until it is legal again.',
  },
  internals: [
    { title: 'Two pointers, forward only', body: 'left and right both start at 0 and only move right. left never resets.' },
    { title: 'Tracked state', body: 'A variable or data structure that the window maintains: window sum, distinct count, character frequency map, etc.' },
    { title: 'Expand step', body: 'Move right forward, add a[right] to the tracked state.' },
    { title: 'Shrink condition', body: 'While the state violates the rule, remove a[left] and move left forward.' },
    { title: 'Record / update', body: 'After each expand+shrink cycle, the window is valid. Record its length or its properties.' },
    { title: 'Fixed vs variable window', body: 'Fixed size k: expand right k times, then slide by adding right and removing left. Variable size: expand while valid, shrink while invalid.' },
  ],
  visual: {
    vizId: 'sliding-window',
    caption:
      'Longest subarray with sum ≤ 5. Watch the window grow right, shrink left when sum exceeds target, and track the best length.',
  },
  approach: {
    summary:
      'Identify the property the window tracks. Expand right, add to state. While invalid, remove a[left] and left++. Record answer when valid.',
    steps: [
      'Choose what to track: sum, count of distinct, char frequencies, etc.',
      'Initialize left = 0, state = empty, answer = 0 (or +∞ for "minimum").',
      'For each right from 0 to n-1: add a[right] to state.',
      'While state is invalid (violates the rule), remove a[left] from state and left++.',
      'Update answer using the current window length or properties.',
      'Return answer.',
    ],
    template: {
      code:
        'left = 0\n' +
        'state = initial_state()\n' +
        'ans = initial_answer()\n' +
        'for right in range(n):\n' +
        '    add(a[right], state)\n' +
        '    while not valid(state):\n' +
        '        remove(a[left], state)\n' +
        '        left += 1\n' +
        '    ans = update(ans, right - left + 1)',
      notes: ['Window length is right - left + 1. Off-by-one is the most common mistake.'],
    },
  },
  code: {
    python: {
      code:
        'def longest_subarray_sum_le(nums, target):\n' +
        '    left = 0\n' +
        '    total = 0\n' +
        '    best = 0\n' +
        '    for right in range(len(nums)):\n' +
        '        total += nums[right]\n' +
        '        while total > target:\n' +
        '            total -= nums[left]\n' +
        '            left += 1\n' +
        '        best = max(best, right - left + 1)\n' +
        '    return best\n' +
        '\n' +
        'def longest_unique_substring(s):\n' +
        '    left = 0\n' +
        '    last_seen = {}\n' +
        '    best = 0\n' +
        '    for right, c in enumerate(s):\n' +
        '        if c in last_seen and last_seen[c] >= left:\n' +
        '            left = last_seen[c] + 1\n' +
        '        last_seen[c] = right\n' +
        '        best = max(best, right - left + 1)\n' +
        '    return best',
      notes: ['For unique-char problems, jump left directly instead of a while loop.'],
    },
    java: {
      code:
        'int longestSubarraySumLe(int[] nums, int target) {\n' +
        '    int left = 0, total = 0, best = 0;\n' +
        '    for (int right = 0; right < nums.length; right++) {\n' +
        '        total += nums[right];\n' +
        '        while (total > target) {\n' +
        '            total -= nums[left++];\n' +
        '        }\n' +
        '        best = Math.max(best, right - left + 1);\n' +
        '    }\n' +
        '    return best;\n' +
        '}\n' +
        '\n' +
        'int longestUniqueSubstring(String s) {\n' +
        '    int left = 0, best = 0;\n' +
        '    java.util.Map<Character, Integer> last = new java.util.HashMap<>();\n' +
        '    for (int right = 0; right < s.length(); right++) {\n' +
        '        char c = s.charAt(right);\n' +
        '        if (last.containsKey(c) && last.get(c) >= left) {\n' +
        '            left = last.get(c) + 1;\n' +
        '        }\n' +
        '        last.put(c, right);\n' +
        '        best = Math.max(best, right - left + 1);\n' +
        '    }\n' +
        '    return best;\n' +
        '}',
      notes: ['Arrays and HashMap both work for the freq map.'],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '#include <string>\n' +
        '#include <unordered_map>\n' +
        '#include <algorithm>\n' +
        '\n' +
        'int longest_subarray_sum_le(const std::vector<int>& nums, int target) {\n' +
        '    int left = 0, total = 0, best = 0;\n' +
        '    for (int right = 0; right < (int)nums.size(); right++) {\n' +
        '        total += nums[right];\n' +
        '        while (total > target) {\n' +
        '            total -= nums[left++];\n' +
        '        }\n' +
        '        best = std::max(best, right - left + 1);\n' +
        '    }\n' +
        '    return best;\n' +
        '}\n' +
        '\n' +
        'int longest_unique_substring(const std::string& s) {\n' +
        '    int left = 0, best = 0;\n' +
        '    std::unordered_map<char, int> last;\n' +
        '    for (int right = 0; right < (int)s.size(); right++) {\n' +
        '        char c = s[right];\n' +
        '        if (last.count(c) && last[c] >= left) {\n' +
        '            left = last[c] + 1;\n' +
        '        }\n' +
        '        last[c] = right;\n' +
        '        best = std::max(best, right - left + 1);\n' +
        '    }\n' +
        '    return best;\n' +
        '}',
      notes: ['std::unordered_map for freq. std::array<int, 128> faster when alphabet is small.'],
    },
  },
  languageNotes: [
    'Python: enumerate is cleaner than range(len()). Nested while-loop shrinks are safe.',
    'Java: charAt returns char; Map<Character, Integer> is slower than int[26] for fixed alphabets.',
    'C++: std::string operator[] returns char by value; use s[right] not s[right - 1].',
  ],
  complexity: {
    best: 'O(n) — one pass',
    average: 'O(n)',
    worst: 'O(n)',
    auxiliary: 'O(1) for sums · O(k) for character maps',
    total: 'O(n) time (left and right each move n times → 2n iterations)',
    why: [
      { label: 'O(n) despite the while loop', reason: 'Each element is added to the state once (at right) and removed once (at left). Total add + remove = 2n operations.' },
      { label: 'O(k) space for frequency maps', reason: 'k = number of distinct keys tracked. O(1) if alphabet is fixed (e.g., 26 letters).' },
      { label: 'O(1) for sum-only windows', reason: 'Just a running total and two pointers.' },
    ],
  },
  dryRun: {
    input: 'nums = [1, 2, 1, 3, 1, 1, 1, 2], target = 5',
    initialState: 'left=0, total=0, best=0',
    steps: [
      { step: '1', state: 'right=0, add 1, total=1, best=1', note: 'Window [0..0], length 1.' },
      { step: '2', state: 'right=1, add 2, total=3, best=2', note: 'Window [0..1], length 2.' },
      { step: '3', state: 'right=2, add 1, total=4, best=3', note: 'Window [0..2], length 3.' },
      { step: '4', state: 'right=3, add 3, total=7 > 5, shrink: remove a[0]=1, left=1, total=6, still > 5, remove a[1]=2, left=2, total=4, best=3', note: 'Window [2..3], length 2.' },
      { step: '5', state: 'right=4, add 1, total=5, best=3', note: 'Window [2..4], length 3.' },
      { step: '6', state: 'right=5, add 1, total=6 > 5, remove a[2]=1, left=3, total=5, best=3', note: 'Window [3..5], length 3.' },
      { step: '7', state: 'right=6, add 1, total=6 > 5, remove a[3]=3, left=4, total=3, best=3', note: 'Window [4..6], length 3.' },
      { step: '8', state: 'right=7, add 2, total=5, best=4', note: 'Window [4..7], length 4 — new best.' },
    ],
    output: '4',
  },
  whenToUse: [
    'The problem says "contiguous subarray" or "substring".',
    '"Longest / shortest subarray with property X".',
    '"At most k distinct", "no duplicates", "sum ≤ target".',
    '"Minimum window containing all characters of T".',
    'Fixed-size window sums (rolling sum).',
    'Any problem where the answer is a *range* of the array, not a subset.',
  ],
  whenNotToUse: [
    'Non-contiguous subsets (subset sum, longest increasing subsequence) — sliding window does not apply.',
    'The property is not monotone with window size — shrinking may not help.',
    'Elements can be negative and the property is "sum" — sliding window assumes monotone sum.',
    'You need all subarrays, not the best one — sliding window finds one; enumerate for all.',
  ],
  mistakes: [
    { mistake: 'Forgetting to shrink when the window is invalid.', fix: 'Every expand must be followed by the shrink loop, even if the window is currently valid — the loop checks the condition first.' },
    { mistake: 'Wrong shrink direction.', fix: 'For "longest subarray with sum ≤ S": shrink while sum > S. For "shortest": record and shrink while sum ≥ S, then update best after each full cycle.' },
    { mistake: 'Off-by-one in length calculation.', fix: 'Window is [left, right] INCLUSIVE → length = right - left + 1.' },
    { mistake: 'Assuming sliding window works on negative numbers.', fix: 'For sum-based windows, negatives break monotonicity. Use prefix sums + hash map instead.' },
    { mistake: 'Using fixed-window logic for variable-window problems.', fix: 'Fixed: slide with exact k. Variable: expand while valid, shrink while invalid. The two are different templates.' },
  ],
  interview: {
    questions: [
      'Longest substring without repeating characters.',
      'Longest substring with at most k distinct characters.',
      'Minimum window substring — hard variant.',
      'Permutation in string — fixed-window anagram check.',
      'Maximum sum subarray of size k — fixed window.',
      'Longest subarray with sum ≤ k.',
    ],
    observations: [
      'The pattern is always: add to state, check validity, shrink, record.',
      'For "at most k" problems, the state is usually a frequency map.',
      'For "sum" problems, the state is a single number.',
      'Fixed-size window: exact k adds before first removal.',
    ],
    optimizations: [
      'For small alphabets, use int[26] instead of a hash map.',
      'For "unique characters", jump left directly to last_seen[c] + 1 — no while loop needed.',
      'For "minimum window", use matched-count to avoid scanning the freq map on every step.',
    ],
    followUps: [
      'What if the array has duplicates? — the freq map tracks them; the window is still contiguous.',
      'What if the condition is "exactly k"? — compute "at most k" minus "at most k-1".',
      'What if the array is circular? — concatenate or handle wraparound explicitly.',
    ],
  },
  related: [
    { id: 'arrays', relation: 'Sliding window operates on contiguous array segments' },
    { id: 'two-pointers', relation: 'Both use forward pointers; sliding window tracks a window state' },
    { id: 'hash-maps', relation: 'Frequency maps inside the window are hash maps' },
    { id: 'binary-search', relation: 'Binary search on the window size — alternative approach for some problems' },
  ],
  practice: [
    { title: 'Maximum Average Subarray I', difficulty: 'Easy', why: 'Fixed-size window sum — the simplest template.' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', why: 'Variable window with a "seen" map; jump left for O(n).' },
    { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', why: 'Window tracks max freq; shrink when window - maxfreq > k.' },
    { title: 'Permutation in String', difficulty: 'Medium', why: 'Fixed-window anagram check — two frequency maps.' },
    { title: 'Minimum Window Substring', difficulty: 'Hard', why: 'The hard variant — track matched characters, shrink aggressively.' },
    { title: 'Sliding Window Maximum', difficulty: 'Hard', why: 'Monotonic deque variant of sliding window.' },
  ],
  revision: {
    takeaways: [
      'Two pointers forward; each element enters + exits once → O(n).',
      'Window is [left, right] INCLUSIVE. Length = right - left + 1.',
      'Expand right, shrink left while invalid.',
      'Fixed-size: slide exactly k. Variable: shrink based on property.',
      'Negative numbers break sum-based sliding windows.',
    ],
    formulas: [
      'length = right - left + 1',
      'Fixed window: after first k elements, each step does add a[right], remove a[right - k]',
      'Longest with sum ≤ S: shrink while sum > S',
      'Shortest with sum ≥ S: shrink while sum ≥ S, record, then shrink once more',
    ],
    complexitySummary: 'O(n) time, O(1) for sums, O(k) for freq maps. Each element enters once and exits once.',
    patterns: ['Contiguous subarray with property', 'At most k distinct', 'Sum constraint', 'Fixed size k', 'Minimum window containing T'],
    memoryTrick: 'Grow right, shrink left, record window length. Two pointers never go back → O(n).',
  },
};
