import type { ConceptDetail } from '../../types';

export const stringMatchingDetail: ConceptDetail = {
  id: 'string-matching',
  overview: {
    essence:
      "Find pattern P in text T in O(n + m). Build a prefix table (LPS) so a mismatch falls back to the longest proper prefix that still matches — never re-scan what you already know.",
    what:
      "KMP (Knuth-Morris-Pratt). Build a failure function (LPS: longest proper prefix that is also a suffix) for the pattern. Then scan the text once, and on mismatch jump back using LPS instead of starting over.",
    problemSolved:
      "Naive string matching is O(n × m) in the worst case (e.g., T = 'aaaa...a', P = 'aaab'). KMP is O(n + m) always.",
    whyImportant:
      "First algorithm every string-matching course teaches. Powers grep, DNA search, and the base for Aho-Corasick multi-pattern matching.",
    usedIn: [
      "Substring search",
      "Repeated substring detection",
      "Shortest palindrome",
      "Multi-pattern matching (Aho-Corasick)",
      "Bioinformatics sequence search",
    ],
  },
  intuition: {
    explanation:
      "Naive matching restarts from index 1 of the pattern on every mismatch, re-checking characters it has already confirmed. KMP precomputes, for each prefix of the pattern, how far to fall back when a mismatch happens. If the pattern's first 2 chars are also its last 2 chars, then on mismatch you know the last 2 matched characters can serve as the next attempt's start. LPS[i] = length of the longest proper prefix of P[0..i] that is also a suffix of P[0..i].",
    analogy:
      "Matching a pattern on a ruler. When you fall off, do not slide back one tick — slide back to the last tick where the pattern still has a chance. LPS tells you exactly which tick that is.",
  },
  internals: [
    { title: "LPS array", body: "lps[i] = length of the longest proper prefix of P[0..i] that is also a suffix of P[0..i]. Example: P='abab', lps=[0,0,1,2]." },
    { title: "Building LPS in O(m)", body: "Use two pointers: len (prefix length) and i (suffix index). Match → len++, lps[i++]=len. Mismatch → len = lps[len-1] (fall back)." },
    { title: "Search pass", body: "Two pointers: i in text, j in pattern. Match → i++, j++. If j == len(P), found at i-j. Mismatch → j = lps[j-1] (fall back in pattern)." },
    { title: "Why O(n + m)", body: "i and j both move forward only in match steps; j moves backward only via the LPS array, bounded by total forward steps. Amortized O(n + m)." },
    { title: "Alternative algorithms", body: "Rabin-Karp (rolling hash, O(n + m) average), Z-algorithm (linear), Aho-Corasick (multi-pattern). All O(n + m) worst case." },
    { title: "Shortest palindrome trick", body: "Compute LPS of P + '#' + reverse(P). Answer length = n - lps[last] — that prefix is the longest palindromic prefix." },
  ],
  visual: {
    diagram:
      "Pattern P = 'ababaca'\n\n" +
      "Build LPS:\n" +
      "  i=0: lps[0]=0\n" +
      "  i=1 'b': no match → 0\n" +
      "  i=2 'a': matches P[0] → 1\n" +
      "  i=3 'b': matches P[1] → 2\n" +
      "  i=4 'a': matches P[2] → 3\n" +
      "  i=5 'c': mismatch → fall back to lps[2]=1. 'c' != P[1] 'b' → fall back to 0. 'c' != 'a' → 0\n" +
      "  i=6 'a': matches P[0] → 1\n" +
      "  lps = [0, 0, 1, 2, 3, 0, 1]\n\n" +
      "Search text 'abababacaba':\n" +
      "  Match until 'c' at text[7]. At that point j=5 (matched 'ababa').\n" +
      "  Mismatch → j = lps[4] = 3. Text index i stays at 7.\n" +
      "  Continue matching with j=3. Found 'ababac' at text[4..9].",
    caption:
      "LPS tells you the fallback position. Text pointer never goes backward.",
  },
  approach: {
    summary:
      "Build LPS array for pattern in O(m). Scan text with two pointers. Match → advance both. Mismatch → pattern pointer falls back to lps[j-1]. Total O(n + m).",
    steps: [
      "Build LPS: len=0, i=1. While i < m: if P[i] == P[len]: len++; lps[i] = len; i++. Else if len > 0: len = lps[len-1]. Else: lps[i] = 0; i++.",
      "Search: i (text), j (pattern) = 0, 0. While i < n: if T[i] == P[j]: i++; j++. If j == m: found at i-j; j = lps[j-1]. Else if j > 0: j = lps[j-1]. Else: i++.",
    ],
    template: {
      code:
        "def build_lps(p):\n" +
        "    lps = [0] * len(p)\n" +
        "    length, i = 0, 1\n" +
        "    while i < len(p):\n" +
        "        if p[i] == p[length]:\n" +
        "            length += 1\n" +
        "            lps[i] = length\n" +
        "            i += 1\n" +
        "        elif length > 0:\n" +
        "            length = lps[length - 1]\n" +
        "        else:\n" +
        "            lps[i] = 0\n" +
        "            i += 1\n" +
        "    return lps",
      notes: ["LPS is the entire trick — master it once, apply everywhere."],
    },
  },
  code: {
    python: {
      code:
        "def kmp_search(text, pattern):\n" +
        "    if not pattern: return 0\n" +
        "    lps = build_lps(pattern)\n" +
        "    i = j = 0\n" +
        "    occurrences = []\n" +
        "    while i < len(text):\n" +
        "        if text[i] == pattern[j]:\n" +
        "            i += 1\n" +
        "            j += 1\n" +
        "            if j == len(pattern):\n" +
        "                occurrences.append(i - j)\n" +
        "                j = lps[j - 1]\n" +
        "        elif j > 0:\n" +
        "            j = lps[j - 1]\n" +
        "        else:\n" +
        "            i += 1\n" +
        "    return occurrences\n\n" +
        "def build_lps(p):\n" +
        "    lps = [0] * len(p)\n" +
        "    length, i = 0, 1\n" +
        "    while i < len(p):\n" +
        "        if p[i] == p[length]:\n" +
        "            length += 1\n" +
        "            lps[i] = length\n" +
        "            i += 1\n" +
        "        elif length > 0:\n" +
        "            length = lps[length - 1]\n" +
        "        else:\n" +
        "            lps[i] = 0\n" +
        "            i += 1\n" +
        "    return lps",
      notes: [
        "LeetCode 28 — Find the Index of the First Occurrence in a String.",
        "LeetCode 214 — Shortest Palindrome uses LPS of P + '#' + reverse(P).",
      ],
    },
  },
  complexity: {
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(n + m)",
    auxiliary: "O(m)",
    total: "O(n + m) time, O(m) space",
    why: [
      { label: "O(m) to build LPS", reason: "Two pointers; the fallback (length = lps[length-1]) never rewinds past what was already advanced." },
      { label: "O(n) to search", reason: "Text pointer i only moves forward. Pattern pointer j moves forward on match, falls back via LPS — total backward moves bounded by total forward moves." },
      { label: "O(m) space", reason: "LPS array of size m." },
    ],
  },
  whenToUse: [
    "Find all occurrences of pattern P in text T.",
    "Repeated substring / pattern detection.",
    "Shortest palindromic prefix/suffix.",
    "Any 'pattern appears in text' problem where performance matters.",
  ],
  whenNotToUse: [
    "Very short strings — Python 'in' is C-implemented and faster.",
    "Regex features needed — use re module.",
    "Multiple patterns — Aho-Corasick is KMP generalized.",
  ],
  mistakes: [
    { mistake: "Confusing LPS with prefix-suffix of the pattern vs text.", fix: "LPS is built only from the pattern. Text is only scanned once." },
    { mistake: "Not using lps[j-1] on mismatch.", fix: "The fallback is always to the LPS of the previous matched position, not the current." },
    { mistake: "Building LPS with the wrong base case.", fix: "lps[0] = 0 always — a single char has no proper prefix." },
  ],
  interview: {
    questions: [
      "Find the Index of the First Occurrence in a String (LeetCode 28).",
      "Shortest Palindrome (LeetCode 214).",
      "Repeated Substring Pattern (LeetCode 459).",
      "Repeated String Match (LeetCode 686).",
    ],
    observations: [
      "LPS powers 4+ string problems beyond basic search.",
      "Rabin-Karp is often simpler to code — acceptable when hash collisions are tolerable.",
      "Python's built-in 'in' uses a linear-time algorithm — often faster than hand-rolled KMP.",
    ],
    optimizations: [
      "Rabin-Karp (rolling hash) for multi-pattern search.",
      "Z-algorithm for similar problems with simpler logic.",
      "Aho-Corasick for multi-pattern matching in O(n + sum(|P|) + matches).",
    ],
    followUps: [
      "What about multiple patterns? — Aho-Corasick.",
      "What about matching with wildcards? — harder; often regex or DP-based.",
    ],
  },
  related: [
    { id: "tries", relation: "Aho-Corasick = trie + KMP failure links" },
  ],
  practice: [
    { title: "Find the Index of the First Occurrence in a String", difficulty: "Easy", why: "The basic KMP search problem." },
    { title: "Shortest Palindrome", difficulty: "Hard", why: "KMP on P + # + reverse(P) — elegant reduction." },
    { title: "Repeated Substring Pattern", difficulty: "Easy", why: "LPS check — if n % (n - lps[n-1]) == 0, pattern repeats." },
    { title: "Repeated String Match", difficulty: "Medium", why: "KMP or efficient 'in' check." },
  ],
  revision: {
    takeaways: [
      "KMP finds pattern in O(n + m) via LPS.",
      "LPS[i] = longest proper prefix of P[0..i] that is also a suffix.",
      "On mismatch, fall back via lps[j-1] — never restart from 0.",
      "Text pointer never goes backward.",
    ],
    formulas: [
      "lps[i] built via length = lps[length-1] on mismatch",
      "Shortest palindrome length = n - lps[last of P + '#' + reverse(P)]",
    ],
    complexitySummary: "O(n + m) time, O(m) space.",
    patterns: ["Pattern search", "Repeated substring", "Shortest palindrome"],
    memoryTrick: "LPS: longest prefix that is also a suffix. Fallback, never restart.",
  },
};
