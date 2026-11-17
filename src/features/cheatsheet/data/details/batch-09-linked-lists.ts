import type { ConceptDetail } from '../../types';

export const linkedListsDetail: ConceptDetail = {
  id: 'linked-lists',
  overview: {
    essence:
      'You never delete a node — you reconnect around it. The old node still exists in memory; you just stop pointing at it.',
    what:
      'Nodes holding a value plus a next pointer (and optionally prev). No random access — reaching index k costs O(k).',
    problemSolved:
      'O(1) insert/delete if you already hold the node, without shifting every element like an array.',
    whyImportant:
      'Pointer surgery is a skill; you cannot index a list. Every reverse / merge / detect-cycle problem is a pointer exercise.',
    usedIn: [
      'Reverse / merge lists',
      'Cycle detection (Floyd)',
      'LRU cache',
      'Adjacency lists',
      'Undo stacks',
    ],
  },
  intuition: {
    explanation:
      'Arrays shift O(n) elements on insert/delete. Lists pay O(n) to find the node but O(1) to relink. The trade is: do you already have the pointer?',
    analogy:
      'A chain of paperclips. To skip one, unclip the previous and re-clip it to the next. The skipped clip still exists — nothing points at it.',
  },
  internals: [
    { title: 'Node structure', body: 'Each node holds a value and a reference to the next node (and prev, if doubly linked).' },
    { title: 'Head pointer', body: 'The only reference to the whole list. Lose it and the list is orphaned.' },
    { title: 'Relinking', body: 'Remove a node: prev.next = node.next. Insert: new.next = cur.next; cur.next = new.' },
    { title: 'Dummy head trick', body: 'A sentinel node in front removes every head-specific special case.' },
  ],
  visual: {
    diagram:
      '  head\n' +
      '   |\n' +
      '   v\n' +
      ' [1] -> [2] -> [3] -> [4] -> None\n\n' +
      ' Delete 2:\n' +
      '   head.next = node(2).next\n' +
      '   => [1] -> [3] -> [4]\n' +
      '   (node(2) still exists in memory, unreachable)',
    caption: 'Pointer surgery: relink around the node.',
  },
  approach: {
    summary:
      'Traverse with two pointers (prev, cur). Reverse: rewire each cur.next to prev. Delete: skip over. Use a dummy head when the first node might change.',
    steps: [
      'prev = None, cur = head',
      'Loop while cur: save next, rewire cur.next = prev, advance prev = cur, cur = next',
      'Return prev (new head)',
    ],
    template: {
      code:
        'prev = None\n' +
        'while cur:\n' +
        '    nxt = cur.next\n' +
        '    cur.next = prev\n' +
        '    prev, cur = cur, nxt\n' +
        'return prev',
    },
  },
  code: {
    python: {
      code:
        'def reverse(head):\n' +
        '    prev, cur = None, head\n' +
        '    while cur:\n' +
        '        nxt = cur.next\n' +
        '        cur.next = prev\n' +
        '        prev, cur = cur, nxt\n' +
        '    return prev\n\n' +
        'def has_cycle(head):\n' +
        '    slow = fast = head\n' +
        '    while fast and fast.next:\n' +
        '        slow = slow.next\n' +
        '        fast = fast.next.next\n' +
        '        if slow is fast: return True\n' +
        '    return False',
      notes: ['Floyd cycle detection in O(1) space.'],
    },
    java: {
      code:
        'ListNode reverse(ListNode head) {\n' +
        '    ListNode prev = null, cur = head;\n' +
        '    while (cur != null) {\n' +
        '        ListNode nxt = cur.next;\n' +
        '        cur.next = prev;\n' +
        '        prev = cur;\n' +
        '        cur = nxt;\n' +
        '    }\n' +
        '    return prev;\n' +
        '}\n\n' +
        'boolean hasCycle(ListNode head) {\n' +
        '    ListNode slow = head, fast = head;\n' +
        '    while (fast != null && fast.next != null) {\n' +
        '        slow = slow.next;\n' +
        '        fast = fast.next.next;\n' +
        '        if (slow == fast) return true;\n' +
        '    }\n' +
        '    return false;\n' +
        '}',
      notes: ['Dummy head removes every head-specific special case.'],
    },
  },
  complexity: {
    best: 'O(1) insert at head',
    average: 'O(n) access by index',
    worst: 'O(n) traversal',
    auxiliary: 'O(1)',
    total: 'O(n) to visit, O(1) to modify at a held node',
    why: [
      { label: 'O(n) access', reason: 'Walk from the head one node at a time — no arithmetic index.' },
      { label: 'O(1) relink', reason: 'Given the node, changing its next pointer is one assignment.' },
    ],
  },
  dryRun: {
    input: 'head = 1 -> 2 -> 3 -> None',
    initialState: 'prev = None, cur = 1',
    steps: [
      { step: '1', state: 'save nxt = 2, rewire 1.next = None, prev = 1, cur = 2', note: 'First node points back to None.' },
      { step: '2', state: 'save nxt = 3, rewire 2.next = 1, prev = 2, cur = 3', note: 'Second node points to 1.' },
      { step: '3', state: 'save nxt = None, rewire 3.next = 2, prev = 3, cur = None', note: 'Third node points to 2.' },
    ],
    output: '3 -> 2 -> 1 -> None',
  },
  whenToUse: [
    'Insert/delete dominates and you already hold the node.',
    'You need O(1) reversal or splicing.',
    'Cycle detection, LRU cache, adjacency lists.',
  ],
  whenNotToUse: [
    'You need random access by index — use an array.',
    'Cache locality matters — arrays win.',
    'You need O(log n) search — balanced tree.',
  ],
  mistakes: [
    { mistake: 'Losing the head during reversal.', fix: 'Store prev at the end — it becomes the new head. Or use a dummy node.' },
    { mistake: 'Forgetting to save next before rewiring.', fix: 'Always save nxt = cur.next first.' },
    { mistake: 'Missing the null check on fast.next.', fix: 'while fast and fast.next — check both.' },
  ],
  interview: {
    questions: [
      'Reverse a linked list (iterative and recursive).',
      'Detect a cycle (Floyd).',
      'Merge two sorted lists.',
      'Remove N-th node from end (two pointers).',
      'Find the middle node (slow / fast).',
    ],
    observations: [
      'Two pointers (slow, fast) handle mid / cycle problems.',
      'Dummy head removes head-specific edge cases.',
      'O(n) to index but O(1) to relink.',
    ],
    optimizations: [
      'Cycle detection without a hash set — Floyd O(1) space.',
      'Palindrome check: find middle + reverse + compare.',
    ],
    followUps: [
      'Doubly linked: add prev pointers, O(1) delete given node.',
      'Circular: tail.next = head.',
      'LRU cache: doubly linked list + hash map.',
    ],
  },
  related: [
    { id: 'arrays', relation: 'Contiguous vs scattered memory' },
    { id: 'stacks-queues', relation: 'Both can be implemented with linked nodes' },
    { id: 'trees', relation: 'Trees are linked lists with two nexts' },
    { id: 'fast-slow-pointers', relation: 'Floyd uses two speeds on a linked list' },
  ],
  practice: [
    { title: 'Reverse Linked List', difficulty: 'Easy', why: 'The canonical pointer-surgery problem.' },
    { title: 'Linked List Cycle', difficulty: 'Easy', why: 'Floyd two-pointer detection.' },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy', why: 'Dummy head + pointer arithmetic.' },
    { title: 'Remove Nth Node From End of List', difficulty: 'Medium', why: 'Two-pointer with a gap.' },
    { title: 'LRU Cache', difficulty: 'Medium', why: 'Doubly linked list + hash map.' },
  ],
  revision: {
    takeaways: [
      'O(n) access, O(1) relink.',
      'Save next before rewiring.',
      'Dummy head removes edge cases.',
      'Floyd detects cycles in O(1) space.',
    ],
    formulas: [
      'Reverse: prev, cur = cur, cur.next (save next first)',
      'Middle: slow = slow.next, fast = fast.next.next',
    ],
    complexitySummary: 'Traverse O(n), insert/delete O(1) given the node, search O(n).',
    patterns: ['Reverse / merge', 'Cycle detection', 'Two-pointer mid / gap', 'Dummy head'],
    memoryTrick: 'Reconnect around the node. Save next, then rewire.',
  },
};
