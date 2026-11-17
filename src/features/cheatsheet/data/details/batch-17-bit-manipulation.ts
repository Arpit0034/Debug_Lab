import type { ConceptDetail } from '../../types';

export const bitManipulationDetail: ConceptDetail = {
  id: 'bit-manipulation',
  overview: {
    essence:
      'Every integer is bits. XOR is the star: x ^ x = 0, x ^ 0 = x, and XOR is its own inverse — so pairs cancel. Most bit tricks build on this one property.',
    what:
      'Direct operations on the binary representation of integers: AND, OR, XOR, NOT, shift left/right. Each is O(1) on 64-bit words.',
    problemSolved:
      'Solving problems where the answer depends on parity, uniqueness, subsets, or bit patterns — often in O(n) or O(1) space instead of O(n²) or O(n·2^n).',
    whyImportant:
      'XOR uniqueness (find the single number), bitmask DP (subset enumeration), efficient set representation (n ≤ 64), power-of-two checks, and popcount all rely on bits.',
    usedIn: [
      'Find single number in an array of pairs',
      'Count set bits (popcount)',
      'Power-of-two check',
      'Subset enumeration via bitmask DP',
      'XOR prefix / subarray XOR',
      'Bitmask graph state (visited sets for n ≤ 20)',
      'Gray code',
    ],
  },
  intuition: {
    explanation:
      'Treat an integer as an array of bits. Every bit position is independent. AND clears bits (x & mask), OR sets bits (x | mask), XOR flips bits (x ^ mask). Shifts move bits left/right. XOR uniqueness: if two equal numbers cancel to 0, then in an array where every element appears twice except one, XOR of all elements leaves that one. XOR is commutative and associative, so order does not matter. Same idea for bitmask DP: state = subset, transitions = add/remove bit.',
    analogy:
      'A row of light switches. AND = both on. OR = at least one on. XOR = exactly one on. Shifts = move all switches left or right, dropping overflow bits.',
  },
  internals: [
    { title: 'AND (x & y)', body: 'Bit is 1 iff both are 1. Common use: x & (x-1) clears the lowest set bit. x & -x isolates the lowest set bit.' },
    { title: 'OR (x | y)', body: 'Bit is 1 iff either is 1. Common use: x | mask sets specific bits.' },
    { title: 'XOR (x ^ y)', body: 'Bit is 1 iff exactly one is 1. Common use: x ^ x = 0, x ^ 0 = x, XOR is self-inverse.' },
    { title: 'NOT (~x)', body: 'Flips all bits. In two\'s complement, ~x = -x - 1. Usually used with a mask: x & ~mask clears bits in mask.' },
    { title: 'Shifts', body: 'x << k multiplies by 2^k. x >> k divides by 2^k (floor for positive). Left shift by 32 on 32-bit ints can be undefined in some languages.' },
    { title: 'popcount', body: 'Number of set bits. brian_kernighan: while x: x &= x - 1; count++. O(popcount), or O(1) with hardware popcnt.' },
    { title: 'Bitmask enumeration', body: 'Enumerate all 2^n subsets by iterating m from 0 to 2^n-1. Bit i set means element i is in the subset.' },
  ],
  visual: {
    diagram:
      'x = 12  = 1100\n' +
      'y = 10  = 1010\n' +
      '\n' +
      'AND: 1100 & 1010 = 1000 = 8     (both on)\n' +
      'OR:  1100 | 1010 = 1110 = 14    (either on)\n' +
      'XOR: 1100 ^ 1010 = 0110 = 6     (exactly one)\n' +
      '\n' +
      'x & (x-1)  clears the lowest set bit:\n' +
      '  12 = 1100\n' +
      '  11 = 1011\n' +
      '  AND = 1000 = 8  (removed the lowest bit)\n' +
      '\n' +
      'x & -x  isolates the lowest set bit:\n' +
      '  12 & -12 = 4 = 0100  (only the lowest bit)\n' +
      '\n' +
      'XOR cancellation:\n' +
      '  5 ^ 5 = 0,  5 ^ 0 = 5,  (5 ^ 7 ^ 5) = 7',
    caption: 'AND clears, OR sets, XOR flips. Two tricks: x&(x-1) clears low bit; x&-x isolates it.',
  },
  approach: {
    summary:
      'Detect the pattern: pairs (→ XOR), subsets (→ bitmask), bit count (→ popcount), power of 2 (→ x&(x-1) == 0), lowest set bit (→ x&-x). Then reason about parity and independence of bit positions.',
    steps: [
      'Pairs / cancellation → XOR everything.',
      'Power of 2 → x > 0 and (x & (x-1)) == 0.',
      'Count set bits → while x: x &= x-1; count++.',
      'Lowest set bit → x & -x.',
      'Enumerate subsets of n ≤ 20 elements → loop m in 0..2^n-1, bit i set means element i is in.',
      'State compression → integer per bitmask; use as DP state or visited set.',
    ],
    template: {
      code:
        '# Find the single number (all others appear twice)\n' +
        'def single_number(nums):\n' +
        '    result = 0\n' +
        '    for n in nums:\n' +
        '        result ^= n\n' +
        '    return result\n' +
        '\n' +
        '# Count set bits\n' +
        'def popcount(x):\n' +
        '    count = 0\n' +
        '    while x:\n' +
        '        x &= x - 1\n' +
        '        count += 1\n' +
        '    return count\n' +
        '\n' +
        '# Is power of 2?\n' +
        'def is_power_of_two(x):\n' +
        '    return x > 0 and (x & (x - 1)) == 0',
      notes: ['The XOR single-number trick is the canonical interview example.'],
    },
  },
  code: {
    python: {
      code:
        'def single_number(nums):\n' +
        '    result = 0\n' +
        '    for n in nums:\n' +
        '        result ^= n\n' +
        '    return result\n' +
        '\n' +
        'def count_bits(x):\n' +
        '    count = 0\n' +
        '    while x:\n' +
        '        x &= x - 1   # clears lowest set bit\n' +
        '        count += 1\n' +
        '    return count\n' +
        '\n' +
        'def is_power_of_two(x):\n' +
        '    return x > 0 and (x & (x - 1)) == 0\n' +
        '\n' +
        'def single_number_ii(nums):\n' +
        '    # Every element appears 3 times except one\n' +
        '    ones = twos = 0\n' +
        '    for n in nums:\n' +
        '        ones = (ones ^ n) & ~twos\n' +
        '        twos = (twos ^ n) & ~ones\n' +
        '    return ones\n' +
        '\n' +
        '# Subset enumeration\n' +
        'def all_subsets(nums):\n' +
        '    n = len(nums)\n' +
        '    result = []\n' +
        '    for mask in range(1 << n):\n' +
        '        subset = [nums[i] for i in range(n) if mask & (1 << i)]\n' +
        '        result.append(subset)\n' +
        '    return result',
      notes: [
        'Python integers are arbitrary precision — no overflow, but shifts can be slow on huge ints.',
        'single_number_ii: state machine on (ones, twos) tracks count mod 3.',
      ],
    },
    java: {
      code:
        'int singleNumber(int[] nums) {\n' +
        '    int r = 0;\n' +
        '    for (int n : nums) r ^= n;\n' +
        '    return r;\n' +
        '}\n' +
        '\n' +
        'int countBits(int x) {\n' +
        '    int count = 0;\n' +
        '    while (x != 0) {\n' +
        '        x &= x - 1;\n' +
        '        count++;\n' +
        '    }\n' +
        '    return count;\n' +
        '}\n' +
        '\n' +
        'boolean isPowerOfTwo(int x) {\n' +
        '    return x > 0 && (x & (x - 1)) == 0;\n' +
        '}\n' +
        '\n' +
        'int singleNumberII(int[] nums) {\n' +
        '    int ones = 0, twos = 0;\n' +
        '    for (int n : nums) {\n' +
        '        ones = (ones ^ n) & ~twos;\n' +
        '        twos = (twos ^ n) & ~ones;\n' +
        '    }\n' +
        '    return ones;\n' +
        '}',
      notes: [
        'Integer.MAX_VALUE + 1 wraps — use long if you need to be safe on shifts.',
        'Integer.bitCount(x) is O(1) via hardware POPCNT.',
      ],
    },
    cpp: {
      code:
        '#include <cstdint>\n' +
        '\n' +
        'int single_number(const int* nums, int n) {\n' +
        '    int r = 0;\n' +
        '    for (int i = 0; i < n; i++) r ^= nums[i];\n' +
        '    return r;\n' +
        '}\n' +
        '\n' +
        'int count_bits(uint32_t x) {\n' +
        '    int count = 0;\n' +
        '    while (x) { x &= x - 1; count++; }\n' +
        '    return count;\n' +
        '}\n' +
        '\n' +
        'bool is_power_of_two(int64_t x) {\n' +
        '    return x > 0 && (x & (x - 1)) == 0;\n' +
        '}\n' +
        '\n' +
        'int single_number_ii(const int* nums, int n) {\n' +
        '    int ones = 0, twos = 0;\n' +
        '    for (int i = 0; i < n; i++) {\n' +
        '        ones = (ones ^ nums[i]) & ~twos;\n' +
        '        twos = (twos ^ nums[i]) & ~ones;\n' +
        '    }\n' +
        '    return ones;\n' +
        '}',
      notes: [
        'Use unsigned types (uint32_t) to avoid UB on left shift of signed ints.',
        'std::popcount (C++20) is O(1) with hardware support.',
      ],
    },
  },
  languageNotes: [
    'Python: arbitrary precision — no overflow, but shift semantics differ (>> on negative is floor division).',
    'Java: signed 32/64-bit. Shifts of 32+ bits wrap modulo 32 (1 << 32 == 1). Use 1L << k for long.',
    'C++: use unsigned types for shifts to avoid undefined behaviour. Signed left shift of negative is UB.',
  ],
  complexity: {
    best: 'O(1) per bitwise op',
    average: 'O(1) per bitwise op',
    worst: 'O(1) per bitwise op',
    auxiliary: 'O(1)',
    total: 'O(1) per bit operation; O(n) for loops over array; O(2^n) for full bitmask enumeration',
    why: [
      { label: 'O(1) per op', reason: 'A single bitwise op on 64-bit ints is one CPU instruction.' },
      { label: 'O(popcount) to iterate set bits', reason: 'The x & (x-1) loop runs once per set bit, so total is O(popcount).' },
      { label: 'O(2^n) for bitmask enumeration', reason: 'Every subset is visited once. Even at n=20 that is ~1M, feasible; at n=30 it is 1B, not.' },
    ],
  },
  dryRun: {
    input: 'nums = [4, 1, 2, 1, 2]',
    initialState: 'result = 0',
    steps: [
      { step: '1', state: '0 ^ 4 = 4', note: 'result = 4' },
      { step: '2', state: '4 ^ 1 = 5', note: 'result = 5' },
      { step: '3', state: '5 ^ 2 = 7', note: 'result = 7' },
      { step: '4', state: '7 ^ 1 = 6', note: '1 cancels' },
      { step: '5', state: '6 ^ 2 = 4', note: '2 cancels. Final = 4' },
    ],
    output: '4',
  },
  whenToUse: [
    'All elements appear twice except one → XOR everything.',
    'All elements appear three times except one → two-state machine (ones, twos).',
    'Count set bits → x & (x-1) loop or hardware popcount.',
    'Power-of-two check → x & (x-1) == 0.',
    'Lowest set bit → x & -x.',
    'Subset enumeration → 2^n bitmask loop, n ≤ 20.',
    'State compression → bitmask as hash map key or DP state.',
  ],
  whenNotToUse: [
    'Plain counting works and n is small — bit tricks add complexity for no gain.',
    'n > 20 for bitmask DP — 2^n explodes.',
    'Readability matters more than speed — modern CPUs are fast.',
    'You need to manipulate non-integers — bit tricks do not apply.',
  ],
  mistakes: [
    { mistake: 'Using signed ints for left shift of negative numbers.', fix: 'Left shift of a negative signed int is UB in C++ and unspecified in some languages. Use unsigned types.' },
    { mistake: 'Shifting by 32+ bits on a 32-bit int.', fix: 'In Java this wraps modulo 32. In C++ it is UB. Use long / uint64_t for larger shifts.' },
    { mistake: 'Comparing x & (x-1) == 0 without x > 0.', fix: 'For x = 0, this expression returns true (0 is not a power of two). Add the x > 0 guard.' },
    { mistake: 'Forgetting that `~x` flips all bits including sign.', fix: 'In two\'s complement, ~x = -x - 1. Use x & ~mask to clear bits.' },
    { mistake: 'Using bit tricks when n is small enough for a hash map.', fix: 'Readability beats a 1-instruction saving when n is tiny. Reserve bit tricks for the right domain.' },
  ],
  interview: {
    questions: [
      'Single Number — find the one that appears once. XOR everything.',
      'Single Number II — every number appears 3 times except one. Two-state machine.',
      'Single Number III — two numbers appear once. XOR then partition by lowest set bit.',
      'Number of 1 Bits — popcount.',
      'Counting Bits — dp[i] = dp[i >> 1] + (i & 1).',
      'Reverse Bits — swap halves iteratively.',
      'Power of Two — x & (x-1) == 0.',
      'Subsets — 2^n bitmask enumeration.',
    ],
    observations: [
      'XOR cancellation is the single most important trick: pairs cancel, leftovers remain.',
      'x & (x-1) removes the lowest set bit — useful for popcount and for "is power of 2".',
      'Bitmask enumeration replaces recursion for subset problems with n ≤ 20.',
      'State compression (bitmask as int) is the fastest state for DP over subsets.',
    ],
    optimizations: [
      'Hardware popcount (POPCNT instruction) via Integer.bitCount / int.bit_count / std::popcount.',
      'Gray code iteration (i ^ (i >> 1)) visits subsets changing one bit at a time — efficient for TSP DP.',
      'For "single number III", partition by any set bit of the XOR to split into two groups.',
    ],
    followUps: [
      'What if there are two singles instead of one? — XOR all, partition by lowest set bit.',
      'What if elements appear K times? — K-state machine or reduce mod K per bit.',
      'What about negative numbers? — two\'s complement handles them, but watch the sign bit in shifts.',
    ],
  },
  related: [
    { id: 'arrays', relation: 'Bit tricks usually operate on integer arrays' },
  ],
  practice: [
    { title: 'Single Number', difficulty: 'Easy', why: 'The canonical XOR trick.' },
    { title: 'Number of 1 Bits', difficulty: 'Easy', why: 'x & (x-1) removes the lowest set bit — count until zero.' },
    { title: 'Counting Bits', difficulty: 'Easy', why: 'dp[i] = dp[i >> 1] + (i & 1).' },
    { title: 'Single Number II', difficulty: 'Medium', why: 'Two-state machine for "every element appears 3 times".' },
    { title: 'Single Number III', difficulty: 'Medium', why: 'XOR then partition by lowest set bit.' },
    { title: 'Subsets', difficulty: 'Medium', why: '2^n bitmask enumeration.' },
  ],
  revision: {
    takeaways: [
      'XOR is self-inverse: x ^ x = 0, x ^ 0 = x.',
      'x & (x-1) clears the lowest set bit.',
      'x & -x isolates the lowest set bit.',
      'Bitmask enumeration: 2^n loops, n ≤ 20.',
    ],
    formulas: [
      'x & (x-1) == 0  → x is a power of 2 (with x > 0)',
      'x & -x          → lowest set bit',
      'popcount        → iterate x &= x-1',
      'subset mask     → for m in range(1 << n)',
    ],
    complexitySummary: 'O(1) per bitwise op. O(popcount) to iterate bits. O(2^n) full subset enumeration.',
    patterns: ['XOR uniqueness', 'Popcount', 'Power of two', 'Subset enumeration', 'Bitmask DP'],
    memoryTrick: 'XOR pairs cancel. x&(x-1) clears low bit. 2^n for subsets.',
  },
};
