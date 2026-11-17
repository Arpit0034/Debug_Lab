import type { ConceptDetail } from "../../types";

export const bigOFamilyDetail: ConceptDetail = {
  id: "big-o-family",
  overview: {
    essence:
      'O is an upper bound, Ω a lower bound, Θ both. In interviews, "O(n log n)" usually means Θ(n log n).',
    what: "Asymptotic notation describes how an algorithm's runtime or memory grows with input size: O (upper bound), Ω (lower bound), Θ (tight bound).",
    problemSolved:
      "Compare algorithms without running them. Pick the right algorithm for the input size. Check feasibility before coding.",
    whyImportant:
      "Interviews expect it. A TLE (time limit exceeded) usually means the complexity is too high for the input size. A memory blowup usually means unaccounted extra space.",
    usedIn: [
      "Feasibility check before coding",
      "Comparing two algorithms",
      "Detecting TLE risk in a solution",
      "Detecting memory blowup",
    ],
  },
  intuition: {
    explanation:
      "Big-O drops constants and lower-order terms because they become negligible as n grows. Example: f(n) = 2n² + 100n + 5. At n=5, the 100n term dominates (500 vs 50). At n=100, the 2n² term dominates (20,000 vs 10,000). At n=1,000,000, the 2n² term is 2 trillion while 100n is only 100 million. The highest-order term always wins eventually. That's why we write O(n²).",
    analogy:
      "Big-O is a ceiling, Big-Ω a floor, Big-Θ a corridor between them. Multiplying the work by a constant (say 2n instead of n) stays in the same growth class. Changing the growth rate (n to n²) does not. Where it breaks down: the bound only has to hold for large n, so curves can cross at small n.",
  },
  internals: [
    {
      title: "Big-O (upper bound)",
      body: "f(n) = O(g(n)) means there exist constants c > 0 and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀. In words: for large n, f never grows faster than a constant multiple of g.",
    },
    {
      title: "Big-Ω (lower bound)",
      body: "f(n) = Ω(g(n)) means there exist constants c > 0 and n₀ such that f(n) ≥ c·g(n) for all n ≥ n₀. In words: for large n, f never grows slower than a constant multiple of g. Example: any comparison sort needs Ω(n log n) comparisons in the worst case.",
    },
    {
      title: "Big-Θ (tight bound)",
      body: "Θ means both O and Ω hold with the same g. This pins f to one growth rate, up to constants. Merge sort is Θ(n log n) in every case. Bubble sort is Θ(n²) in the worst case (its best case with an early-exit check is Θ(n)).",
    },
    {
      title: "Amortized O",
      body: "Amortized O(1) means any sequence of n operations costs O(n) in total, even though a single operation may cost O(n). This is a guaranteed worst-case bound over the sequence, not a probabilistic average. Dynamic array append is amortized O(1): the occasional expensive resize is paid for by many cheap appends.",
    },
    {
      title: "Space vs auxiliary space",
      body: "Total space = input memory + auxiliary memory. Auxiliary space is the extra memory beyond the input. Array-based merge sort uses O(n) auxiliary space; heap sort uses O(1).",
    },
  ],
  visual: {
    diagram:
      "Growth classes (n grows → faster growth):\n" +
      "\n" +
      "O(1)     — constant: hash lookup, array access\n" +
      "O(log n) — halving: binary search, tree height\n" +
      "O(n)     — linear: single pass\n" +
      'O(n log n)— sort + linear: merge sort, "sort then pass"\n' +
      "O(n²)    — pairwise: nested loops, all pairs\n" +
      "O(2^n)   — exponential: subset enumeration, naive recursion\n" +
      "O(n!)    — factorial: permutations\n" +
      "\n" +
      "n = 10^5 →  O(n²) = 10^10 times out. O(n log n) ≈ 1.7 × 10^6 is safe.\n" +
      "n = 10^6 →  O(n²) = 10^12 is impossible. O(n log n) ≈ 2 × 10^7 is fine.",
    caption: "Memorise the growth order. It is your feasibility map.",
  },
  approach: {
    summary:
      "Count loops: sequential loops add, nested loops multiply. For recursion, write T(n) = a·T(n/b) + f(n) and apply the Master Theorem.",
    steps: [
      "One loop over n → O(n); two nested over n → O(n²). If the inner loop runs m times, it is O(n·m).",
      "Recursion: T(n) = a·T(n/b) + f(n). a = number of calls, b = how much the input shrinks, f(n) = work outside the calls.",
      "Common recurrences: T(n) = T(n/2) + O(1) → log n. T(n) = 2T(n/2) + n (merge sort) → n log n. Two calls that each shrink n by 1, with no memo → exponential.",
      "Auxiliary space: count extra arrays, hash maps, and recursion depth beyond the input.",
      "Sanity check: ~10^8 simple operations/second is a rough heuristic for C++/Java; Python is about 10x slower.",
    ],
    template: {
      code:
        "# O(n)      — one loop\n" +
        "for x in a: pass\n" +
        "\n" +
        "# O(n²)     — nested loops\n" +
        "for x in a:\n" +
        "    for y in a: pass\n" +
        "\n" +
        "# O(log n)  — halving\n" +
        "while n > 1: n //= 2\n" +
        "\n" +
        "# O(n log n) — sort, or two halves with linear merge work (merge sort)",
      notes: [
        "Master theorem (basic form): T(n) = a·T(n/b) + n^d. Let c = log_b(a). If d < c → O(n^c). If d = c → O(n^d · log n). If d > c → O(n^d). Extended forms handle log factors.",
      ],
    },
  },
  code: {
    python: {
      code:
        "# Most common complexity classes you will see\n" +
        "\n" +
        "# O(1) — constant\n" +
        "def get(arr, i): return arr[i]\n" +
        "\n" +
        "# O(log n) — halving\n" +
        "def binary_search(a, t):\n" +
        "    lo, hi = 0, len(a) - 1\n" +
        "    while lo <= hi:\n" +
        "        mid = (lo + hi) // 2\n" +
        "        if a[mid] == t: return mid\n" +
        "        if a[mid] < t: lo = mid + 1\n" +
        "        else: hi = mid - 1\n" +
        "    return -1\n" +
        "\n" +
        "# O(n) — single pass\n" +
        "def max_of(a):\n" +
        "    m = a[0]\n" +
        "    for x in a: m = max(m, x)\n" +
        "    return m\n" +
        "\n" +
        "# O(n log n) — dominated by the sort\n" +
        "def sorted_unique(a):\n" +
        "    return sorted(set(a))\n" +
        "\n" +
        "# O(n²) — all pairs\n" +
        "def has_duplicate_pair(a):\n" +
        "    for i in range(len(a)):\n" +
        "        for j in range(i+1, len(a)):\n" +
        "            if a[i] == a[j]: return True\n" +
        "    return False\n" +
        "\n" +
        "# O(2^n) — the number of subsets doubles with every element\n" +
        "# (building all of them costs O(n · 2^n) in total)\n" +
        "def all_subsets(a):\n" +
        "    result = [[]]\n" +
        "    for x in a:\n" +
        "        result += [s + [x] for s in result]\n" +
        "    return result",
      notes: [
        "Rule of thumb: ~10^8 simple ops/sec for C++/Java; Python ~10^7. n=10^5 → O(n log n) is fine; O(n²) is not.",
        "Beginner mistake: expecting Big-O to predict actual runtime for small n. It only describes growth as n gets large.",
      ],
    },
  },
  complexity: {
    best: "Depends on the algorithm",
    average: "Depends on the algorithm",
    worst: "Depends on the algorithm",
    auxiliary: "Depends on the algorithm",
    total:
      "This concept describes other concepts — it does not have its own complexity",
    why: [
      { label: "O(1)", reason: "Constant — no loops or branching on n." },
      {
        label: "O(log n)",
        reason: "Halving per iteration. Binary search, balanced tree height.",
      },
      { label: "O(n)", reason: "One pass. Sequential access." },
      {
        label: "O(n log n)",
        reason: "log n levels × O(n) work per level. Sorting, merge step.",
      },
      { label: "O(n²)", reason: "Two nested loops over n. All pairs." },
      {
        label: "O(2^n)",
        reason: "Each element included or not. Subset enumeration.",
      },
      { label: "O(n!)", reason: "Every ordering. Permutation generation." },
    ],
  },
  dryRun: {
    input: "algorithm with n = 10^5 elements",
    initialState: "budget ≈ 10^8 ops per second",
    steps: [
      { step: "O(n) = 10^5", state: "well under budget", note: "Safe." },
      { step: "O(n log n) = 10^5 × 17", state: "≈ 1.7 × 10^6", note: "Safe." },
      { step: "O(n²) = 10^10", state: "100× over budget", note: "TLE." },
      {
        step: "O(2^n) = 2^100000",
        state: "astronomically large",
        note: "Not feasible.",
      },
    ],
    output:
      "At n=10^5, O(n log n) is comfortably safe; O(n²) or worse is not feasible.",
  },
  whenToUse: [
    'Before writing code — "can this fit the time limit?"',
    'After writing code — "does this loop nest make it O(n²)?"',
    'Comparing two approaches — "sort first or hash map?"',
    'Detecting memory blowup — "this DP table is O(n²) memory"',
  ],
  whenNotToUse: [
    "Small n — a plain scan of 5 elements can be faster than an O(1) hash lookup, because the hash has a bigger constant cost.",
    "Cache effects — sequential array access is very fast, so a linear scan of a small array can beat random memory lookups.",
    "You need exact time, not growth rate — profile instead.",
  ],
  mistakes: [
    {
      mistake: "Confusing O with Θ.",
      fix: 'O is only an upper bound, so any O(n) algorithm is also O(n!) — true but useless. In interviews "O(n log n)" almost always means Θ(n log n). Say Θ when you mean the tight bound.',
    },
    {
      mistake: "Thinking loop-body constants change Big-O.",
      fix: "Two nested loops over n = O(n²), regardless of what is inside. Three levels = O(n³). Constant factors do not change the growth class.",
    },
    {
      mistake: "Assuming O(log n) is always fast.",
      fix: "O(log n) with a huge constant (like a poorly-cached balanced tree) can lose to O(n) on small inputs.",
    },
    {
      mistake: "Forgetting auxiliary space.",
      fix: "Time and space are separate. A solution can be O(n log n) time and O(n) space (merge sort) or O(1) space (heap sort).",
    },
    {
      mistake: "Being fooled by hidden loops inside built-ins.",
      fix: "`x in list` is O(n). `sub in s` (substring) is O(n·m) in the worst case. `set(x)` is O(n). Built-ins are not free.",
    },
  ],
  interview: {
    questions: [
      "What is the complexity of this code? (Show a loop nest.)",
      "Why is merge sort O(n log n)?",
      "What is the difference between O and Θ?",
      "What is amortized O(1)?",
      "What is the complexity of a hash map lookup? (O(1) average, O(n) worst.)",
    ],
    observations: [
      "The Master Theorem solves T(n) = a·T(n/b) + n^d. Compare log_b(a) to d.",
      "Amortized analysis matters for dynamic arrays and union-find.",
      "The n log n lower bound is for comparison-based sorting only (information-theoretic). Non-comparison sorts like counting sort can beat it.",
    ],
    optimizations: [
      "Reduce log factors: if you only need lookups, a hash map can replace sorting plus binary search.",
      "Reduce space: rolling arrays for DP, in-place sorts.",
      "Reduce constants: cache-friendly layouts, avoid allocations in hot loops.",
    ],
    followUps: [
      "What is the complexity of string concatenation in Python? — Building a string with += in a loop can be O(n²) (CPython sometimes optimises it, but do not rely on it); join is O(n).",
      "What is the complexity of `a.sort()` in Python? — O(n log n) worst case (Timsort).",
      "Why is slicing `a[i:j]` in Python O(k)? — It copies k elements.",
    ],
  },
  related: [
    {
      id: "arrays",
      relation: "Every loop complexity example starts with arrays",
    },
    { id: "sorting", relation: "Sorting establishes the O(n log n) baseline" },
  ],
  practice: [
    {
      title: "Merge Sorted Array",
      difficulty: "Easy",
      why: "O(n+m) merge — reason about why it is linear.",
    },
    {
      title: "Contains Duplicate",
      difficulty: "Easy",
      why: "Compare O(n²) nested loops vs O(n log n) sort vs O(n) hash set.",
    },
    {
      title: "Two Sum",
      difficulty: "Easy",
      why: "O(n²) brute force vs O(n log n) sort+two-pointer vs O(n) hash map.",
    },
    {
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      why: "Sorting gives O(n log n); a hash set gives O(n).",
    },
  ],
  revision: {
    takeaways: [
      "O = upper, Ω = lower, Θ = tight.",
      "Drop constants and lower-order terms.",
      "10^8 simple operations/second is a good budget approximation (C++/Java).",
      "Auxiliary space ≠ total space.",
    ],
    formulas: [
      "Master theorem: T(n) = a·T(n/b) + n^d → compare log_b(a) to d.",
      "Comparison sort lower bound: Ω(n log n).",
      "Dynamic array append: amortized O(1).",
    ],
    complexitySummary:
      "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!).",
    patterns: [
      "Feasibility",
      "Master theorem",
      "Amortized analysis",
      "Space vs auxiliary",
    ],
    memoryTrick:
      "Constants do not matter for large n. Halving = log. Nested = multiply.",
  },
};
