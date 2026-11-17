import type { ConceptDetail } from '../../types';

export const twoPointersDetail: ConceptDetail = {
  id: 'two-pointers',
  overview: {
    essence:
      'Two indices move based on a comparison. Each pointer travels at most n steps, so the pair-check that would be O(n²) becomes O(n).',
    what: 'Two indices i and j into an array. At each step, one of them moves based on a comparison, until they meet or one passes the other.',
    problemSolved:
      'Naive pair-check is O(n²) — for every i, scan all j. Sortedness lets one comparison rule out a whole side.',
    whyImportant:
      'Every "sorted array + find a pair" problem has an O(n) two-pointer solution. Every in-place reverse/remove/merge problem uses two pointers. It is the workhorse of O(1)-space array manipulation.',
    usedIn: [
      'Sorted pair-sum',
      'Palindrome check',
      'Remove duplicates from sorted array',
      'Merge two sorted arrays',
      'Container with most water',
      'Trapping rain water',
      'In-place reversal',
    ],
  },
  intuition: {
    explanation:
      'Sortedness gives you a comparison that eliminates an entire side. If a[lo] + a[hi] < target, every pair with lo as the left index is too small — you must move lo. If it is too large, every pair with hi as the right index is too large — move hi. One comparison, one eliminated side, one pointer moves. Both pointers advance monotonically, so total work is O(n).',
    analogy:
      'Two bookmarks, one from the front, one from the back of a book. You move the front one forward when the current page is too early, the back one backward when it is too late. You meet in the middle — never rescan.',
  },
  internals: [
    { title: 'Two variants', body: 'Converging (opposite ends → meet in middle) vs. tandem (both move forward at different rates — fast/slow).' },
    { title: 'Converging for sorted pairs', body: 'lo = 0, hi = n-1. If a[lo]+a[hi] < target, lo++; if > target, hi--; if ==, return.' },
    { title: 'Fast/slow for cycle detection', body: 'slow moves 1, fast moves 2. If there is a cycle, fast laps slow. Floyd’s tortoise-and-hare.' },
    { title: 'Read/write pointers', body: 'For remove-duplicates or move-zeroes: write index w and read index r. r scans; w writes non-zero elements.' },
    { title: 'In-place reverse', body: 'Swap a[lo] and a[hi], then lo++ and hi--. Terminates when lo ≥ hi.' },
    { title: 'Why monotone advance is required', body: 'If a pointer could move backward, you might revisit eliminated candidates — O(n²) returns.' },
  ],
  visual: {
    vizId: 'two-pointers',
    caption:
      'Sorted array + target sum. Watch lo advance when the current sum is too small, hi retreat when too large. Each pointer advances at most n times.',
  },
  approach: {
    summary:
      'Sort if needed. Start lo at 0 and hi at n−1. Compare a[lo]+a[hi] with target and advance one pointer per step based on the comparison.',
    steps: [
      'If the input is not sorted and order does not matter, sort it first — O(n log n).',
      'lo = 0, hi = n - 1.',
      'While lo < hi: compute sum = a[lo] + a[hi].',
      'If sum == target, record the pair (lo, hi).',
      'If sum < target, lo++ (need a larger value).',
      'If sum > target, hi-- (need a smaller value).',
    ],
    template: {
      code:
        'lo, hi = 0, len(a) - 1\n' +
        'while lo < hi:\n' +
        '    s = a[lo] + a[hi]\n' +
        '    if s == target: return [lo, hi]\n' +
        '    if s < target:  lo += 1\n' +
        '    else:           hi -= 1\n' +
        'return None',
      notes: ['Each iteration moves exactly one pointer. Both pointers converge, so total work is O(n).'],
    },
  },
  code: {
    python: {
      code:
        'def two_sum_sorted(a, target):\n' +
        '    lo, hi = 0, len(a) - 1\n' +
        '    while lo < hi:\n' +
        '        s = a[lo] + a[hi]\n' +
        '        if s == target:\n' +
        '            return [lo, hi]\n' +
        '        if s < target:\n' +
        '            lo += 1\n' +
        '        else:\n' +
        '            hi -= 1\n' +
        '    return None\n' +
        '\n' +
        'def is_palindrome(s):\n' +
        '    lo, hi = 0, len(s) - 1\n' +
        '    while lo < hi:\n' +
        '        if s[lo] != s[hi]: return False\n' +
        '        lo += 1; hi -= 1\n' +
        '    return True\n' +
        '\n' +
        'def remove_duplicates(a):\n' +
        '    if not a: return 0\n' +
        '    w = 1\n' +
        '    for r in range(1, len(a)):\n' +
        '        if a[r] != a[w - 1]:\n' +
        '            a[w] = a[r]\n' +
        '            w += 1\n' +
        '    return w',
      notes: ['Read pointer r scans; write pointer w tracks the last unique position.'],
    },
    java: {
      code:
        'int[] twoSumSorted(int[] a, int target) {\n' +
        '    int lo = 0, hi = a.length - 1;\n' +
        '    while (lo < hi) {\n' +
        '        int s = a[lo] + a[hi];\n' +
        '        if (s == target) return new int[]{lo, hi};\n' +
        '        if (s < target) lo++;\n' +
        '        else hi--;\n' +
        '    }\n' +
        '    return new int[]{};\n' +
        '}\n' +
        '\n' +
        'boolean isPalindrome(String s) {\n' +
        '    int lo = 0, hi = s.length() - 1;\n' +
        '    while (lo < hi) {\n' +
        '        if (s.charAt(lo) != s.charAt(hi)) return false;\n' +
        '        lo++; hi--;\n' +
        '    }\n' +
        '    return true;\n' +
        '}\n' +
        '\n' +
        'int removeDuplicates(int[] a) {\n' +
        '    if (a.length == 0) return 0;\n' +
        '    int w = 1;\n' +
        '    for (int r = 1; r < a.length; r++) {\n' +
        '        if (a[r] != a[w - 1]) a[w++] = a[r];\n' +
        '    }\n' +
        '    return w;\n' +
        '}',
      notes: ['Integer overflow risk when summing two large ints — cast to long if needed.'],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '#include <string>\n' +
        '\n' +
        'std::pair<int,int> two_sum_sorted(const std::vector<int>& a, int target) {\n' +
        '    int lo = 0, hi = (int)a.size() - 1;\n' +
        '    while (lo < hi) {\n' +
        '        int s = a[lo] + a[hi];\n' +
        '        if (s == target) return {lo, hi};\n' +
        '        if (s < target) lo++;\n' +
        '        else hi--;\n' +
        '    }\n' +
        '    return {-1, -1};\n' +
        '}\n' +
        '\n' +
        'bool is_palindrome(const std::string& s) {\n' +
        '    int lo = 0, hi = (int)s.size() - 1;\n' +
        '    while (lo < hi) {\n' +
        '        if (s[lo] != s[hi]) return false;\n' +
        '        lo++; hi--;\n' +
        '    }\n' +
        '    return true;\n' +
        '}\n' +
        '\n' +
        'int remove_duplicates(std::vector<int>& a) {\n' +
        '    if (a.empty()) return 0;\n' +
        '    int w = 1;\n' +
        '    for (int r = 1; r < (int)a.size(); r++)\n' +
        '        if (a[r] != a[w - 1]) a[w++] = a[r];\n' +
        '    return w;\n' +
        '}',
      notes: ['std::pair for returning two indices. No exceptions — return {-1,-1} on not-found.'],
    },
  },
  languageNotes: [
    'Python: negative indices are valid — a[-1] is the last element. Be careful with lo/hi if you are used to C-style.',
    'Java: comparing Integer objects with == compares references. Use .equals for values.',
    'C++: signed/unsigned mismatch on size() (returns size_t). Cast to int when subtracting.',
  ],
  complexity: {
    best: 'O(1) — first comparison hits the answer',
    average: 'O(n) — pointers converge',
    worst: 'O(n) — pointers traverse the full array',
    auxiliary: 'O(1)',
    total: 'O(n) time, O(1) space (plus O(n log n) if you had to sort first)',
    why: [
      { label: 'O(n) time', reason: 'Each iteration moves exactly one pointer. Both start n apart and meet in the middle — at most n steps total.' },
      { label: 'O(1) space', reason: 'Only lo, hi, and a temp variable. No extra data structures.' },
      { label: 'Sorting adds O(n log n)', reason: 'If the input is not sorted and order does not matter, sorting dominates. If order matters, two-pointer may not apply.' },
    ],
  },
  dryRun: {
    input: 'a = [1, 2, 4, 7, 11, 15], target = 9',
    initialState: 'lo = 0, hi = 5',
    steps: [
      { step: '1', state: 'a[0]+a[5] = 1+15 = 16 > 9 → hi--', note: 'Too large, move hi left.' },
      { step: '2', state: 'a[0]+a[4] = 1+11 = 12 > 9 → hi--', note: 'Still too large.' },
      { step: '3', state: 'a[0]+a[3] = 1+7 = 8 < 9 → lo++', note: 'Too small, move lo right.' },
      { step: '4', state: 'a[1]+a[3] = 2+7 = 9 == target → return [1, 3]', note: 'Found.' },
    ],
    output: '[1, 3]',
  },
  whenToUse: [
    'Sorted array + find a pair with a given sum.',
    'Palindrome check.',
    'Remove duplicates from sorted array.',
    'Merge two sorted arrays (or merge step of merge sort).',
    'Container with most water — move the shorter side inward.',
    'Trapping rain water — two pointers tracking left-max and right-max.',
    'Any in-place transformation that uses O(1) extra space.',
  ],
  whenNotToUse: [
    'Unsorted array + find pair — sort first (O(n log n)) or use a hash map (O(n) time, O(n) space).',
    'Sliding window problems — that is the sliding-window variant, not converging two-pointer.',
    'When you need all pairs (not just one) — two-pointer finds one; for all, nested loops or a different pattern.',
  ],
  mistakes: [
    { mistake: 'Neither pointer moves → infinite loop.', fix: 'Ensure every iteration changes lo OR hi. Both must not stay the same.' },
    { mistake: 'Wrong comparison direction.', fix: 'If sum < target, move lo RIGHT (need bigger). If sum > target, move hi LEFT. Getting this backwards breaks the algorithm.' },
    { mistake: 'Using <= in the loop condition when searching for a pair.', fix: 'Two elements must be distinct → use `while lo < hi`. If you allow the same element to pair with itself (rare), you would use <=, but that changes the semantics.' },
    { mistake: 'Forgetting the array must be sorted for pair-sum.', fix: 'Sort first, or use a hash map. Two-pointer on unsorted data does not work.' },
    { mistake: 'Overflow when summing large integers.', fix: 'In Java/C++, use long. Python does not overflow but is slower.' },
  ],
  interview: {
    questions: [
      'Two Sum II — sorted array.',
      'Valid Palindrome (with punctuation filtering).',
      'Remove Duplicates from Sorted Array.',
      'Container With Most Water.',
      'Trapping Rain Water — hard variant.',
      '3Sum — two-pointer nested inside a sort.',
    ],
    observations: [
      'Sorted input is the signal. If unsorted, either sort (O(n log n)) or use a hash map (O(n) space).',
      'Each pointer moves monotonically — that is why the total is O(n) and not O(n²).',
      'For k-sum, sort then fix one element and two-pointer the rest — O(n^(k-1)).',
    ],
    optimizations: [
      'If the array has duplicates (3Sum), skip duplicates by advancing lo/hi while equal.',
      'Pre-filter punctuation/whitespace in O(n) before the two-pointer pass for palindromes.',
    ],
    followUps: [
      'What if the array has duplicates and you need all unique pairs? — skip duplicates on both sides.',
      'What if you need the count, not the pair? — count all matching pairs; still O(n) with skip-duplicate logic.',
      'What if the array is 3D? — no direct two-pointer; reduce dimension by fixing some axes.',
    ],
  },
  related: [
    { id: 'arrays', relation: 'Two pointers operate on arrays' },
    { id: 'binary-search', relation: 'Both shrink the search space per step' },
    { id: 'recursion', relation: 'Two-pointer problems can be viewed recursively' },
  ],
  practice: [
    { title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', why: 'The canonical two-pointer pair-sum problem.' },
    { title: 'Valid Palindrome', difficulty: 'Easy', why: 'Converging pointers with character filtering.' },
    { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', why: 'Read/write pointer in-place transformation.' },
    { title: 'Container With Most Water', difficulty: 'Medium', why: 'Move the shorter side — proof that no better pair is skipped.' },
    { title: '3Sum', difficulty: 'Medium', why: 'Sort + fix one element + two-pointer on the rest.' },
    { title: 'Trapping Rain Water', difficulty: 'Hard', why: 'Two pointers tracking left-max and right-max.' },
  ],
  revision: {
    takeaways: [
      'One pointer moves per step → total O(n).',
      'Sortedness is the enabler for pair-sum.',
      'Converging for pairs/reverse/palindrome; tandem for cycles and merge.',
      'Overflow risk in fixed-width languages — cast to long.',
    ],
    formulas: [
      'Pair sum: if a[lo]+a[hi] < target → lo++; if > → hi--; else return [lo, hi]',
      'Window length = hi - lo + 1',
      'Reverse in place: swap lo, hi; lo++; hi--',
    ],
    complexitySummary: 'O(n) time, O(1) space. O(n log n) if sorting needed. No extra data structure.',
    patterns: ['Sorted pair-sum', 'Palindrome', 'Remove duplicates', 'Merge two sorted', 'Water containers'],
    memoryTrick: 'Sum too small → move lo right. Too big → move hi left. Each pointer advances ≤ n times.',
  },
};
