import type { ConceptDetail } from '../../types';

export const kadaneDetail: ConceptDetail = {
  id: 'kadane',
  overview: {
    essence:
      'Max subarray sum in one pass: extend or restart at each element, track global max.',
    what:
      "Kadane's algorithm finds the contiguous subarray with the maximum (or minimum) sum. O(n) time, O(1) space — cannot be done faster than O(n).",
    problemSolved:
      "Naive max-subarray is O(n^2) or O(n^3). Kadane is O(n) because it exploits overlap: if the current subarray sum becomes negative, any extension is worse than starting fresh.",
    whyImportant:
      "The one-pass linear solution to one of the most-asked interview problems. The same template gives max-product, circular subarray, and stock-profit variants.",
    usedIn: [
      "Maximum subarray sum",
      "Maximum circular subarray sum",
      "Best time to buy and sell stock",
      "Maximum product subarray (variant)",
      "Longest turbulent subarray (with bit of extra state)",
    ],
  },
  intuition: {
    explanation:
      "At each index, the best subarray ending here is either the best subarray ending at the previous index extended by a[i], or a fresh subarray starting at a[i]. Take whichever is larger. Keep a global max of these local values. If the running sum ever drops below zero (equivalently, cur + a[i] < a[i]), restart — carrying a negative prefix only hurts.",
    analogy:
      'Like a hiker tracking net elevation gain. When cumulative gain drops below zero, you restart counting from there — carrying negative gain only reduces future totals.',
  },
  internals: [
    { title: "State", body: "cur = best sum of subarray ending at index i. best = max subarray sum over all i." },
    { title: "Transition", body: "cur = max(a[i], cur + a[i]). Restart or extend." },
    { title: "Track global", body: "best = max(best, cur) after each step." },
    { title: "All-negative case", body: "Initialize best = -inf (or a[0]). Starting best = 0 gives wrong answer on all-negative arrays." },
    { title: "Circular variant", body: "Max non-circular via Kadane; max circular via total - min_subarray. Special-case all-negative." },
    { title: "Buy-sell stock", body: "Same shape: max profit = max over i of (a[i] - min_so_far[i])." },
  ],
  visual: {
    diagram:
      "a = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n\n" +
      "i=0: cur=-2, best=-2\n" +
      "i=1: cur=max(1, -2+1)=1, best=1\n" +
      "i=2: cur=max(-3, 1-3)=-2, best=1\n" +
      "i=3: cur=max(4, -2+4)=4, best=4\n" +
      "i=4: cur=max(-1, 4-1)=3, best=4\n" +
      "i=5: cur=max(2, 3+2)=5, best=5\n" +
      "i=6: cur=max(1, 5+1)=6, best=6\n" +
      "i=7: cur=max(-5, 6-5)=1, best=6\n" +
      "i=8: cur=max(4, 1+4)=5, best=6\n\n" +
      "Maximum subarray sum = 6 (subarray [4,-1,2,1])",
    caption:
      "At each step, decide extend or restart. Track the global maximum.",
  },
  approach: {
    summary:
      "One pass. cur = max(a[i], cur + a[i]); best = max(best, cur). Handle all-negative arrays by initializing best = -inf.",
    steps: [
      "Initialize cur = a[0], best = a[0], and loop from i = 1. (Alternative: cur = 0, best = -inf, and loop from i = 0.)",
      "For each remaining i: cur = max(a[i], cur + a[i]). best = max(best, cur).",
      "Return best.",
    ],
    template: {
      code:
        "def kadane(a):\n" +
        "    cur = best = a[0]\n" +
        "    for i in range(1, len(a)):\n" +
        "        cur = max(a[i], cur + a[i])\n" +
        "        best = max(best, cur)\n" +
        "    return best",
      notes: ["a[i] alone as cur is the restart case."],
    },
  },
  code: {
    python: {
      code:
        "def max_subarray(nums):\n" +
        "    cur = best = nums[0]\n" +
        "    for i in range(1, len(nums)):\n" +
        "        cur = max(nums[i], cur + nums[i])\n" +
        "        best = max(best, cur)\n" +
        "    return best\n\n" +
        "def max_circular_subarray(nums):\n" +
        "    total = sum(nums)\n" +
        "    max_k = max_subarray(nums)\n" +
        "    # Min subarray variant for circular\n" +
        "    cur = min_k = nums[0]\n" +
        "    for i in range(1, len(nums)):\n" +
        "        cur = min(nums[i], cur + nums[i])\n" +
        "        min_k = min(min_k, cur)\n" +
        "    if max_k < 0:\n" +
        "        return max_k  # all negative\n" +
        "    return max(max_k, total - min_k)\n\n" +
        "def max_profit(prices):\n" +
        "    min_so_far = prices[0]\n" +
        "    best = 0\n" +
        "    for p in prices[1:]:\n" +
        "        best = max(best, p - min_so_far)\n" +
        "        min_so_far = min(min_so_far, p)\n" +
        "    return best",
      notes: [
        "Circular variant: if all-negative, min subarray = whole array, so total - min_k = 0 (empty complement); non-empty required, return max_k.",
        "Buy-sell is the prefix-min form; it is equivalent to Kadane on the daily differences prices[i] - prices[i-1].",
      ],
    },
    java: {
      code:
        "int maxSubArray(int[] nums) {\n" +
        "    int cur = nums[0], best = nums[0];\n" +
        "    for (int i = 1; i < nums.length; i++) {\n" +
        "        cur = Math.max(nums[i], cur + nums[i]);\n" +
        "        best = Math.max(best, cur);\n" +
        "    }\n" +
        "    return best;\n" +
        "}\n\n" +
        "int maxSubarraySumCircular(int[] nums) {\n" +
        "    int total = nums[0];\n" +
        "    int curMax = nums[0], maxK = nums[0];\n" +
        "    int curMin = nums[0], minK = nums[0];\n" +
        "    for (int i = 1; i < nums.length; i++) {\n" +
        "        total += nums[i];\n" +
        "        curMax = Math.max(nums[i], curMax + nums[i]);\n" +
        "        maxK = Math.max(maxK, curMax);\n" +
        "        curMin = Math.min(nums[i], curMin + nums[i]);\n" +
        "        minK = Math.min(minK, curMin);\n" +
        "    }\n" +
        "    if (maxK < 0) return maxK; // all negative\n" +
        "    return Math.max(maxK, total - minK);\n" +
        "}\n\n" +
        "int maxProfit(int[] prices) {\n" +
        "    int minSoFar = prices[0], best = 0;\n" +
        "    for (int i = 1; i < prices.length; i++) {\n" +
        "        best = Math.max(best, prices[i] - minSoFar);\n" +
        "        minSoFar = Math.min(minSoFar, prices[i]);\n" +
        "    }\n" +
        "    return best;\n" +
        "}",
      notes: [
        "Cur and best both start at nums[0] to handle all-negative correctly.",
        "Buy-sell is the prefix-min form; it is equivalent to Kadane on the daily differences prices[i] - prices[i-1].",
      ],
    },
  },
  complexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    auxiliary: "O(1)",
    total: "O(n) time, O(1) space",
    why: [
      { label: "O(n) time", reason: "Single pass, O(1) work per element." },
      { label: "O(1) space", reason: "Only two variables (cur, best)." },
      { label: "Cannot be faster", reason: "Every element must be examined at least once (adversary can hide max in any unread element)." },
    ],
  },
  dryRun: {
    input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    initialState: "cur = -2, best = -2",
    steps: [
      { step: "1", state: "i=1: cur = max(1, -1) = 1, best = 1", note: "Restart better than extend." },
      { step: "2", state: "i=3: cur = max(4, -2 + 4) = 4, best = 4", note: "Restart at 4." },
      { step: "3", state: "i=6: cur = 6, best = 6", note: "Best subarray [4, -1, 2, 1]." },
    ],
    output: "6",
  },
  whenToUse: [
    "Maximum contiguous subarray sum.",
    "Maximum circular subarray sum.",
    "Best time to buy/sell stock.",
    "Maximum subarray product (with sign tracking).",
    "Any 'best contiguous segment' problem.",
  ],
  whenNotToUse: [
    "Non-contiguous selection — this is not Kadane.",
    "At most k non-overlapping subarrays — needs a DP over k, not plain Kadane.",
    "Range sum on a static array — use prefix sum.",
  ],
  mistakes: [
    { mistake: "Initializing best = 0 and failing on all-negative arrays.", fix: "For non-empty subarray, init both cur and best to nums[0]. If an empty subarray is allowed: start from cur = best = 0, then cur = max(0, cur + a[i]) and best = max(best, cur) over all elements." },
    { mistake: "Trying to apply Kadane to max-product without tracking min.", fix: "Max product subarray needs both max and min (negative * negative = positive)." },
    { mistake: "Using Kadane for circular without handling the all-negative case.", fix: "If max subarray sum < 0, return it. Otherwise max(max_non_circular, total - min_subarray)." },
  ],
  interview: {
    questions: [
      "Maximum Subarray (LeetCode 53).",
      "Maximum Product Subarray (LeetCode 152) — variant needing min tracking.",
      "Maximum Circular Subarray Sum (LeetCode 918).",
      "Best Time to Buy and Sell Stock (LeetCode 121).",
      "Maximum Absolute Sum of Any Subarray (LeetCode 1749).",
    ],
    observations: [
      "cur = max(a[i], cur + a[i]) is the whole algorithm.",
      "The pattern generalises: max product, min subarray, best profit.",
      "Circular variant needs both max and min subarray sums.",
    ],
    optimizations: [
      "Track start/end indices alongside the sum if the subarray is required, not just its sum.",
      "Combine with min tracking for circular variants.",
    ],
    followUps: [
      "What if the array can be reordered? — sort and take positive elements. Different problem.",
      "What about multiple non-overlapping subarrays? — buy-sell stock IV style DP.",
    ],
  },
  related: [
    { id: "prefix-sum", relation: "Kadane is the one-pass equivalent of max(prefix[j] - min prefix[i<j])" },
    { id: "arrays", relation: "Kadane operates on arrays" },
  ],
  practice: [
    { title: "Maximum Subarray", difficulty: "Medium", why: "The canonical Kadane problem." },
    { title: "Maximum Product Subarray", difficulty: "Medium", why: "Kadane with min tracking for negatives." },
    { title: "Maximum Sum Circular Subarray", difficulty: "Medium", why: "Kadane + min subarray complement." },
    { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", why: "Same shape, different state variable." },
  ],
  revision: {
    takeaways: [
      "Kadane: O(n), O(1). cur = max(a[i], cur + a[i]).",
      "Initialize both cur and best to a[0] to handle all-negative.",
      "Circular variant: max(max_non_circular, total - min_subarray).",
    ],
    formulas: [
      "cur = max(a[i], cur + a[i])",
      "best = max(best, cur)",
      "Circular: max(max_k, total - min_k), fallback to max_k if max_k < 0",
    ],
    complexitySummary: "O(n) time, O(1) space.",
    patterns: ["Max subarray", "Max product", "Buy-sell stock", "Circular variant"],
    memoryTrick: "Extend or restart. Track the high-water mark. Kadane is one pass.",
  },
};
