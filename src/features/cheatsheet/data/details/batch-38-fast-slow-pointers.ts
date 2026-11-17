import type { ConceptDetail } from '../../types';

export const fastSlowPointersDetail: ConceptDetail = {
  id: 'fast-slow-pointers',
  overview: {
    essence:
      "Two pointers moving at different speeds. Fast moves 2x, slow moves 1x. If a cycle exists, they meet inside it. If not, fast reaches the end and slow is at the middle.",
    what:
      "Floyd cycle detection. Two pointers over a linked list (or any iterable with next): slow advances by 1, fast by 2. Both share the same start.",
    problemSolved:
      "Detect cycles in O(1) space instead of maintaining a hash set of visited nodes. Also find the cycle start, the middle node, and the k-th from end.",
    whyImportant:
      "The classic O(1)-space cycle detector. Extends to finding middle, nth-from-end, and duplicate-number problems. Appears in linked list, array, and number-sequence problems.",
    usedIn: [
      "Linked list cycle detection",
      "Cycle start node",
      "Find middle of linked list",
      "Detect duplicates (LeetCode 287)",
      "Happy number detection",
      "Palindrome linked list (find middle + reverse)",
    ],
  },
  intuition: {
    explanation:
      "If the list has a cycle, both pointers eventually enter it. Inside the cycle, fast gains one step per iteration on slow. Once inside, they meet within at most cycle-length steps. If no cycle, fast reaches null. For cycle start: after they meet, reset one pointer to head and advance both by 1 — they meet at the cycle start (Floyd theorem). For the middle: when fast reaches the end, slow is at the middle because fast travelled twice as far.",
    analogy:
      "Two runners on a circular track, one running twice as fast. If the track is a loop, the faster one laps the slower one and they meet. If the track is straight, the faster one reaches the finish and stops while the slower is halfway.",
  },
  internals: [
    { title: "Cycle detection", body: "slow = slow.next, fast = fast.next.next. If slow == fast, a cycle exists. If fast or fast.next is null, no cycle." },
    { title: "Cycle start", body: "After they meet, reset slow to head. Advance both by 1 until they meet again. The meeting point is the cycle start." },
    { title: "Middle node", body: "When fast reaches end, slow is at middle. For even-length lists, slow ends at the second middle by convention (adjust for first middle)." },
    { title: "Nth node from end", body: "Advance fast by N first. Then advance both by 1 until fast reaches the end. Slow is then at the Nth from end." },
    { title: "Why O(1) space", body: "Only two pointer variables. No hash set required." },
    { title: "Array equivalent", body: "Treat array values as next pointers: from index i, jump to a[i]. Detects cycles in functional graphs." },
  ],
  visual: {
    diagram:
      "List with cycle: 1 → 2 → 3 → 4 → 5\n" +
      "                          ↑       ↓\n" +
      "                          ←── 6 ←─┘\n\n" +
      "Trace:\n" +
      "  slow=1, fast=1\n" +
      "  slow=2, fast=3\n" +
      "  slow=3, fast=5\n" +
      "  slow=4, fast=3  (fast wrapped through cycle)\n" +
      "  slow=5, fast=5  ← MEETING inside cycle\n\n" +
      "Cycle start:\n" +
      "  reset slow to head (1), fast stays at 5\n" +
      "  slow=2, fast=6\n" +
      "  slow=3, fast=3  ← MEETING at cycle start (node 3)",
    caption:
      "Both start at head. Fast gains one step per iteration. They meet inside the cycle.",
  },
  approach: {
    summary:
      "Initialize slow = fast = head. Advance slow by 1, fast by 2. If slow == fast, cycle exists. For start, reset one to head and advance both by 1.",
    steps: [
      "slow = head, fast = head.",
      "While fast and fast.next: slow = slow.next, fast = fast.next.next.",
      "If slow == fast, a cycle exists.",
      "If no cycle: fast or fast.next is null.",
      "To find cycle start: reset slow = head, advance both by 1 until they meet.",
    ],
    template: {
      code:
        "def has_cycle(head):\n" +
        "    slow = fast = head\n" +
        "    while fast and fast.next:\n" +
        "        slow = slow.next\n" +
        "        fast = fast.next.next\n" +
        "        if slow is fast: return True\n" +
        "    return False",
      notes: ["The while condition must check both fast and fast.next — otherwise fast.next.next throws."],
    },
  },
  code: {
    python: {
      code:
        "def has_cycle(head):\n" +
        "    slow = fast = head\n" +
        "    while fast and fast.next:\n" +
        "        slow = slow.next\n" +
        "        fast = fast.next.next\n" +
        "        if slow is fast: return True\n" +
        "    return False\n\n" +
        "def detect_cycle(head):\n" +
        "    slow = fast = head\n" +
        "    while fast and fast.next:\n" +
        "        slow = slow.next\n" +
        "        fast = fast.next.next\n" +
        "        if slow is fast:\n" +
        "            slow = head\n" +
        "            while slow is not fast:\n" +
        "                slow = slow.next\n" +
        "                fast = fast.next\n" +
        "            return slow\n" +
        "    return None\n\n" +
        "def middle_node(head):\n" +
        "    slow = fast = head\n" +
        "    while fast and fast.next:\n" +
        "        slow = slow.next\n" +
        "        fast = fast.next.next\n" +
        "    return slow\n\n" +
        "def find_duplicate(nums):\n" +
        "    # Array values are next pointers\n" +
        "    slow = fast = nums[0]\n" +
        "    while True:\n" +
        "        slow = nums[slow]\n" +
        "        fast = nums[nums[fast]]\n" +
        "        if slow == fast: break\n" +
        "    slow = nums[0]\n" +
        "    while slow != fast:\n" +
        "        slow = nums[slow]\n" +
        "        fast = nums[fast]\n" +
        "    return slow",
      notes: [
        "LeetCode 141 — Linked List Cycle (detect).",
        "LeetCode 142 — Linked List Cycle II (find start).",
        "LeetCode 287 — Find the Duplicate Number uses the array as a functional graph.",
      ],
    },
    java: {
      code:
        "boolean hasCycle(ListNode head) {\n" +
        "    ListNode slow = head, fast = head;\n" +
        "    while (fast != null && fast.next != null) {\n" +
        "        slow = slow.next;\n" +
        "        fast = fast.next.next;\n" +
        "        if (slow == fast) return true;\n" +
        "    }\n" +
        "    return false;\n" +
        "}\n\n" +
        "ListNode detectCycle(ListNode head) {\n" +
        "    ListNode slow = head, fast = head;\n" +
        "    while (fast != null && fast.next != null) {\n" +
        "        slow = slow.next;\n" +
        "        fast = fast.next.next;\n" +
        "        if (slow == fast) {\n" +
        "            slow = head;\n" +
        "            while (slow != fast) {\n" +
        "                slow = slow.next;\n" +
        "                fast = fast.next;\n" +
        "            }\n" +
        "            return slow;\n" +
        "        }\n" +
        "    }\n" +
        "    return null;\n" +
        "}\n\n" +
        "ListNode middleNode(ListNode head) {\n" +
        "    ListNode slow = head, fast = head;\n" +
        "    while (fast != null && fast.next != null) {\n" +
        "        slow = slow.next;\n" +
        "        fast = fast.next.next;\n" +
        "    }\n" +
        "    return slow;\n" +
        "}",
      notes: [
        "Java pointer comparison uses ==, which compares references — correct for linked list nodes.",
        "For arrays, use nums[slow] and nums[nums[fast]] to simulate next pointers.",
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
      { label: "O(n) time", reason: "Fast travels at most 2n steps before hitting null or meeting slow." },
      { label: "O(1) space", reason: "Only two pointer variables — no hash set." },
      { label: "Why cycle detection is bounded", reason: "Inside the cycle, fast gains one step per iteration. Meeting occurs within cycle-length steps." },
    ],
  },
  dryRun: {
    input: "List 1 → 2 → 3 → 4 → 5 → 6 → 3 (cycle back to 3)",
    initialState: "slow = fast = 1",
    steps: [
      { step: "1", state: "slow=2, fast=3", note: "" },
      { step: "2", state: "slow=3, fast=5", note: "" },
      { step: "3", state: "slow=4, fast=3", note: "Fast wrapped." },
      { step: "4", state: "slow=5, fast=5", note: "Meeting! Cycle exists." },
      { step: "5", state: "reset slow=1, fast=5; advance both by 1", note: "" },
      { step: "6", state: "slow=2, fast=6", note: "" },
      { step: "7", state: "slow=3, fast=3", note: "Meeting at cycle start = node 3." },
    ],
    output: "Cycle exists, starts at node 3",
  },
  whenToUse: [
    "Detect a cycle in a linked list (O(1) space).",
    "Find the cycle start node.",
    "Find the middle of a linked list.",
    "Find Nth node from end.",
    "Find a duplicate number where array values form a functional graph.",
    "Palindrome linked list — middle + reverse.",
  ],
  whenNotToUse: [
    "You need O(1) time — impossible, O(n) is required.",
    "You need the whole set of visited nodes — hash set is more useful then.",
    "Tree or DAG — no cycles to detect (use DFS for path detection).",
  ],
  mistakes: [
    { mistake: "Forgetting to check fast.next before fast.next.next.", fix: "The while condition must be while fast and fast.next — otherwise dereference null." },
    { mistake: "Confusing cycle start with meeting point.", fix: "The meeting point is inside the cycle but rarely the start. After they meet, reset one pointer to head and advance both by 1 to find the start." },
    { mistake: "Starting slow and fast from different positions.", fix: "Both must start from head. Different starts break the distance guarantee." },
    { mistake: "Even-length list middle ambiguity.", fix: "With fast starting at head, slow ends at the SECOND middle. Adjust initialization (e.g., fast = head.next for first middle) if that is what you need." },
  ],
  interview: {
    questions: [
      "Linked List Cycle (LeetCode 141).",
      "Linked List Cycle II (LeetCode 142) — find the start.",
      "Middle of the Linked List (LeetCode 876).",
      "Palindrome Linked List (LeetCode 234) — middle + reverse.",
      "Find the Duplicate Number (LeetCode 287) — array as functional graph.",
      "Happy Number (LeetCode 202).",
    ],
    observations: [
      "Fast/slow is the classic O(1)-space cycle detector.",
      "The 'reset to head' trick finds the cycle start in O(n).",
      "Array-to-graph conversion (a[i] as next) extends the pattern to arrays.",
    ],
    optimizations: [
      "Cycle start requires two phases but stays O(n).",
      "For 'Nth from end', use a fixed gap of N between the two pointers instead of 2x speed.",
    ],
    followUps: [
      "What if there are multiple cycles? — fast/slow finds one. For all, use DFS with colors.",
      "What if the graph has non-functional edges (multiple nexts)? — this pattern does not apply; use DFS.",
    ],
  },
  related: [
    { id: "two-pointers", relation: "Same family — two pointers, different speeds or directions" },
    { id: "bit-manipulation", relation: "Find-duplicate can also be solved with XOR (different approach)" },
  ],
  practice: [
    { title: "Linked List Cycle", difficulty: "Easy", why: "The basic detection template." },
    { title: "Linked List Cycle II", difficulty: "Medium", why: "Find the cycle start using reset-to-head." },
    { title: "Middle of the Linked List", difficulty: "Easy", why: "Fast/slow for middle in one pass." },
    { title: "Palindrome Linked List", difficulty: "Easy", why: "Middle + reverse second half + compare." },
    { title: "Find the Duplicate Number", difficulty: "Medium", why: "Array treated as functional graph." },
  ],
  revision: {
    takeaways: [
      "Fast moves 2x, slow moves 1x. Meet inside cycle → cycle exists.",
      "Reset one to head, advance both by 1 → cycle start.",
      "O(n) time, O(1) space.",
      "Works on any iterable with a 'next' function (including arrays).",
    ],
    formulas: [
      "slow = slow.next; fast = fast.next.next",
      "Meet = cycle. Reset slow=head, advance both by 1 → cycle start",
    ],
    complexitySummary: "O(n) time, O(1) space.",
    patterns: ["Cycle detection", "Find middle", "Nth from end", "Find duplicate"],
    memoryTrick: "Two runners, fast laps slow. Reset to head finds cycle start.",
  },
};
