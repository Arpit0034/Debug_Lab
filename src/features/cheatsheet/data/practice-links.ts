// External problem links for practice items across all concept pages.
// Keyed by exact title as it appears in ConceptDetail.practice[].title.
// Prefer LeetCode; fall back to GFG / HackerRank when LC is not applicable.

export type PracticeSource = 'LC' | 'GFG' | 'HR';

export interface PracticeLink {
  url: string;
  source: PracticeSource;
}

export const PRACTICE_LINKS: Record<string, PracticeLink> = {
  // --- Arrays & Hash maps ---
  'Two Sum': { url: 'https://leetcode.com/problems/two-sum/', source: 'LC' },
  'Move Zeroes': { url: 'https://leetcode.com/problems/move-zeroes/', source: 'LC' },
  'Rotate Array': { url: 'https://leetcode.com/problems/rotate-array/', source: 'LC' },
  'Maximum Subarray': { url: 'https://leetcode.com/problems/maximum-subarray/', source: 'LC' },
  'Container With Most Water': { url: 'https://leetcode.com/problems/container-with-most-water/', source: 'LC' },
  'Valid Anagram': { url: 'https://leetcode.com/problems/valid-anagram/', source: 'LC' },
  'Group Anagrams': { url: 'https://leetcode.com/problems/group-anagrams/', source: 'LC' },
  'Longest Consecutive Sequence': { url: 'https://leetcode.com/problems/longest-consecutive-sequence/', source: 'LC' },
  'Subarray Sum Equals K': { url: 'https://leetcode.com/problems/subarray-sum-equals-k/', source: 'LC' },
  'Contains Duplicate': { url: 'https://leetcode.com/problems/contains-duplicate/', source: 'LC' },
  'Merge Sorted Array': { url: 'https://leetcode.com/problems/merge-sorted-array/', source: 'LC' },

  // --- Trees ---
  'Maximum Depth of Binary Tree': { url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', source: 'LC' },
  'Invert Binary Tree': { url: 'https://leetcode.com/problems/invert-binary-tree/', source: 'LC' },
  'Validate Binary Search Tree': { url: 'https://leetcode.com/problems/validate-binary-search-tree/', source: 'LC' },
  'Binary Tree Level Order Traversal': { url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', source: 'LC' },
  'Lowest Common Ancestor of a Binary Tree': { url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', source: 'LC' },
  'Diameter of Binary Tree': { url: 'https://leetcode.com/problems/diameter-of-binary-tree/', source: 'LC' },

  // --- Recursion ---
  'Reverse Linked List': { url: 'https://leetcode.com/problems/reverse-linked-list/', source: 'LC' },
  'Merge Two Sorted Lists': { url: 'https://leetcode.com/problems/merge-two-sorted-lists/', source: 'LC' },
  'Pow(x, n)': { url: 'https://leetcode.com/problems/powx-n/', source: 'LC' },
  'Tower of Hanoi': { url: 'https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/', source: 'GFG' },

  // --- Binary search ---
  'Binary Search': { url: 'https://leetcode.com/problems/binary-search/', source: 'LC' },
  'Search Insert Position': { url: 'https://leetcode.com/problems/search-insert-position/', source: 'LC' },
  'Find Minimum in Rotated Sorted Array': { url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', source: 'LC' },
  'Koko Eating Bananas': { url: 'https://leetcode.com/problems/koko-eating-bananas/', source: 'LC' },

  // --- Two pointers ---
  'Two Sum II - Input Array Is Sorted': { url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', source: 'LC' },
  'Valid Palindrome': { url: 'https://leetcode.com/problems/valid-palindrome/', source: 'LC' },
  'Remove Duplicates from Sorted Array': { url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', source: 'LC' },
  '3Sum': { url: 'https://leetcode.com/problems/3sum/', source: 'LC' },
  'Trapping Rain Water': { url: 'https://leetcode.com/problems/trapping-rain-water/', source: 'LC' },

  // --- Sliding window ---
  'Maximum Average Subarray I': { url: 'https://leetcode.com/problems/maximum-average-subarray-i/', source: 'LC' },
  'Longest Substring Without Repeating Characters': { url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', source: 'LC' },
  'Longest Repeating Character Replacement': { url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', source: 'LC' },
  'Permutation in String': { url: 'https://leetcode.com/problems/permutation-in-string/', source: 'LC' },
  'Minimum Window Substring': { url: 'https://leetcode.com/problems/minimum-window-substring/', source: 'LC' },
  'Sliding Window Maximum': { url: 'https://leetcode.com/problems/sliding-window-maximum/', source: 'LC' },

  // --- Sorting ---
  'Sort Colors': { url: 'https://leetcode.com/problems/sort-colors/', source: 'LC' },
  'Merge Intervals': { url: 'https://leetcode.com/problems/merge-intervals/', source: 'LC' },
  'Largest Number': { url: 'https://leetcode.com/problems/largest-number/', source: 'LC' },
  'Kth Largest Element in an Array': { url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', source: 'LC' },
  'Meeting Rooms II': { url: 'https://leetcode.com/problems/meeting-rooms-ii/', source: 'LC' },
  'Sort an Array': { url: 'https://leetcode.com/problems/sort-an-array/', source: 'LC' },

  // --- Stacks & queues ---
  'Valid Parentheses': { url: 'https://leetcode.com/problems/valid-parentheses/', source: 'LC' },
  'Min Stack': { url: 'https://leetcode.com/problems/min-stack/', source: 'LC' },
  'Daily Temperatures': { url: 'https://leetcode.com/problems/daily-temperatures/', source: 'LC' },
  'Implement Queue using Stacks': { url: 'https://leetcode.com/problems/implement-queue-using-stacks/', source: 'LC' },

  // --- Linked lists ---
  'Linked List Cycle': { url: 'https://leetcode.com/problems/linked-list-cycle/', source: 'LC' },
  'Remove Nth Node From End of List': { url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', source: 'LC' },
  'LRU Cache': { url: 'https://leetcode.com/problems/lru-cache/', source: 'LC' },

  // --- Graphs ---
  'Number of Islands': { url: 'https://leetcode.com/problems/number-of-islands/', source: 'LC' },
  'Clone Graph': { url: 'https://leetcode.com/problems/clone-graph/', source: 'LC' },
  'Course Schedule': { url: 'https://leetcode.com/problems/course-schedule/', source: 'LC' },
  'Word Ladder': { url: 'https://leetcode.com/problems/word-ladder/', source: 'LC' },
  'Rotting Oranges': { url: 'https://leetcode.com/problems/rotting-oranges/', source: 'LC' },

  // --- DP ---
  'Climbing Stairs': { url: 'https://leetcode.com/problems/climbing-stairs/', source: 'LC' },
  'House Robber': { url: 'https://leetcode.com/problems/house-robber/', source: 'LC' },
  'Coin Change': { url: 'https://leetcode.com/problems/coin-change/', source: 'LC' },
  'Longest Common Subsequence': { url: 'https://leetcode.com/problems/longest-common-subsequence/', source: 'LC' },
  'Edit Distance': { url: 'https://leetcode.com/problems/edit-distance/', source: 'LC' },

  // --- Backtracking ---
  'Subsets': { url: 'https://leetcode.com/problems/subsets/', source: 'LC' },
  'Permutations': { url: 'https://leetcode.com/problems/permutations/', source: 'LC' },
  'Combination Sum': { url: 'https://leetcode.com/problems/combination-sum/', source: 'LC' },
  'N-Queens': { url: 'https://leetcode.com/problems/n-queens/', source: 'LC' },
  'Word Search': { url: 'https://leetcode.com/problems/word-search/', source: 'LC' },

  // --- Greedy ---
  'Jump Game': { url: 'https://leetcode.com/problems/jump-game/', source: 'LC' },
  'Non-overlapping Intervals': { url: 'https://leetcode.com/problems/non-overlapping-intervals/', source: 'LC' },
  'Gas Station': { url: 'https://leetcode.com/problems/gas-station/', source: 'LC' },
  'Task Scheduler': { url: 'https://leetcode.com/problems/task-scheduler/', source: 'LC' },

  // --- Heaps ---
  'Top K Frequent Elements': { url: 'https://leetcode.com/problems/top-k-frequent-elements/', source: 'LC' },
  'Merge k Sorted Lists': { url: 'https://leetcode.com/problems/merge-k-sorted-lists/', source: 'LC' },
  'Find Median from Data Stream': { url: 'https://leetcode.com/problems/find-median-from-data-stream/', source: 'LC' },

  // --- Trie ---
  'Implement Trie (Prefix Tree)': { url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', source: 'LC' },
  'Design Add and Search Words Data Structure': { url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', source: 'LC' },
  'Word Search II': { url: 'https://leetcode.com/problems/word-search-ii/', source: 'LC' },
  'Maximum XOR of Two Numbers in an Array': { url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/', source: 'LC' },

  // --- Union-Find ---
  'Number of Provinces': { url: 'https://leetcode.com/problems/number-of-provinces/', source: 'LC' },
  'Redundant Connection': { url: 'https://leetcode.com/problems/redundant-connection/', source: 'LC' },
  'Accounts Merge': { url: 'https://leetcode.com/problems/accounts-merge/', source: 'LC' },
  'Satisfiability of Equality Equations': { url: 'https://leetcode.com/problems/satisfiability-of-equality-equations/', source: 'LC' },

  // --- Bit manipulation ---
  'Single Number': { url: 'https://leetcode.com/problems/single-number/', source: 'LC' },
  'Number of 1 Bits': { url: 'https://leetcode.com/problems/number-of-1-bits/', source: 'LC' },
  'Counting Bits': { url: 'https://leetcode.com/problems/counting-bits/', source: 'LC' },
  'Single Number II': { url: 'https://leetcode.com/problems/single-number-ii/', source: 'LC' },
  'Single Number III': { url: 'https://leetcode.com/problems/single-number-iii/', source: 'LC' },

  // --- Monotonic stack ---
  'Next Greater Element I': { url: 'https://leetcode.com/problems/next-greater-element-i/', source: 'LC' },
  'Largest Rectangle in Histogram': { url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', source: 'LC' },

  "Course Schedule II": { url: "https://leetcode.com/problems/course-schedule-ii/", source: "LC" },
  "Alien Dictionary": { url: "https://leetcode.com/problems/alien-dictionary/", source: "LC" },
  "Longest Increasing Path in a Matrix": { url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", source: "LC" },
  "Network Delay Time": { url: "https://leetcode.com/problems/network-delay-time/", source: "LC" },
  "Path With Minimum Effort": { url: "https://leetcode.com/problems/path-with-minimum-effort/", source: "LC" },
  "Cheapest Flights Within K Stops": { url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", source: "LC" },
  "Swim in Rising Water": { url: "https://leetcode.com/problems/swim-in-rising-water/", source: "LC" },
  "Path With Maximum Probability": { url: "https://leetcode.com/problems/path-with-maximum-probability/", source: "LC" },
  "Min Cost to Connect All Points": { url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", source: "LC" },
  "Connecting Cities With Minimum Cost": { url: "https://leetcode.com/problems/connecting-cities-with-minimum-cost/", source: "LC" },
  "Optimize Water Distribution in a Village": { url: "https://leetcode.com/problems/optimize-water-distribution-in-a-village/", source: "LC" },
  "Maximum Length of Repeated Subarray": { url: "https://leetcode.com/problems/maximum-length-of-repeated-subarray/", source: "LC" },
  "Shortest Common Supersequence": { url: "https://leetcode.com/problems/shortest-common-supersequence/", source: "LC" },
  "Delete Operation for Two Strings": { url: "https://leetcode.com/problems/delete-operation-for-two-strings/", source: "LC" },
  "Distinct Subsequences": { url: "https://leetcode.com/problems/distinct-subsequences/", source: "LC" },
  "Longest Increasing Subsequence": { url: "https://leetcode.com/problems/longest-increasing-subsequence/", source: "LC" },
  "Number of Longest Increasing Subsequence": { url: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/", source: "LC" },
  "Russian Doll Envelopes": { url: "https://leetcode.com/problems/russian-doll-envelopes/", source: "LC" },
  "Partition Equal Subset Sum": { url: "https://leetcode.com/problems/partition-equal-subset-sum/", source: "LC" },
  "Target Sum": { url: "https://leetcode.com/problems/target-sum/", source: "LC" },
  "Last Stone Weight II": { url: "https://leetcode.com/problems/last-stone-weight-ii/", source: "LC" },
  "Ones and Zeroes": { url: "https://leetcode.com/problems/ones-and-zeroes/", source: "LC" },
  "Coin Change II": { url: "https://leetcode.com/problems/coin-change-ii/", source: "LC" },
  "Integer Break": { url: "https://leetcode.com/problems/integer-break/", source: "LC" },
  "Perfect Squares": { url: "https://leetcode.com/problems/perfect-squares/", source: "LC" },
  "Burst Balloons": { url: "https://leetcode.com/problems/burst-balloons/", source: "LC" },
  "Palindrome Partitioning II": { url: "https://leetcode.com/problems/palindrome-partitioning-ii/", source: "LC" },
  "Minimum Score Triangulation of Polygon": { url: "https://leetcode.com/problems/minimum-score-triangulation-of-polygon/", source: "LC" },
  "Super Pow": { url: "https://leetcode.com/problems/super-pow/", source: "LC" },
  "Count Good Numbers": { url: "https://leetcode.com/problems/count-good-numbers/", source: "LC" },
  "Decode Ways": { url: "https://leetcode.com/problems/decode-ways/", source: "LC" },
  "Find the City With the Smallest Number of Neighbors at a Threshold Distance": { url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/", source: "LC" },
  "Critical Connections in a Network": { url: "https://leetcode.com/problems/critical-connections-in-a-network/", source: "LC" },
  "Number of Operations to Make Network Connected": { url: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/", source: "LC" },
  "Evaluate Division": { url: "https://leetcode.com/problems/evaluate-division/", source: "LC" },


  "Longest Palindromic Subsequence": { url: "https://leetcode.com/problems/longest-palindromic-subsequence/", source: "LC" },
  "Longest Bitonic Subsequence": { url: "https://leetcode.com/problems/longest-bitonic-subsequence/", source: "GFG" },
  "Profitable Schemes": { url: "https://leetcode.com/problems/profitable-schemes/", source: "LC" },


  "Combination Sum IV": { url: "https://leetcode.com/problems/combination-sum-iv/", source: "LC" },
  "Word Break": { url: "https://leetcode.com/problems/word-break/", source: "LC" },
  "Strange Printer": { url: "https://leetcode.com/problems/strange-printer/", source: "LC" },
  "Fibonacci Number": { url: "https://leetcode.com/problems/fibonacci-number/", source: "LC" },


  "Find Eventual Safe States": { url: "https://leetcode.com/problems/find-eventual-safe-states/", source: "LC" },
  "Reachable Nodes In Subdivided Graph": { url: "https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/", source: "LC" },
  "Count Pairs of Nodes": { url: "https://leetcode.com/problems/count-pairs-of-nodes/", source: "LC" },


  "Find the Index of the First Occurrence in a String": { url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", source: "LC" },
  "Shortest Palindrome": { url: "https://leetcode.com/problems/shortest-palindrome/", source: "LC" },
  "Repeated Substring Pattern": { url: "https://leetcode.com/problems/repeated-substring-pattern/", source: "LC" },
  "Repeated String Match": { url: "https://leetcode.com/problems/repeated-string-match/", source: "LC" },
  "Range Sum Query - Mutable": { url: "https://leetcode.com/problems/range-sum-query-mutable/", source: "LC" },
  "Count of Range Sum": { url: "https://leetcode.com/problems/count-of-range-sum/", source: "LC" },
  "Reverse Pairs": { url: "https://leetcode.com/problems/reverse-pairs/", source: "LC" },
  "Falling Squares": { url: "https://leetcode.com/problems/falling-squares/", source: "LC" },
  "Count of Smaller Numbers After Self": { url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", source: "LC" },


  "Range Sum Query - Immutable": { url: "https://leetcode.com/problems/range-sum-query-immutable/", source: "LC" },
  "Range Sum Query 2D - Immutable": { url: "https://leetcode.com/problems/range-sum-query-2d-immutable/", source: "LC" },
  "Find Pivot Index": { url: "https://leetcode.com/problems/find-pivot-index/", source: "LC" },
  "Maximum Product Subarray": { url: "https://leetcode.com/problems/maximum-product-subarray/", source: "LC" },
  "Maximum Sum Circular Subarray": { url: "https://leetcode.com/problems/maximum-sum-circular-subarray/", source: "LC" },
  "Best Time to Buy and Sell Stock": { url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", source: "LC" },
  "Insert Interval": { url: "https://leetcode.com/problems/insert-interval/", source: "LC" },
  "Minimum Number of Arrows to Burst Balloons": { url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/", source: "LC" },


  "Linked List Cycle II": { url: "https://leetcode.com/problems/linked-list-cycle-ii/", source: "LC" },
  "Middle of the Linked List": { url: "https://leetcode.com/problems/middle-of-the-linked-list/", source: "LC" },
  "Palindrome Linked List": { url: "https://leetcode.com/problems/palindrome-linked-list/", source: "LC" },
  "Find the Duplicate Number": { url: "https://leetcode.com/problems/find-the-duplicate-number/", source: "LC" },
  "Happy Number": { url: "https://leetcode.com/problems/happy-number/", source: "LC" },
  "Shortest Path Visiting All Nodes": { url: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/", source: "LC" },
  "Partition to K Equal Sum Subsets": { url: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/", source: "LC" },
  "Stickers to Spell Word": { url: "https://leetcode.com/problems/stickers-to-spell-word/", source: "LC" },
  "Maximum Students Taking Exam": { url: "https://leetcode.com/problems/maximum-students-taking-exam/", source: "LC" },
  "Predict the Winner": { url: "https://leetcode.com/problems/predict-the-winner/", source: "LC" },
  "Stone Game": { url: "https://leetcode.com/problems/stone-game/", source: "LC" },
  "Stone Game VII": { url: "https://leetcode.com/problems/stone-game-vii/", source: "LC" },

};

export function getPracticeLink(title: string): PracticeLink | undefined {
  return PRACTICE_LINKS[title];
}
