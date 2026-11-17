import type { ConceptDetail } from "../../types";

export const lcsDetail: ConceptDetail = {
  id: "lcs",
  overview: {
    essence:
      "Longest sequence in both strings. 2D DP: match → diagonal+1; mismatch → max(up, left). O(m×n).",
    what: "Longest Common Subsequence: the longest sequence of characters that appears in the same relative order in both strings, not necessarily contiguous.",
    problemSolved:
      "Comparing DNA sequences, diffing files, spell correction, and any similarity measure between two strings. Also the base pattern for edit distance and shortest common supersequence.",
    whyImportant:
      "The canonical 2D DP. Once the LCS recurrence is internalized, edit distance, shortest common supersequence, delete operation, and distinct subsequences follow mechanically.",
    usedIn: [
      "Text diffing (git, GitHub PR view)",
      "DNA / protein sequence alignment",
      "Spell-check and fuzzy string matching",
      "Shortest common supersequence",
      "Edit distance base pattern",
      "Longest palindromic subsequence (LCS of s and reverse(s))",
    ],
  },
  intuition: {
    explanation:
      "Consider prefixes of the two strings. If the last characters match, they are part of the LCS — solve LCS of the shorter prefixes and add 1. If they do not match, at least one of the two last characters is not in the LCS — try both options (drop one from either string) and take the max. Each subproblem is LCS(i, j) for prefix lengths i and j, giving an O(m × n) DP table.",
    analogy:
      "Two people walking through two strings side by side. When they see the same letter, they mark it and advance both. When different, one person advances (and they remember the better result). It is like aligning two strings to highlight commonality.",
  },
  internals: [
    {
      title: "State",
      body: "dp[i][j] = length of LCS of s1[0..i-1] and s2[0..j-1]. Prefix lengths, not suffixes, so filling order is straightforward.",
    },
    {
      title: "Base cases",
      body: "dp[0][j] = 0 and dp[i][0] = 0 — one string empty means no common subsequence.",
    },
    {
      title: "Recurrence",
      body: "If s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]. Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    },
    {
      title: "Two cases",
      body: "Match (diagonal move) → +1. Mismatch (best of skip one from s1 or skip one from s2). No other transitions.",
    },
    {
      title: "Answer location",
      body: "dp[m][n] — the bottom-right cell — is the LCS length of the full strings.",
    },
    {
      title: "Reconstruction",
      body: "Walk backward from dp[m][n]: if characters match, prepend and move diagonal; else move left or up to the larger. Yields the actual subsequence, not just its length.",
    },
    {
      title: "Space optimization",
      body: "Only the previous row is needed → O(n) space. But reconstruction needs the full table (or Hirschberg), so keep O(m × n) when path is required.",
    },
  ],
  visual: {
    diagram:
      's1 = "abcde", s2 = "ace"\n\n' +
      "       ''  a  c  e\n" +
      "    ''  0  0  0  0\n" +
      "    a   0  1  1  1\n" +
      "    b   0  1  1  1\n" +
      "    c   0  1  2  2\n" +
      "    d   0  1  2  2\n" +
      "    e   0  1  2  3\n\n" +
      "dp[i][j]:\n" +
      "  if s1[i-1] == s2[j-1]: dp[i-1][j-1] + 1  (diagonal)\n" +
      "  else:                  max(dp[i-1][j], dp[i][j-1])  (up or left)\n\n" +
      'Answer: dp[m][n] = 3, LCS = "ace"',
    caption:
      "Fill row by row, left to right. Each cell depends on up, left, or diagonal.",
  },
  approach: {
    summary:
      "Build an (m+1) × (n+1) table of zeros. For each cell: match → 1 + diagonal; mismatch → max(up, left). Answer is bottom-right.",
    steps: [
      "Allocate dp[m+1][n+1] initialized to 0.",
      "For i in 1..m, j in 1..n:",
      "  If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1",
      "  Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
      "Answer = dp[m][n]. To reconstruct, walk back from (m, n).",
    ],
    template: {
      code:
        "dp = [[0]*(n+1) for _ in range(m+1)]\n" +
        "for i in range(1, m+1):\n" +
        "    for j in range(1, n+1):\n" +
        "        if s1[i-1] == s2[j-1]:\n" +
        "            dp[i][j] = 1 + dp[i-1][j-1]\n" +
        "        else:\n" +
        "            dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n" +
        "return dp[m][n]",
      notes: [
        "Only two cases: match (diagonal) or mismatch (max of up/left).",
        "O(m × n) space. Reduce to O(n) if only length is needed.",
      ],
    },
  },
  code: {
    python: {
      code:
        "def lcs_length(s1: str, s2: str) -> int:\n" +
        "    m, n = len(s1), len(s2)\n" +
        "    dp = [[0] * (n + 1) for _ in range(m + 1)]\n" +
        "    for i in range(1, m + 1):\n" +
        "        for j in range(1, n + 1):\n" +
        "            if s1[i-1] == s2[j-1]:\n" +
        "                dp[i][j] = 1 + dp[i-1][j-1]\n" +
        "            else:\n" +
        "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n" +
        "    return dp[m][n]\n\n" +
        "def lcs_string(s1: str, s2: str) -> str:\n" +
        "    m, n = len(s1), len(s2)\n" +
        "    dp = [[0] * (n + 1) for _ in range(m + 1)]\n" +
        "    for i in range(1, m + 1):\n" +
        "        for j in range(1, n + 1):\n" +
        "            if s1[i-1] == s2[j-1]:\n" +
        "                dp[i][j] = 1 + dp[i-1][j-1]\n" +
        "            else:\n" +
        "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n" +
        "    out = []\n" +
        "    i, j = m, n\n" +
        "    while i > 0 and j > 0:\n" +
        "        if s1[i-1] == s2[j-1]:\n" +
        "            out.append(s1[i-1])\n" +
        "            i -= 1; j -= 1\n" +
        "        elif dp[i-1][j] >= dp[i][j-1]:\n" +
        "            i -= 1\n" +
        "        else:\n" +
        "            j -= 1\n" +
        '    return "".join(reversed(out))',
      notes: [
        "Reconstruction uses the DP table as a maze — walk backward and pick the matching move.",
        "For length-only, use O(n) space by keeping only the previous row.",
      ],
    },
    java: {
      code:
        "int lcsLength(String s1, String s2) {\n" +
        "    int m = s1.length(), n = s2.length();\n" +
        "    int[][] dp = new int[m + 1][n + 1];\n" +
        "    for (int i = 1; i <= m; i++) {\n" +
        "        for (int j = 1; j <= n; j++) {\n" +
        "            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {\n" +
        "                dp[i][j] = 1 + dp[i - 1][j - 1];\n" +
        "            } else {\n" +
        "                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[m][n];\n" +
        "}",
      notes: [
        "charAt is O(1); prefer int[] arrays over Integer[] to avoid boxing overhead.",
        "Alternative: 1D array with a temp variable to preserve the diagonal value.",
      ],
    },
    cpp: {
      code:
        "#include <string>\n" +
        "#include <vector>\n" +
        "#include <algorithm>\n\n" +
        "int lcs_length(const std::string& s1, const std::string& s2) {\n" +
        "    int m = s1.size(), n = s2.size();\n" +
        "    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));\n" +
        "    for (int i = 1; i <= m; i++) {\n" +
        "        for (int j = 1; j <= n; j++) {\n" +
        "            if (s1[i - 1] == s2[j - 1])\n" +
        "                dp[i][j] = 1 + dp[i - 1][j - 1];\n" +
        "            else\n" +
        "                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);\n" +
        "        }\n" +
        "    }\n" +
        "    return dp[m][n];\n" +
        "}",
      notes: [
        "Same recurrence. Use std::string_view for read-only args.",
        "Space-optimized variant uses two rows of size n+1.",
      ],
    },
  },
  languageNotes: [
    "Python: strings are immutable; index s[i-1] is O(1). Rows as list comprehensions.",
    "Java: charAt is O(1); prefer int[] arrays over Integer[] to avoid boxing overhead.",
    "C++: string::operator[] is O(1); use std::vector<std::vector<int>> for clarity or a flat vector for speed.",
  ],
  complexity: {
    best: "O(m × n)",
    average: "O(m × n)",
    worst: "O(m × n)",
    auxiliary: "O(m × n) full table · O(n) for length only",
    total: "O(m × n) time, O(m × n) space (O(n) with rolling array)",
    why: [
      {
        label: "O(m × n) time",
        reason:
          "One cell per (i, j) pair, each computed in O(1). Total work = m × n cells.",
      },
      {
        label: "O(m × n) space",
        reason:
          "Full table needed for reconstruction. For length only, dp[i][j] depends on row i-1 only, so two rows suffice → O(n).",
      },
      {
        label: "Rolling array optimization",
        reason:
          "Keep one row and one scalar (for the diagonal) and overwrite in place → O(n) space.",
      },
    ],
  },
  dryRun: {
    input: 's1 = "abcde", s2 = "ace"',
    initialState: "dp table initialized to zeros, size 6 × 4",
    steps: [
      {
        step: "1",
        state: "i=1 (a): dp[1][1]=1 (a==a), dp[1][2]=1, dp[1][3]=1",
        note: "a matches s2[0].",
      },
      {
        step: "2",
        state: "i=2 (b): b != a, b != c, b != e → all 1",
        note: "b not in s2.",
      },
      {
        step: "3",
        state: "i=3 (c): dp[3][2]=2 (c==c), dp[3][3]=2",
        note: "c matches s2[1].",
      },
      {
        step: "4",
        state: "i=4 (d): d not in s2 → copies row 3",
        note: "d not in s2.",
      },
      {
        step: "5",
        state: "i=5 (e): dp[5][3]=3 (e==e)",
        note: "e matches s2[2].",
      },
    ],
    output: 'dp[5][3] = 3, LCS = "ace"',
  },
  whenToUse: [
    "Longest common subsequence of two strings (not substring — subsequence can skip).",
    "Diffing / comparing versions of a file.",
    "DNA / sequence alignment.",
    "Longest palindromic subsequence = LCS(s, reverse(s)).",
    "Shortest common supersequence = m + n - LCS.",
    "Edit distance base pattern (extend LCS with delete/insert/replace costs).",
  ],
  whenNotToUse: [
    "Longest common substring (contiguous) — different DP, not LCS.",
    'You only need "do they share any subsequence" — cheaper checks exist.',
    "Two strings are huge and you need length only — Hirschberg gives O(n) space but O(m × n) time.",
    "Approximate matching — use a proper edit-distance DP.",
  ],
  mistakes: [
    {
      mistake: "Confusing subsequence with substring.",
      fix: "Subsequence can skip characters. Substring must be contiguous. LCS allows gaps; longest common substring requires a different recurrence.",
    },
    {
      mistake: "Forgetting the mismatch case.",
      fix: "If chars differ, dp[i][j] = max(up, left). Forgetting this and only handling matches leaves the table with zeros in between.",
    },
    {
      mistake: "Using dp dimensions m × n instead of (m+1) × (n+1).",
      fix: "Base row and column of zeros represent empty prefixes. Without them, the first row/col needs special-case logic.",
    },
    {
      mistake: "Trying to reconstruct without the full table.",
      fix: "Reconstruction needs each cell's value. If you roll rows for space, you cannot reconstruct — choose one.",
    },
  ],
  interview: {
    questions: [
      "Longest Common Subsequence (LeetCode 1143) — the template.",
      "Longest Common Substring — different recurrence.",
      "Edit Distance (LeetCode 72) — extends LCS with insert/delete/replace.",
      "Shortest Common Supersequence (LeetCode 1092).",
      "Longest Palindromic Subsequence (LeetCode 516) — LCS of s and reverse(s).",
      "Delete Operation for Two Strings (LeetCode 583) — m + n - 2 × LCS.",
      "Distinct Subsequences (LeetCode 115) — a variant.",
    ],
    observations: [
      "LCS is the base of 6+ related DP problems. Internalize the recurrence.",
      "Match → diagonal + 1. Mismatch → max(up, left). Two rules total.",
      "Rolling array drops space to O(n) when you don't need reconstruction.",
    ],
    optimizations: [
      "Roll two rows when only length is needed. O(n) space.",
      "Recursive memoization for readability, bottom-up for speed.",
      "For reconstruction with O(n) space, use Hirschberg (divide and conquer).",
    ],
    followUps: [
      "What if strings are huge (100k × 100k)? — no DP fits in memory. Bit-parallel LCS (Hyyrö) or Myers diff.",
      "What about k strings? — O(n^k) DP, expensive. Use heuristic alignment.",
    ],
  },
  related: [
    {
      id: "tries",
      relation: "Suffix tries solve some string-similarity variants",
    },
  ],
  practice: [
    {
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      why: "The template. Understand the recurrence before anything else.",
    },
    {
      title: "Edit Distance",
      difficulty: "Hard",
      why: "Extends LCS with three operations — insert, delete, replace.",
    },
    {
      title: "Shortest Common Supersequence",
      difficulty: "Hard",
      why: "m + n - LCS, plus reconstruction.",
    },
    {
      title: "Delete Operation for Two Strings",
      difficulty: "Medium",
      why: "m + n - 2 × LCS.",
    },
    {
      title: "Longest Palindromic Subsequence",
      difficulty: "Medium",
      why: "LCS of s and reverse(s).",
    },
    {
      title: "Distinct Subsequences",
      difficulty: "Hard",
      why: "LCS-shaped recurrence with counting instead of length.",
    },
  ],
  revision: {
    takeaways: [
      "LCS is 2D DP: match → +1 diagonal; mismatch → max(up, left).",
      "O(m × n) time, O(n) space with rolling rows.",
      "Answer is dp[m][n], bottom-right.",
      "6+ DP problems reduce to LCS or its variants.",
    ],
    formulas: [
      "dp[i][j] = dp[i-1][j-1] + 1 if match",
      "dp[i][j] = max(dp[i-1][j], dp[i][j-1]) else",
      "Longest palindromic subsequence = LCS(s, reverse(s))",
    ],
    complexitySummary:
      "O(m × n) time. O(m × n) space (O(n) with rolling rows).",
    patterns: ["Two-string DP", "Sequence alignment", "Diffing"],
    memoryTrick:
      "Match diagonal, else max of up and left. Bottom-right is the answer.",
  },
};
