import type { ConceptDetail } from '../../types';

export const mergeIntervalsDetail: ConceptDetail = {
  id: 'merge-intervals',
  overview: {
    essence:
      "Sort intervals by start, then walk once. If the next start is <= the current end, they overlap — merge by extending the end. Otherwise, emit the current interval and start a new one.",
    what:
      "Given a collection of intervals [start, end], merge all overlapping intervals. Two intervals overlap if the next start is at most the current end (assuming inclusive bounds).",
    problemSolved:
      "Unordered intervals require O(n^2) to detect all overlaps. Sorting by start reduces the problem to a single O(n) scan — total O(n log n) dominated by the sort.",
    whyImportant:
      "The classic interval-merging pattern. Variants cover meeting rooms, calendar booking, arrow-bursting balloons, and insert-interval. The sort-then-scan idea generalises to most interval problems.",
    usedIn: [
      "Merge overlapping intervals",
      "Insert into sorted intervals",
      "Meeting rooms / minimum platforms",
      "Minimum arrows to burst balloons",
      "Non-overlapping intervals (max count)",
    ],
  },
  intuition: {
    explanation:
      "After sorting by start, intervals that overlap must appear consecutively. If you keep the current merged interval, checking overlap with the next is just 'next.start <= current.end'. If they overlap, extend the end to max(current.end, next.end) — a longer interval might swallow both. If not, emit current and continue. The single-pass-after-sort pattern is the same across almost every interval problem.",
    analogy:
      "A meeting room calendar. Sort meetings by start time. If a new meeting starts before the current one ends, extend the current block. Otherwise start a new block.",
  },
  internals: [
    { title: "Sort by start", body: "O(n log n). After sorting, overlapping intervals are adjacent." },
    { title: "Single scan", body: "Walk the sorted list, maintaining the currently-merged interval. Compare next.start to current.end." },
    { title: "Overlap condition", body: "next.start <= current.end (for closed intervals). For open intervals (e.g., 'end exclusive'), use next.start < current.end." },
    { title: "Merge operation", body: "current.end = max(current.end, next.end). Never shrink the end." },
    { title: "Insert variant", body: "Given a sorted, non-overlapping list and one new interval: append all before, merge all overlapping, append all after. O(n)." },
    { title: "Meeting rooms II", body: "Sort starts and ends separately, then two-pointer sweep — min rooms = max concurrent." },
  ],
  visual: {
    diagram:
      "intervals = [[1,3], [2,6], [8,10], [15,18]]\n\n" +
      "Sort by start (already sorted):\n" +
      "  current = [1, 3]\n" +
      "  [2, 6]: 2 <= 3 → merge → [1, 6]\n" +
      "  [8, 10]: 8 > 6 → emit [1, 6], current = [8, 10]\n" +
      "  [15, 18]: 15 > 10 → emit [8, 10], current = [15, 18]\n" +
      "  emit [15, 18]\n\n" +
      "Result = [[1, 6], [8, 10], [15, 18]]",
    caption:
      "Sort by start, then extend the end while overlapping.",
  },
  approach: {
    summary:
      "Sort intervals by start. Walk once, comparing next.start to current.end. Overlap → extend end. No overlap → emit and continue.",
    steps: [
      "If input is empty, return [].",
      "Sort intervals by start.",
      "current = first interval.",
      "For each next: if next.start <= current.end: current.end = max(current.end, next.end). Else: emit current, current = next.",
      "Emit the final current.",
    ],
    template: {
      code:
        "def merge(intervals):\n" +
        "    if not intervals: return []\n" +
        "    intervals.sort(key=lambda x: x[0])\n" +
        "    merged = [intervals[0]]\n" +
        "    for start, end in intervals[1:]:\n" +
        "        if start <= merged[-1][1]:\n" +
        "            merged[-1][1] = max(merged[-1][1], end)\n" +
        "        else:\n" +
        "            merged.append([start, end])\n" +
        "    return merged",
      notes: ["The max() prevents shrinking when a later interval is fully contained."],
    },
  },
  code: {
    python: {
      code:
        "def merge(intervals):\n" +
        "    if not intervals: return []\n" +
        "    intervals.sort(key=lambda x: x[0])\n" +
        "    merged = [list(intervals[0])]\n" +
        "    for start, end in intervals[1:]:\n" +
        "        if start <= merged[-1][1]:\n" +
        "            merged[-1][1] = max(merged[-1][1], end)\n" +
        "        else:\n" +
        "            merged.append([start, end])\n" +
        "    return merged\n\n" +
        "def insert(intervals, new):\n" +
        "    result = []\n" +
        "    i, n = 0, len(intervals)\n" +
        "    while i < n and intervals[i][1] < new[0]:\n" +
        "        result.append(intervals[i]); i += 1\n" +
        "    while i < n and intervals[i][0] <= new[1]:\n" +
        "        new[0] = min(new[0], intervals[i][0])\n" +
        "        new[1] = max(new[1], intervals[i][1])\n" +
        "        i += 1\n" +
        "    result.append(new)\n" +
        "    while i < n:\n" +
        "        result.append(intervals[i]); i += 1\n" +
        "    return result",
      notes: [
        "Insert variant is O(n) — no sort needed if the input is already sorted and non-overlapping.",
        "Use max() when extending — do not blindly assign the later end.",
      ],
    },
    java: {
      code:
        "int[][] merge(int[][] intervals) {\n" +
        "    if (intervals.length == 0) return new int[][]{};\n" +
        "    java.util.Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n" +
        "    java.util.List<int[]> merged = new java.util.ArrayList<>();\n" +
        "    merged.add(intervals[0]);\n" +
        "    for (int i = 1; i < intervals.length; i++) {\n" +
        "        int[] cur = merged.get(merged.size() - 1);\n" +
        "        int[] next = intervals[i];\n" +
        "        if (next[0] <= cur[1]) {\n" +
        "            cur[1] = Math.max(cur[1], next[1]);\n" +
        "        } else {\n" +
        "            merged.add(next);\n" +
        "        }\n" +
        "    }\n" +
        "    return merged.toArray(new int[0][]);\n" +
        "}",
      notes: [
        "Sort by start via Arrays.sort with comparator.",
        "Do not extend the interval by simply assigning; use Math.max.",
      ],
    },
  },
  complexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    auxiliary: "O(n)",
    total: "O(n log n) time, O(n) space",
    why: [
      { label: "O(n log n) time", reason: "Sort dominates. The merge scan itself is O(n)." },
      { label: "O(n) space", reason: "Output can be up to n intervals. Extra space for sort depends on language." },
      { label: "Cannot be faster", reason: "Sorting is required to detect overlaps in one pass." },
    ],
  },
  dryRun: {
    input: "intervals = [[1,3], [2,6], [8,10], [15,18]]",
    initialState: "merged = [[1,3]]",
    steps: [
      { step: "1", state: "[2,6]: 2 <= 3 → merged[-1][1] = max(3,6) = 6", note: "merged = [[1,6]]" },
      { step: "2", state: "[8,10]: 8 > 6 → append", note: "merged = [[1,6], [8,10]]" },
      { step: "3", state: "[15,18]: 15 > 10 → append", note: "merged = [[1,6], [8,10], [15,18]]" },
    ],
    output: "[[1, 6], [8, 10], [15, 18]]",
  },
  whenToUse: [
    "Merging overlapping intervals.",
    "Insert into sorted interval list.",
    "Minimum meeting rooms / minimum platforms.",
    "Detecting overlaps or scheduling conflicts.",
    "Any problem with 'contiguous ranges that may overlap'.",
  ],
  whenNotToUse: [
    "Intervals on a circle — need special handling for wrap-around.",
    "Intervals with non-standard overlap (open, half-open) — adjust the comparison.",
    "Intervals of different shapes (e.g., 2D rectangles) — different algorithms.",
  ],
  mistakes: [
    { mistake: "Extending the end without max().", fix: "If the next interval is fully contained (start >= current.start, end <= current.end), blindly assigning end would shrink it. Use max." },
    { mistake: "Overlap condition backwards.", fix: "For closed intervals, overlap = next.start <= current.end. Using < misses touching intervals." },
    { mistake: "Forgetting to emit the last interval.", fix: "After the loop, the currently-merged interval must be added." },
    { mistake: "Sorting by end instead of start.", fix: "For merging, sort by start. For activity selection (max count of non-overlapping), sort by end." },
  ],
  interview: {
    questions: [
      "Merge Intervals (LeetCode 56).",
      "Insert Interval (LeetCode 57).",
      "Non-overlapping Intervals (LeetCode 435).",
      "Meeting Rooms (LeetCode 252) and Meeting Rooms II (LeetCode 253).",
      "Minimum Number of Arrows to Burst Balloons (LeetCode 452).",
    ],
    observations: [
      "Sort-then-scan is the core idea. Sorting by start vs end matters for different problems.",
      "Meeting rooms II uses a min-heap or a two-pointer sweep on sorted starts and ends.",
      "Insert interval is O(n) when input is already sorted, O(n log n) otherwise.",
    ],
    optimizations: [
      "Meeting rooms II: sort starts, sort ends, two-pointer sweep — O(n log n).",
      "Non-overlapping intervals: sort by end, greedy count of non-overlap.",
      "Use a heap for the 'minimum rooms' variant — O(n log n).",
    ],
    followUps: [
      "What if intervals can be on a circle? — split circles into two intervals or sort by a wrap-around key.",
      "What if intervals have weights? — weighted interval scheduling, a classic DP.",
    ],
  },
  related: [
    { id: "sorting", relation: "Merging needs a sort by start" },
  ],
  practice: [
    { title: "Merge Intervals", difficulty: "Medium", why: "The template problem." },
    { title: "Insert Interval", difficulty: "Medium", why: "Variant on already-sorted input, O(n)." },
    { title: "Non-overlapping Intervals", difficulty: "Medium", why: "Sort by end, greedy selection." },
    { title: "Minimum Number of Arrows to Burst Balloons", difficulty: "Medium", why: "Sort by end + greedy." },
    { title: "Meeting Rooms II", difficulty: "Medium", why: "Minimum rooms — heap or sweep." },
  ],
  revision: {
    takeaways: [
      "Sort by start, extend end while overlapping.",
      "O(n log n) time, O(n) space.",
      "Overlap = next.start <= current.end (closed intervals).",
      "Non-overlap variant: sort by end instead of start.",
    ],
    formulas: [
      "Sort intervals by start",
      "Overlap check: next.start <= current.end",
      "Extend: current.end = max(current.end, next.end)",
    ],
    complexitySummary: "O(n log n) time (sort dominates), O(n) space.",
    patterns: ["Merge overlapping", "Insert interval", "Meeting rooms", "Arrow bursting"],
    memoryTrick: "Sort by start, merge when next.start <= current.end, extend with max.",
  },
};
