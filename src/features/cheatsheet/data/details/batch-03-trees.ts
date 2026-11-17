import type { ConceptDetail } from '../../types';

export const treesDetail: ConceptDetail = {
  id: 'trees',
  overview: {
    essence: 'A tree is a recursive data structure. Every operation is do(root) + do(left) + do(right). The recursion IS the shape of the data.',
    what: 'A connected acyclic graph with a distinguished root. Each node has a value, at most one parent, and (in a binary tree) at most two children.',
    problemSolved:
      'Structures hierarchical data — file systems, HTML DOM, expression trees, decision trees. Provides O(log n) search when balanced (BST).',
    whyImportant:
      'Trees are the foundation for BSTs, heaps, tries, segment trees, and any recursive structure. The four traversals (pre, in, post, level) cover almost every tree problem.',
    usedIn: [
      'BSTs — ordered search',
      'Heaps — priority queues',
      'Tries — prefix lookup',
      'Segment trees — range queries',
      'Parse trees, DOM, file systems',
      'Decision trees, game trees',
    ],
  },
  intuition: {
    explanation:
      'A tree is self-similar: each subtree is itself a tree. That means any problem decomposes into "do something at the root, then do the same for each subtree." The recursion is not a trick — it is the actual structure of the data. When you write recursive code on a tree, you are just reading the shape.',
    analogy:
      'An org chart. Visiting every employee means: visit the CEO, then recursively visit each direct report. The hierarchy dictates the algorithm.',
  },
  internals: [
    { title: 'Node', body: 'Holds a value plus references to children (left/right for binary). No back-pointers by default.' },
    { title: 'Root', body: 'The single node with no parent. Every operation starts here.' },
    { title: 'Depth vs height', body: 'Depth of a node = edges from root. Height of a tree = edges on the longest root-to-leaf path. Height(empty) = 0; height(single node) = 0 or 1 depending on convention (usually 0 edges, 1 node).' },
    { title: 'Four traversals', body: 'Pre-order (root → left → right), In-order (left → root → right), Post-order (left → right → root), Level-order (BFS row by row).' },
    { title: 'Binary Search Tree (BST)', body: 'For every node, left subtree values < node < right subtree values. Enables O(log n) search when balanced.' },
    { title: 'Balance', body: 'A BST is O(log n) only if height is O(log n). A skewed tree is a linked list — O(n).' },
  ],
  visual: {
    vizId: 'tree-traversal-inorder',
    caption:
      'In-order traversal of a balanced BST. Watch the highlighted nodes visit in sorted order — this is the defining property of in-order on a BST.',
  },
  approach: {
    summary:
      'Pick the traversal by what you need. Recursion is the default. Pre-order for top-down information, in-order for BST operations, post-order for aggregation, level-order (BFS) for level-by-level or shortest path.',
    steps: [
      'Structural aggregates (height, sum, count) → post-order recursion.',
      'BST search, insert, delete → recursive descent guided by BST property.',
      'Copy / serialize a tree → pre-order.',
      'BST sorted output, k-th smallest → in-order.',
      'Shortest path, level processing, right-side view → level-order (BFS with a queue).',
      'Validate BST → in-order traversal must be strictly increasing.',
    ],
    template: {
      code:
        'def height(node):\n' +
        '    if node is None:\n' +
        '        return 0\n' +
        '    return 1 + max(height(node.left), height(node.right))',
      notes: ['Base case: empty tree has height 0. Every recursive call strictly shrinks the subtree.'],
    },
  },
  code: {
    python: {
      code:
        'class TreeNode:\n' +
        '    def __init__(self, val, left=None, right=None):\n' +
        '        self.val = val\n' +
        '        self.left = left\n' +
        '        self.right = right\n' +
        '\n' +
        'def height(node):\n' +
        '    if node is None:\n' +
        '        return 0\n' +
        '    return 1 + max(height(node.left), height(node.right))\n' +
        '\n' +
        'def inorder(node, out):\n' +
        '    if node is None: return\n' +
        '    inorder(node.left, out)\n' +
        '    out.append(node.val)\n' +
        '    inorder(node.right, out)\n' +
        '\n' +
        'def level_order(root):\n' +
        '    if root is None: return []\n' +
        '    from collections import deque\n' +
        '    out, q = [], deque([root])\n' +
        '    while q:\n' +
        '        n = q.popleft()\n' +
        '        out.append(n.val)\n' +
        '        if n.left: q.append(n.left)\n' +
        '        if n.right: q.append(n.right)\n' +
        '    return out',
      notes: ['Python recursion limit ~1000 — deep trees may need an explicit stack.', 'deque for BFS queue — list.pop(0) is O(n).'],
    },
    java: {
      code:
        'class TreeNode {\n' +
        '    int val; TreeNode left, right;\n' +
        '    TreeNode(int v) { val = v; }\n' +
        '}\n' +
        '\n' +
        'int height(TreeNode node) {\n' +
        '    if (node == null) return 0;\n' +
        '    return 1 + Math.max(height(node.left), height(node.right));\n' +
        '}\n' +
        '\n' +
        'void inorder(TreeNode node, java.util.List<Integer> out) {\n' +
        '    if (node == null) return;\n' +
        '    inorder(node.left, out);\n' +
        '    out.add(node.val);\n' +
        '    inorder(node.right, out);\n' +
        '}\n' +
        '\n' +
        'java.util.List<Integer> levelOrder(TreeNode root) {\n' +
        '    java.util.List<Integer> out = new java.util.ArrayList<>();\n' +
        '    if (root == null) return out;\n' +
        '    java.util.Deque<TreeNode> q = new java.util.ArrayDeque<>();\n' +
        '    q.add(root);\n' +
        '    while (!q.isEmpty()) {\n' +
        '        TreeNode n = q.poll();\n' +
        '        out.add(n.val);\n' +
        '        if (n.left != null) q.add(n.left);\n' +
        '        if (n.right != null) q.add(n.right);\n' +
        '    }\n' +
        '    return out;\n' +
        '}',
      notes: ['ArrayDeque is the recommended queue — faster than LinkedList.'],
    },
    cpp: {
      code:
        '#include <vector>\n' +
        '#include <queue>\n' +
        '#include <algorithm>\n' +
        '\n' +
        'struct TreeNode {\n' +
        '    int val;\n' +
        '    TreeNode* left = nullptr;\n' +
        '    TreeNode* right = nullptr;\n' +
        '    TreeNode(int v) : val(v) {}\n' +
        '};\n' +
        '\n' +
        'int height(TreeNode* node) {\n' +
        '    if (!node) return 0;\n' +
        '    return 1 + std::max(height(node->left), height(node->right));\n' +
        '}\n' +
        '\n' +
        'void inorder(TreeNode* node, std::vector<int>& out) {\n' +
        '    if (!node) return;\n' +
        '    inorder(node->left, out);\n' +
        '    out.push_back(node->val);\n' +
        '    inorder(node->right, out);\n' +
        '}\n' +
        '\n' +
        'std::vector<int> level_order(TreeNode* root) {\n' +
        '    std::vector<int> out;\n' +
        '    if (!root) return out;\n' +
        '    std::queue<TreeNode*> q;\n' +
        '    q.push(root);\n' +
        '    while (!q.empty()) {\n' +
        '        TreeNode* n = q.front(); q.pop();\n' +
        '        out.push_back(n->val);\n' +
        '        if (n->left) q.push(n->left);\n' +
        '        if (n->right) q.push(n->right);\n' +
        '    }\n' +
        '    return out;\n' +
        '}',
      notes: ['std::queue is the BFS container. Use std::stack for iterative DFS.'],
    },
  },
  languageNotes: [
    'Python: recursion limit ~1000 — use sys.setrecursionlimit or an explicit stack for deep trees.',
    'Java: default stack size varies (~512KB). Deep recursion can StackOverflowError.',
    'C++: no default recursion limit, but stack space is finite. Deep trees risk segfault.',
  ],
  complexity: {
    best: 'O(1) — find root',
    average: 'O(h) for search/insert/delete in a BST',
    worst: 'O(n) for a skewed BST',
    auxiliary: 'O(h) for recursion, O(n) for BFS queue',
    total: 'O(n) to visit every node (traversal)',
    why: [
      { label: 'Traversal is O(n)', reason: 'Every node is visited exactly once, regardless of order.' },
      { label: 'BST operations are O(h)', reason: 'Each comparison eliminates one subtree. h is the tree height.' },
      { label: 'BST worst case is O(n)', reason: 'A skewed tree (all left children) is a linked list. Height = n.' },
      { label: 'Balanced BST is O(log n)', reason: 'AVL and red-black trees maintain h = O(log n).' },
    ],
  },
  dryRun: {
    input: '     4\n    / \\\n   2   6\n  / \\ / \\\n 1  3 5  7',
    initialState: 'inorder(node=4): recurse left, visit 4, recurse right',
    steps: [
      { step: '1', state: 'inorder(2) → inorder(1) → visit 1', note: 'Leftmost first.' },
      { step: '2', state: 'visit 2 → inorder(3) → visit 3', note: 'Node 2 between children.' },
      { step: '3', state: 'visit 4', note: 'Root after left subtree.' },
      { step: '4', state: 'inorder(6) → inorder(5) → visit 5', note: 'Right subtree, leftmost.' },
      { step: '5', state: 'visit 6 → inorder(7) → visit 7', note: 'Node 6 between children.' },
    ],
    output: '[1, 2, 3, 4, 5, 6, 7] — sorted!',
  },
  whenToUse: [
    'The problem mentions "tree", "BST", "subtree", "depth", "ancestor", "leaf".',
    'You need ordered iteration with O(log n) insert/delete → BST or balanced tree.',
    'You need hierarchical data → tree.',
    'You need prefix lookup → trie.',
    'You need range queries → segment tree, Fenwick tree.',
    'You need a priority queue → heap (a tree with heap property).',
  ],
  whenNotToUse: [
    'You need O(1) lookup without ordering → hash map.',
    'You need ordered data without insert/delete → sorted array.',
    'You need bulk operations → array with sort.',
  ],
  mistakes: [
    { mistake: 'Confusing height and depth.', fix: 'Height = edges from node down to deepest leaf. Depth = edges from root to node. Height(empty)=0, height(single)=0 or 1 (pick a convention).' },
    { mistake: 'BST property uses strict inequality.', fix: 'For every node: left < node < right (strict). Duplicates need an explicit rule (usually left ≤ or right ≥, but stick to one).' },
    { mistake: 'Forgetting base case in recursion.', fix: 'Every recursive tree function starts with `if node is None: return <identity>`. Otherwise infinite recursion.' },
    { mistake: 'Missing successor in BST delete.', fix: 'When deleting a node with two children, replace with the successor (min of right subtree), not the right child directly.' },
    { mistake: 'Assuming BST is balanced.', fix: 'Without balancing (AVL, red-black), a BST can be O(n). Always state the complexity as O(h), where h = height.' },
    { mistake: 'Recursion depth on deep trees.', fix: 'A degenerate tree (all left children) has height n. Recursion is O(n) stack — use an explicit stack for safety.' },
  ],
  interview: {
    questions: [
      'Height of a binary tree.',
      'Check if a binary tree is a valid BST.',
      'Lowest Common Ancestor (LCA).',
      'Diameter of a binary tree.',
      'Serialize / deserialize a binary tree.',
      'Level-order traversal (BFS).',
      'Balanced tree check.',
    ],
    observations: [
      'In-order traversal of a BST is sorted — this is the defining property.',
      'Post-order recursion is the default for structural questions (height, diameter, sum).',
      'Pre-order is the default for "read the tree".',
      'Level-order is BFS — use a queue.',
    ],
    optimizations: [
      'Morris traversal: O(1) space in-order traversal by mutating tree temporarily.',
      'Iterative DFS with explicit stack avoids Python recursion limit.',
    ],
    followUps: [
      'What if the tree has duplicates? — define strict inequality rule; validate accordingly.',
      'What if you need O(log n) insert/delete? — balanced BST (AVL, red-black).',
      'What if the tree is threaded? — Morris traversal.',
    ],
  },
  related: [
    { id: 'recursion', relation: 'Trees are the canonical recursive data structure' },
    { id: 'binary-search', relation: 'BST search is binary search on a tree' },
  ],
  practice: [
    { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', why: 'Height — the simplest post-order recursion.' },
    { title: 'Invert Binary Tree', difficulty: 'Easy', why: 'Pre-order recursion; swap children at each node.' },
    { title: 'Validate Binary Search Tree', difficulty: 'Medium', why: 'In-order traversal must be strictly increasing (or bounds propagation).' },
    { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', why: 'BFS with a queue — one level at a time.' },
    { title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', why: 'Post-order recursion — search each side and combine.' },
    { title: 'Diameter of Binary Tree', difficulty: 'Medium', why: 'Post-order with a running max of left_height + right_height.' },
  ],
  revision: {
    takeaways: [
      'A tree is recursive — every operation is do(root) + do(left) + do(right).',
      'Four traversals: pre (top-down), in (sorted for BST), post (aggregate), level (BFS).',
      'BSTs are O(log n) only when balanced — always state O(h).',
      'Height(empty) = 0. The identity of +1.',
    ],
    formulas: [
      'height(node) = 0 if None else 1 + max(height(left), height(right))',
      'nodes_at_level(k) = 2^k (in a perfect binary tree)',
      'total_nodes(n levels) = 2^n − 1 (perfect binary tree)',
    ],
    complexitySummary: 'Traversal O(n) time, O(h) recursion space. BST search O(h), worst O(n). Balanced BST O(log n).',
    patterns: ['Structural recursion', 'In-order = sorted (BST)', 'Post-order = aggregate', 'Level-order = BFS'],
    memoryTrick: 'Pre = copy, In = sort (BST), Post = aggregate, Level = BFS. Height of empty is 0.',
  },
};
