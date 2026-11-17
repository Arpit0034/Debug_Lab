import type { ConceptDetail } from '../../types';

export const hashMapsDetail: ConceptDetail = {
  id: 'hash-maps',
  overview: {
    essence: 'A hash map answers "have I seen this?" in average O(1). Every O(n²) pair-finding loop is a candidate to become O(n) with one map.',
    what: 'A key-value store that uses a hash function to map keys to buckets. Average O(1) for lookup, insert, and delete.',
    problemSolved: 'Linear scan for a key is O(n). A hash function jumps straight to the bucket, bypassing the scan.',
    whyImportant:
      'Almost every "find a pair", "count frequencies", or "group elements" problem is O(n²) naively and O(n) with a hash map. It is the single most common optimisation in interview problems.',
    usedIn: [
      'Frequency counting',
      'Deduplication',
      'Pair finding (Two Sum)',
      'Grouping anagrams / bucket by computed key',
      'Memoization in DP and caching',
      'Graph adjacency representation',
    ],
  },
  intuition: {
    explanation:
      'A hash function converts a key into an integer. That integer indexes a bucket. Lookup recomputes the hash, goes to the bucket, and finds the value. Since the hash is arithmetic, the traversal is eliminated. Collisions (two keys mapping to the same bucket) are handled by chaining (a list per bucket) or open addressing (probe for the next free slot).',
    analogy:
      'A filing cabinet indexed by a hash of the label. To find "apple", compute its hash, go to drawer 42, and read the card there. You never search drawer by drawer.',
  },
  internals: [
    { title: 'Hash function', body: 'Maps each key to an integer in [0, capacity). Same key → same hash, always.' },
    { title: 'Buckets', body: 'An array of capacity slots. Each slot holds 0, 1, or more entries.' },
    { title: 'Collision handling', body: 'Chaining: each bucket holds a list. Open addressing: probe to the next slot. Python, Java, and C++ all use chaining (Java switches to a red-black tree at ≥8 collisions in one bucket).' },
    { title: 'Load factor', body: 'Load = entries / capacity. When load exceeds ~0.75, capacity doubles and every key is rehashed — O(n) once, amortized across operations.' },
    { title: 'Iteration order', body: 'Not guaranteed in Python <3.7 (insertion order since). Java HashMap has no order; use LinkedHashMap for insertion order. C++ unordered_map has no order.' },
  ],
  visual: {
    diagram:
      'buckets:  [0] → None\n' +
      '          [1] → ("apple", 3) → ("banana", 1)\n' +
      '          [2] → None\n' +
      '          [3] → ("cherry", 5)\n' +
      '          [4] → None\n' +
      '\n' +
      '  hash("apple")  = 1  → bucket 1\n' +
      '  hash("banana") = 1  → bucket 1 (collision → chained)\n' +
      '  hash("cherry") = 3  → bucket 3\n' +
      '\n' +
      '  get("apple"):  hash → 1, walk chain → found',
    caption: 'Chained buckets. Collisions live in the same bucket as a list.',
  },
  approach: {
    summary: 'Convert the O(n) scan into an O(1) hash lookup by storing what you have already seen. Two patterns: single pass with "seen" map, or two-pass count then query.',
    steps: [
      'Identify the inner loop: "for each x, check if target exists in the rest".',
      'Instead of scanning the rest, store the rest in a hash map as you go.',
      'For each element: check the map, then add the element to the map.',
      'Both operations are O(1) average → total O(n).',
    ],
    template: {
      code:
        'seen = {}\n' +
        'for i, x in enumerate(nums):\n' +
        '    need = target - x\n' +
        '    if need in seen:\n' +
        '        return [seen[need], i]\n' +
        '    seen[x] = i\n' +
        'return []',
      notes: ['Single-pass: check first, then insert — this naturally excludes self-pairing.'],
    },
  },
  code: {
    python: {
      code:
        'def two_sum(nums, target):\n' +
        '    seen = {}\n' +
        '    for i, x in enumerate(nums):\n' +
        '        need = target - x\n' +
        '        if need in seen:\n' +
        '            return [seen[need], i]\n' +
        '        seen[x] = i\n' +
        '    return []\n' +
        '\n' +
        '# Frequency counting\n' +
        'from collections import Counter\n' +
        'freq = Counter("hello")\n' +
        '# freq == Counter({"l": 2, "h": 1, "e": 1, "o": 1})\n' +
        '\n' +
        '# Group by key\n' +
        'groups = {}\n' +
        'for word in ["eat", "tea", "tan", "ate"]:\n' +
        '    key = "".join(sorted(word))\n' +
        '    groups.setdefault(key, []).append(word)',
      notes: ['dict and collections.Counter are hash maps.', 'Iteration order is insertion order since Python 3.7.'],
    },
    java: {
      code:
        'int[] twoSum(int[] nums, int target) {\n' +
        '    java.util.Map<Integer, Integer> seen = new java.util.HashMap<>();\n' +
        '    for (int i = 0; i < nums.length; i++) {\n' +
        '        int need = target - nums[i];\n' +
        '        if (seen.containsKey(need)) return new int[]{seen.get(need), i};\n' +
        '        seen.put(nums[i], i);\n' +
        '    }\n' +
        '    return new int[]{};\n' +
        '}\n' +
        '\n' +
        '// Frequency counting\n' +
        'java.util.Map<Character, Integer> freq = new java.util.HashMap<>();\n' +
        'for (char c : "hello".toCharArray()) freq.merge(c, 1, Integer::sum);\n' +
        '\n' +
        '// Group by key\n' +
        'java.util.Map<String, java.util.List<String>> groups = new java.util.HashMap<>();\n' +
        'for (String w : new String[]{"eat", "tea"}) {\n' +
        '    char[] cs = w.toCharArray(); java.util.Arrays.sort(cs);\n' +
        '    groups.computeIfAbsent(new String(cs), k -> new java.util.ArrayList<>()).add(w);\n' +
        '}',
      notes: ['HashMap does not preserve insertion order. Use LinkedHashMap for that, TreeMap for sorted keys.'],
    },
    cpp: {
      code:
        '#include <unordered_map>\n' +
        '#include <vector>\n' +
        '#include <string>\n' +
        '\n' +
        'std::vector<int> two_sum(const std::vector<int>& nums, int target) {\n' +
        '    std::unordered_map<int, int> seen;\n' +
        '    for (int i = 0; i < (int)nums.size(); i++) {\n' +
        '        int need = target - nums[i];\n' +
        '        auto it = seen.find(need);\n' +
        '        if (it != seen.end()) return {it->second, i};\n' +
        '        seen[nums[i]] = i;\n' +
        '    }\n' +
        '    return {};\n' +
        '}\n' +
        '\n' +
        '// Frequency counting\n' +
        'std::unordered_map<char, int> freq;\n' +
        'for (char c : std::string("hello")) freq[c]++;\n' +
        '\n' +
        '// std::map is a red-black tree (O(log n) ops, sorted). Use unordered_map for O(1).',
      notes: ['std::unordered_map is the hash map. std::map is a balanced BST.'],
    },
  },
  languageNotes: [
    'Python dict keys must be hashable — lists and dicts are not. Convert to tuples or frozensets.',
    'Java HashMap permits one null key. ConcurrentHashMap does not.',
    'C++ unordered_map iteration order is unspecified and may vary between runs.',
  ],
  complexity: {
    best: 'O(1) per op',
    average: 'O(1) per op',
    worst: 'O(n) per op (all keys collide)',
    auxiliary: 'O(n) — one entry per key',
    total: 'O(n) space, O(1) average per operation',
    why: [
      { label: 'Average O(1)', reason: 'A good hash function distributes keys evenly. Each bucket holds O(1) entries on average, so the chain walk is O(1).' },
      { label: 'Worst O(n)', reason: 'If every key hashes to the same bucket, the chain has n entries and each lookup is O(n).' },
      { label: 'Amortized resize', reason: 'When load factor exceeds ~0.75, capacity doubles and every key is rehashed. This costs O(n) once, but across n insertions it is amortized O(1).' },
    ],
  },
  dryRun: {
    input: 'nums = [2, 7, 11, 15], target = 9',
    initialState: 'seen = {}, i = 0',
    steps: [
      { step: '1', state: 'i=0, x=2, need=7, 7∉seen → seen={2:0}', note: 'No match yet, insert 2.' },
      { step: '2', state: 'i=1, x=7, need=2, 2∈seen → return [0, 1]', note: 'Match found.' },
    ],
    output: '[0, 1]',
  },
  whenToUse: [
    'You need "have I seen this?" — deduplication, cycle detection, visited sets.',
    'You need frequencies — counting occurrences.',
    'You need pair-finding with a target sum (Two Sum).',
    'You need grouping by a computed key (anagrams).',
    'You need memoization — DP subproblem cache.',
    'You need O(1) lookup without ordering.',
  ],
  whenNotToUse: [
    'You need ordered iteration — use a balanced BST or sort.',
    'You need range queries — sorted array + binary search, or a tree.',
    'Keys are large or expensive to hash — sorted structure may win.',
    'Adversarial input — attacker-controlled keys can force worst-case O(n) lookups (hash flooding).',
  ],
  mistakes: [
    { mistake: 'Using unhashable keys (list, dict).', fix: 'Convert to tuple / frozenset before using as a key.' },
    { mistake: 'Mutating a dict while iterating over it.', fix: 'Iterate over a copy (dict.items() returns a view in Python 3) or build a new dict.' },
    { mistake: 'Assuming iteration order.', fix: 'In Python ≥3.7, dict preserves insertion order. In Java/C++, it is unspecified. Never rely on it unless the language guarantees it.' },
    { mistake: 'Using map[key] on a missing key in Python.', fix: 'Use dict.get(key, default) or "key in dict" check. dict[key] raises KeyError.' },
    { mistake: 'Forgetting to update the count when replacing.', fix: 'For counters, use collections.Counter or map.merge(key, 1, sum) in Java.' },
  ],
  interview: {
    questions: [
      'Two Sum — the classic hash map application.',
      'Group Anagrams — key is the sorted word.',
      'Longest Consecutive Sequence — hash set + check if n-1 exists.',
      'Subarray Sum Equals K — prefix sum + hash map.',
      'LRU Cache — hash map + doubly linked list.',
    ],
    observations: [
      'The hash map is the single most common optimisation in interview problems.',
      '"Can I trade space for time?" almost always means "can I use a hash map?".',
      'When you see nested loops over the same array, look for a complement lookup.',
    ],
    optimizations: [
      'Use a hash set (not map) when you only need existence, not the index or value.',
      'Sort + two-pointer beats hash map if you cannot afford O(n) extra space.',
      'For small n (say < 100), a linear scan may be faster than hashing due to constants.',
    ],
    followUps: [
      'What if you cannot use extra space? — sort in place (O(n log n)), two-pointer.',
      'What if there are duplicates and you need distinct pairs? — hash set with canonical ordering.',
      'What if the answer must preserve input order? — store insertion order (Python dict, LinkedHashMap).',
    ],
  },
  related: [
    { id: 'arrays', relation: 'Hash map is often used on array input for lookups' },
    { id: 'binary-search', relation: 'Ordered map / BST alternative when you need sorted iteration' },
  ],
  practice: [
    { title: 'Two Sum', difficulty: 'Easy', why: 'The canonical hash map application — O(n) with a seen map.' },
    { title: 'Valid Anagram', difficulty: 'Easy', why: 'Frequency counter — hash map or Counter.' },
    { title: 'Group Anagrams', difficulty: 'Medium', why: 'Group by computed key (sorted word or char-count signature).' },
    { title: 'Longest Consecutive Sequence', difficulty: 'Medium', why: 'Hash set + O(1) neighbour lookup.' },
    { title: 'Subarray Sum Equals K', difficulty: 'Medium', why: 'Prefix sums stored in a hash map — the "count subarrays with sum" pattern.' },
  ],
  revision: {
    takeaways: [
      'Hash map: O(1) average lookup — the fastest "have I seen this?".',
      'Collisions handled by chaining or open addressing.',
      'Load factor triggers resize — amortized O(1) across all operations.',
      'Iteration order is not guaranteed unless the language says so.',
    ],
    formulas: [
      'load_factor = entries / capacity; resize when > 0.75',
      'hash(key) → bucket index → chain walk → find or not',
    ],
    complexitySummary: 'O(1) average for get / put / delete. O(n) worst case. O(n) space.',
    patterns: ['Have I seen this', 'Frequency count', 'Pair sum via complement', 'Group by key', 'Cache / memo'],
    memoryTrick: 'Every "find a pair" loop is a hash map waiting to happen. Compute, don\'t scan.',
  },
};
