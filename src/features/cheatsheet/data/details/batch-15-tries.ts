import type { ConceptDetail } from '../../types';

export const triesDetail: ConceptDetail = {
  id: 'tries',
  overview: {
    essence:
      'A trie stores strings by prefix. Lookup is O(length), independent of dictionary size. Every node is a character; every path from root spells a prefix.',
    what:
      'A tree where each node holds one character and children are indexed by next character. The root is empty. A node marked is_end terminates a complete word.',
    problemSolved:
      'O(L) prefix queries regardless of how many words share the prefix. A hash map is also O(L) for exact match, but a trie answers "does any word start with P?" without scanning keys.',
    whyImportant:
      'Autocomplete, spell check, IP routing, word search, and bitwise XOR problems all use tries. The "many strings, prefix queries" pattern is a trie — no other structure handles it cleanly.',
    usedIn: [
      'Autocomplete / suggestions',
      'Spell check',
      'Longest common prefix of N strings',
      'Word search on a grid with prefix pruning',
      'Binary trie for max XOR / min XOR pair',
      'IP routing tables (compressed tries)',
      'Reverse trie for suffix queries',
    ],
  },
  intuition: {
    explanation:
      'Store strings as paths from root. "cat" and "car" share the path c-a, then diverge at t vs r. Insert: walk/create one node per character, mark is_end at the terminal. Prefix query: walk the path; if any node is missing, prefix is absent. Word query: walk + check is_end. Lookup time is O(L) — independent of how many words are in the trie. This is the key difference from a hash map, where you also pay for hashing the whole key even on prefix misses.',
    analogy:
      'A filing cabinet where each drawer is a letter. To find "cat", open the "c" drawer, then "a", then "t". You never look at drawers for other starting letters. A shared prefix means shared drawers.',
  },
  internals: [
    {
      title: 'Node structure',
      body: 'Each node holds: (a) children — either a HashMap<char, Node> or a fixed array of size 26 (or 256) for ASCII; (b) is_end — a boolean marking that a word terminates here.',
    },
    {
      title: 'Insert(word)',
      body: 'Start at root. For each character: if the child does not exist, create it; descend. After the last character, set is_end = true on that node.',
    },
    {
      title: 'Search(word)',
      body: 'Walk down one node per character. If any character is missing, return false. After the last character, return node.is_end — the path existing is not enough.',
    },
    {
      title: 'StartsWith(prefix)',
      body: 'Walk down one node per character. If all characters are found, return true — do NOT check is_end. This is the prefix query.',
    },
    {
      title: 'Delete(word)',
      body: 'Walk the path; unset is_end at the terminal node. Optionally prune nodes with no children and no is_end (deferred pruning is easiest).',
    },
    {
      title: 'Compressed trie (radix tree)',
      body: 'Collapse single-child chains into one edge labelled with a string. Reduces memory dramatically for long strings with little branching. IP routing uses this.',
    },
    {
      title: 'Binary trie',
      body: 'Store integers bit by bit (32 levels for 32-bit ints). Each node has exactly 2 children: 0 and 1. Used for max XOR / min XOR pair in O(32·n).',
    },
    {
      title: 'Wildcard search',
      body: 'For "." matching any character, DFS at the wildcard node over all children. Still O(L · alphabet) per query, but skips branches quickly.',
    },
  ],
  visual: {
    diagram:
      'Words: ["cat", "car", "card", "dog", "do"]\n' +
      '\n' +
      '           (root)\n' +
      '          /      \\\n' +
      '         c        d\n' +
      '         |        |\n' +
      '         a        o*\n' +
      '        / \\       |\n' +
      '       t*  r*     g*\n' +
      '            \\\n' +
      '             d*\n' +
      '\n' +
      '  * = is_end (a complete word terminates here)\n' +
      '\n' +
      '  search("car")   → walk c→a→r, is_end = true  → true\n' +
      '  search("ca")    → walk c→a, is_end = false    → false\n' +
      '  startsWith("ca")→ walk c→a, path exists       → true\n' +
      "  startsWith(\"cb\")→ walk c, 'b' missing         → false",
    caption:
      'Shared prefixes share paths. The is_end flag distinguishes prefixes from complete words.',
  },
  approach: {
    summary:
      'Node = children map + is_end. Insert walks/creates the path, marks is_end. Search walks the path and checks is_end. startsWith walks the path and does not check is_end. Use a HashMap<char, Node> for the alphabet or an array of size 26 for lowercase-only.',
    steps: [
      'Define the node: children (map or array) + is_end boolean.',
      'Insert: walk one node per character, creating children as needed, mark is_end at the terminal.',
      'Search exact word: walk the path, return node.is_end at the terminal.',
      'Search prefix: walk the path, return true if all characters were found.',
      'Delete: walk the path, unset is_end. Prune empty nodes opportunistically.',
      'For max XOR: build a 32-level binary trie of the integers.',
    ],
    template: {
      code:
        'class Trie:\n' +
        '    def __init__(self):\n' +
        '        self.root = {}\n' +
        '    def insert(self, word):\n' +
        '        n = self.root\n' +
        '        for c in word:\n' +
        '            n = n.setdefault(c, {})\n' +
        '        n["_end"] = True\n' +
        '    def search(self, word):\n' +
        '        n = self.root\n' +
        '        for c in word:\n' +
        '            if c not in n: return False\n' +
        '            n = n[c]\n' +
        '        return n.get("_end", False)\n' +
        '    def starts_with(self, prefix):\n' +
        '        n = self.root\n' +
        '        for c in prefix:\n' +
        '            if c not in n: return False\n' +
        '            n = n[c]\n' +
        '        return True',
      notes: ['Dict-based children for clarity. Array of size 26 is faster but only for lowercase.'],
    },
  },
  code: {
    python: {
      code:
        'class TrieNode:\n' +
        '    __slots__ = ("children", "is_end")\n' +
        '    def __init__(self):\n' +
        '        self.children = {}\n' +
        '        self.is_end = False\n' +
        '\n' +
        'class Trie:\n' +
        '    def __init__(self):\n' +
        '        self.root = TrieNode()\n' +
        '\n' +
        '    def insert(self, word: str) -> None:\n' +
        '        node = self.root\n' +
        '        for c in word:\n' +
        '            if c not in node.children:\n' +
        '                node.children[c] = TrieNode()\n' +
        '            node = node.children[c]\n' +
        '        node.is_end = True\n' +
        '\n' +
        '    def search(self, word: str) -> bool:\n' +
        '        node = self.root\n' +
        '        for c in word:\n' +
        '            if c not in node.children: return False\n' +
        '            node = node.children[c]\n' +
        '        return node.is_end\n' +
        '\n' +
        '    def starts_with(self, prefix: str) -> bool:\n' +
        '        node = self.root\n' +
        '        for c in prefix:\n' +
        '            if c not in node.children: return False\n' +
        '            node = node.children[c]\n' +
        '        return True',
      notes: [
        '__slots__ reduces per-node memory — useful when n is huge.',
        'The only difference between search and starts_with is whether you return node.is_end or True.',
      ],
    },
    java: {
      code:
        'class Trie {\n' +
        '    static class Node {\n' +
        '        Node[] children = new Node[26];\n' +
        '        boolean isEnd;\n' +
        '    }\n' +
        '    private final Node root = new Node();\n' +
        '\n' +
        '    public void insert(String word) {\n' +
        '        Node n = root;\n' +
        '        for (char c : word.toCharArray()) {\n' +
        '            int i = c - \'a\';\n' +
        '            if (n.children[i] == null) n.children[i] = new Node();\n' +
        '            n = n.children[i];\n' +
        '        }\n' +
        '        n.isEnd = true;\n' +
        '    }\n' +
        '\n' +
        '    public boolean search(String word) {\n' +
        '        Node n = root;\n' +
        '        for (char c : word.toCharArray()) {\n' +
        '            n = n.children[c - \'a\'];\n' +
        '            if (n == null) return false;\n' +
        '        }\n' +
        '        return n.isEnd;\n' +
        '    }\n' +
        '\n' +
        '    public boolean startsWith(String prefix) {\n' +
        '        Node n = root;\n' +
        '        for (char c : prefix.toCharArray()) {\n' +
        '            n = n.children[c - \'a\'];\n' +
        '            if (n == null) return false;\n' +
        '        }\n' +
        '        return true;\n' +
        '    }\n' +
        '}',
      notes: [
        'Array of size 26 is fastest for lowercase ASCII. Use HashMap for Unicode or mixed case.',
        'Node is static — it holds no reference to the Trie itself.',
      ],
    },
    cpp: {
      code:
        '#include <string>\n' +
        '#include <array>\n' +
        '\n' +
        'class Trie {\n' +
        '    struct Node {\n' +
        '        std::array<Node*, 26> children{};\n' +
        '        bool isEnd = false;\n' +
        '    };\n' +
        '    Node* root = new Node();\n' +
        '\n' +
        'public:\n' +
        '    void insert(const std::string& word) {\n' +
        '        Node* n = root;\n' +
        '        for (char c : word) {\n' +
        '            int i = c - \'a\';\n' +
        '            if (!n->children[i]) n->children[i] = new Node();\n' +
        '            n = n->children[i];\n' +
        '        }\n' +
        '        n->isEnd = true;\n' +
        '    }\n' +
        '\n' +
        '    bool search(const std::string& word) {\n' +
        '        Node* n = root;\n' +
        '        for (char c : word) {\n' +
        '            n = n->children[c - \'a\'];\n' +
        '            if (!n) return false;\n' +
        '        }\n' +
        '        return n->isEnd;\n' +
        '    }\n' +
        '\n' +
        '    bool startsWith(const std::string& prefix) {\n' +
        '        Node* n = root;\n' +
        '        for (char c : prefix) {\n' +
        '            n = n->children[c - \'a\'];\n' +
        '            if (!n) return false;\n' +
        '        }\n' +
        '        return true;\n' +
        '    }\n' +
        '};',
      notes: [
        'std::array<Node*, 26> zero-initializes to nullptr.',
        'For production, use a pool allocator or std::unique_ptr<Node> with a container to free nodes.',
      ],
    },
  },
  languageNotes: [
    'Python dict-based nodes are the simplest but use more memory per node. Use __slots__ on the node class to reduce overhead.',
    'Java arrays of size 26 are fastest for lowercase ASCII. charAt() is O(1); toCharArray() is O(n).',
    'C++ std::array<Node*, 26> zero-initializes. Do not forget to free nodes if you are managing memory manually.',
    'All three: check is_end for word search, skip the check for prefix search.',
  ],
  complexity: {
    best: 'O(L) — insert/search/startsWith',
    average: 'O(L) — insert/search/startsWith',
    worst: 'O(L) — insert/search/startsWith',
    auxiliary: 'O(total characters × alphabet size)',
    total: 'O(L) time per operation, O(N × L × A) space',
    why: [
      {
        label: 'O(L) time',
        reason:
          'Insert, search, and startsWith each walk exactly one node per character. L = length of the word or prefix. Independent of how many words are stored.',
      },
      {
        label: 'O(total × alphabet) space',
        reason:
          'Each node holds an alphabet-sized children array. Worst case: no shared prefixes → one node per character across all words.',
      },
      {
        label: 'Prefix is faster than hash',
        reason:
          'A hash map hashes the whole key: O(L) even for a miss. A trie stops as soon as a character is missing, often in <L steps.',
      },
    ],
  },
  dryRun: {
    input: 'insert("cat"), insert("car"), insert("card"); search("car"); startsWith("ca")',
    initialState: 'root = {} (empty trie)',
    steps: [
      { step: '1', state: 'insert "cat": root.c → a → t, mark is_end at t', note: 'Path c-a-t built.' },
      { step: '2', state: 'insert "car": c exists, a exists, create r, mark is_end at r', note: 'Shared prefix c-a reused.' },
      { step: '3', state: 'insert "card": c→a→r exist, create d, mark is_end at d', note: 'Shared prefix c-a-r reused.' },
      { step: '4', state: 'search "car": walk c→a→r, is_end = true', note: 'Returns true.' },
      { step: '5', state: 'startsWith "ca": walk c→a, path exists', note: 'Returns true (no is_end check).' },
      { step: '6', state: 'search "ca": walk c→a, is_end = false', note: 'Returns false — "ca" is a prefix, not a word.' },
    ],
    output: 'search("car") = true, startsWith("ca") = true, search("ca") = false',
  },
  whenToUse: [
    'You need prefix queries ("does any word start with…").',
    'Autocomplete / suggestions: return all words under a prefix node via DFS.',
    'Word search on a grid: prune the DFS at the first character that has no valid prefix.',
    'Longest common prefix of N strings: walk until children diverge.',
    'Binary trie: max XOR pair, min XOR pair (LeetCode 421).',
    'IP routing tables, compressed tries.',
  ],
  whenNotToUse: [
    'Only exact-match lookup needed — hash map is simpler and often faster.',
    'Very few strings — trie node overhead exceeds any benefit.',
    'Wide alphabets with few strings — HashMap children is fine, but do not build a trie just for this.',
    'Suffix queries — you need a suffix trie or Aho-Corasick, not a plain prefix trie.',
  ],
  mistakes: [
    {
      mistake: 'Forgetting is_end — search returns true for prefixes.',
      fix:
        'A path existing only means it is a valid prefix. Mark is_end on the terminal node during insert, and check it during search.',
    },
    {
      mistake: 'Using an array of size 26 for non-lowercase input.',
      fix:
        'Use HashMap<Character, Node> or a size-256 array. For Unicode, use a proper character-indexed map.',
    },
    {
      mistake: 'Reaching for a trie when exact match is enough.',
      fix:
        'A hash map answers "is X in the set?" in O(L) too. Only prefer the trie when prefixes matter or when you need prefix-based iteration.',
    },
    {
      mistake: 'Building a trie when the number of strings is tiny.',
      fix:
        'Node overhead is ~50 bytes per node (dictionary-case). For 5 strings, brute force beats it.',
    },
    {
      mistake: 'A trie with a wide alphabet and no compression.',
      fix:
        'Compress chains into radix-tree edges (single-child chains collapsed) or use HashMap children.',
    },
  ],
  interview: {
    questions: [
      'Implement Trie (Prefix Tree) — LeetCode 208. The template.',
      'Design Add and Search Words Data Structure — wildcard "." LeetCode 211. DFS + skip-children for wildcards.',
      'Word Search II — LeetCode 212. Grid DFS with a trie for prefix pruning.',
      'Maximum XOR of Two Numbers in an Array — LeetCode 421. Binary trie of 32-bit ints.',
      'Longest Common Prefix of N strings — walk until children diverge.',
      'Search Suggestions System — LeetCode 1268. Trie + DFS with priority.',
    ],
    observations: [
      'Trie time is O(L) independent of n — that is the whole point.',
      'is_end is a one-bit distinction between "prefix" and "word". Every trie problem uses it.',
      'For grids, "word search" with a trie is dramatically faster than checking each dictionary word — the trie prunes at the first bad character.',
      'Binary trie (bitwise) solves XOR-optimization in O(32n), way faster than O(n²) pair enumeration.',
    ],
    optimizations: [
      'Compressed trie (radix tree) collapses single-child chains — memory drops 10× on long strings with little branching.',
      'Cache top-k completions at each node for O(1) autocomplete.',
      'For suffix queries, reverse the strings before inserting.',
      'Aho-Corasick = trie + failure links for multi-pattern matching in O(n + matches).',
    ],
    followUps: [
      'What if you need deletions? — unset is_end, opportunistically prune nodes with no children.',
      'What about wildcards in the middle? — DFS with character-agnostic exploration.',
      'What if the alphabet is Unicode? — swap array children for HashMap<Character, Node>.',
    ],
  },
  related: [
    { id: 'trees', relation: 'A trie is a tree with alphabet-indexed branching' },
    { id: 'hash-maps', relation: 'Alternative for exact-match; trie wins on prefix queries' },
  ],
  practice: [
    { title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', why: 'The template. Build it from scratch once, then reuse the pattern.' },
    { title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', why: 'Wildcard "." means DFS at the wildcard node — a trie variant, not a plain trie.' },
    { title: 'Word Search II', difficulty: 'Hard', why: 'Grid DFS + trie: prune the search at the first character without a valid prefix.' },
    { title: 'Maximum XOR of Two Numbers in an Array', difficulty: 'Medium', why: 'Binary trie of 32-bit integers — O(32n).' },
  ],
  revision: {
    takeaways: [
      'Trie stores strings by prefix. Lookup O(L), independent of n.',
      'is_end distinguishes a prefix from a word.',
      'Prefix queries are the whole reason a trie exists — a hash map does not help there.',
      'Binary trie solves XOR-optimization: 32 levels, 2 children per node.',
    ],
    formulas: [
      'Insert: walk/create one node per character, mark is_end at terminal.',
      'Search: walk, return is_end at terminal.',
      'Prefix: walk, return true if path exists (no is_end check).',
    ],
    complexitySummary: 'O(L) per operation. Space O(N × L × A) where A is alphabet size.',
    patterns: ['Autocomplete', 'Prefix count', 'Grid word search with pruning', 'Max XOR pair'],
    memoryTrick: 'Trie = tree of characters. Each path is a prefix. is_end marks complete words.',
  },
};
