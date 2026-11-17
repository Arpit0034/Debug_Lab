import type { ConceptDetail } from "../../types";

export const fastExponentiationDetail: ConceptDetail = {
  id: "fast-exponentiation",
  overview: {
    essence:
      "Compute aⁿ in O(log n) by repeated squaring. Halve exponent each step. Matrix version for recurrences.",
    what: "Binary exponentiation. Iteratively or recursively square the base and halve the exponent. Used for powers, modular exponentiation, and matrix exponentiation.",
    problemSolved:
      "Naive a^n is O(n) multiplications. Fast exponentiation is O(log n). Essential when n can be 10^9 or larger, or when the result is computed modulo some prime.",
    whyImportant:
      "Appears in cryptography (RSA, Diffie-Hellman), competitive programming (modular powers), and matrix-power DP problems (Fibonacci in O(log n)).",
    usedIn: [
      "Modular exponentiation (a^n mod p)",
      "Matrix exponentiation (Fibonacci log n, linear recurrences)",
      "Compute x^n (LeetCode 50)",
      "Super Pow (a^b mod 1337)",
      "Count Good Numbers (even/odd digit positions)",
    ],
  },
  intuition: {
    explanation:
      "To compute a^16, do not multiply a sixteen times. Compute a^2, square to a^4, square to a^8, square to a^16 — 4 multiplications. More generally, a^n = a^(n/2) squared (n even) or a times a^(n-1) (n odd). Halving n each step gives O(log n) multiplications. Matrix version: same trick with matrix multiplication, giving O(log n) matrix multiplications — enough to compute Fibonacci(10^18).",
    analogy:
      "Exponentiation by repeated squaring is like folding a piece of paper. Fold once to double the layers, fold again to quadruple, again for 8, 16, 32. To reach 1024 layers, you only need 10 folds (since 2^10 = 1024).",
  },
  internals: [
    {
      title: "Even exponent",
      body: "a^n = (a^(n/2))^2. One multiplication of the half-power with itself.",
    },
    { title: "Odd exponent", body: "a^n = a * a^(n-1). Reduce to even case." },
    {
      title: "Iterative form",
      body: "result = 1, base = a. While n > 0: if n is odd: result *= base; base *= base; n >>= 1.",
    },
    {
      title: "Negative exponent",
      body: "a^(-n) = 1 / a^n. Compute a^n then invert, or invert base to 1/a before the loop.",
    },
    {
      title: "Modular variant",
      body: "Take % mod after each multiplication to keep values small. Essential when n is huge.",
    },
    {
      title: "Matrix power",
      body: "Same algorithm, matrices instead of scalars. Fibonacci: [[1,1],[1,0]]^n has F(n) in one entry — O(log n).",
    },
    {
      title: "Why bit-shift on exponent",
      body: "n >>= 1 halves n. Examines bits of n from LSB; each '1' bit means multiply a power of base into result.",
    },
  ],
  visual: {
    diagram:
      "Compute 2^10 iteratively (n=10 in binary: 1010):\n\n" +
      "result=1, base=2, n=10\n" +
      "  n even → base=base*base=4, n=5\n" +
      "  n odd  → result*=base=4, base=16, n=2\n" +
      "  n even → base=256, n=1\n" +
      "  n odd  → result*=base=1024, base=65536, n=0\n" +
      "return 1024\n\n" +
      "Four multiplications instead of ten.\n\n" +
      "Matrix Fibonacci:\n" +
      "  [F(n+1) F(n)]   = [[1,1],[1,0]]^n\n" +
      "  [F(n)   F(n-1)]\n\n" +
      "  So F(n) via O(log n) matrix multiplications.",
    caption:
      "Each iteration squares base and halves exponent. Number of loops = number of bits in n.",
  },
  approach: {
    summary:
      "Iterative or recursive. Track result=1, base=a. While n > 0: if n odd, multiply result by base; square base; halve n. Apply mod at each step if required.",
    steps: [
      "Handle n = 0 → return 1.",
      "Handle negative n → invert base: a = 1/a, n = -n.",
      "result = 1, base = a.",
      "While n > 0: if n & 1: result *= base; base *= base; n >>= 1.",
      "Return result.",
    ],
    template: {
      code:
        "def power(a, n):\n" +
        "    if n < 0:\n" +
        "        a, n = 1 / a, -n\n" +
        "    result = 1\n" +
        "    while n > 0:\n" +
        "        if n & 1:\n" +
        "            result *= a\n" +
        "        a *= a\n" +
        "        n >>= 1\n" +
        "    return result",
      notes: ["Negative n requires float division or a reciprocal type."],
    },
  },
  code: {
    python: {
      code:
        "def my_pow(x, n):\n" +
        "    if n < 0:\n" +
        "        x, n = 1 / x, -n\n" +
        "    result = 1.0\n" +
        "    while n > 0:\n" +
        "        if n & 1:\n" +
        "            result *= x\n" +
        "        x *= x\n" +
        "        n >>= 1\n" +
        "    return result\n\n" +
        "def pow_mod(a, n, m):\n" +
        "    result = 1\n" +
        "    a %= m\n" +
        "    while n > 0:\n" +
        "        if n & 1:\n" +
        "            result = (result * a) % m\n" +
        "        a = (a * a) % m\n" +
        "        n >>= 1\n" +
        "    return result\n\n" +
        "def fib(n):\n" +
        "    if n <= 1: return n\n" +
        "    def mat_mul(A, B):\n" +
        "        return [\n" +
        "            [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],\n" +
        "            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]],\n" +
        "        ]\n" +
        "    def mat_pow(M, k):\n" +
        "        result = [[1, 0], [0, 1]]\n" +
        "        while k > 0:\n" +
        "            if k & 1:\n" +
        "                result = mat_mul(result, M)\n" +
        "            M = mat_mul(M, M)\n" +
        "            k >>= 1\n" +
        "        return result\n" +
        "    return mat_pow([[1,1],[1,0]], n)[0][1]",
      notes: [
        "Python built-in pow(a, n, m) does modular exponentiation in C.",
        "Matrix Fibonacci handles n up to 10^18 in ~60 multiplications.",
      ],
    },
    java: {
      code:
        "double myPow(double x, int n) {\n" +
        "    long N = n;\n" +
        "    if (N < 0) { x = 1 / x; N = -N; }\n" +
        "    double result = 1.0;\n" +
        "    while (N > 0) {\n" +
        "        if ((N & 1) == 1) result *= x;\n" +
        "        x *= x;\n" +
        "        N >>= 1;\n" +
        "    }\n" +
        "    return result;\n" +
        "}\n\n" +
        "long powMod(long a, long n, long m) {\n" +
        "    long result = 1;\n" +
        "    a %= m;\n" +
        "    while (n > 0) {\n" +
        "        if ((n & 1) == 1) result = (result * a) % m;\n" +
        "        a = (a * a) % m;\n" +
        "        n >>= 1;\n" +
        "    }\n" +
        "    return result;\n" +
        "}",
      notes: [
        "Use long for n to handle Integer.MIN_VALUE edge case.",
        "Modulo applied after every multiply prevents overflow.",
      ],
    },
  },
  languageNotes: [
    "Python: pow(a, n, m) is built-in and fast. pow(a, n) works for floats.",
    "Java: Math.pow is double-based; for integers use the manual loop with long.",
    "C++: use long long for modular exponentiation to avoid overflow.",
  ],
  complexity: {
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(log n)",
    auxiliary: "O(1)",
    total: "O(log n) multiplications, O(1) space",
    why: [
      {
        label: "O(log n) multiplications",
        reason:
          "Each iteration halves the exponent. Number of iterations = number of bits in n = log₂(n).",
      },
      {
        label: "O(1) space",
        reason:
          "Only result and base variables — no stack unless using recursion.",
      },
      {
        label: "Matrix version: O(k^3 log n)",
        reason:
          "k×k matrix multiplies cost k^3 each, done log n times. For 2×2 Fibonacci, k=2 → O(log n).",
      },
    ],
  },
  dryRun: {
    input: "a = 2, n = 10",
    initialState: "result = 1, base = 2, n = 10",
    steps: [
      {
        step: "1",
        state: "n=10 (even), base = 4, n = 5",
        note: "Square base, halve n.",
      },
      {
        step: "2",
        state: "n=5 (odd), result = 4, base = 16, n = 2",
        note: "Multiply result by base first.",
      },
      { step: "3", state: "n=2 (even), base = 256, n = 1", note: "" },
      {
        step: "4",
        state: "n=1 (odd), result = 1024, base = 65536, n = 0",
        note: "",
      },
    ],
    output: "1024",
  },
  whenToUse: [
    "Compute a^n with n huge.",
    "Modular exponentiation (a^n mod p).",
    "Matrix exponentiation for linear recurrences.",
    "Anywhere repeated squaring applies (e.g., fast Fibonacci).",
  ],
  whenNotToUse: [
    "n is small (n < 10) — naive loop is fine.",
    "You need floats with high precision — use math.exp or log-space.",
    "Matrix multiplication dominates — for non-linear recurrences, use other techniques.",
  ],
  mistakes: [
    {
      mistake: "Forgetting negative exponent handling.",
      fix: "a^(-n) = 1 / a^n. Invert base before the loop.",
    },
    {
      mistake: "Overflowing in modular exponentiation.",
      fix: "Apply % m after EVERY multiplication. Use long / long long for the intermediate.",
    },
    {
      mistake: "Integer division on n >> 1 when n is negative.",
      fix: "Cast n to long or unsigned before shifting. Negative exponents must be inverted first.",
    },
    {
      mistake: "Using Math.pow for integer output.",
      fix: "Math.pow returns double — precision loss on large integers. Use the manual loop.",
    },
  ],
  interview: {
    questions: [
      "Pow(x, n) (LeetCode 50) — the classic.",
      "Super Pow (LeetCode 372) — modular exponentiation with digit array.",
      "Count Good Numbers (LeetCode 1922) — modular power.",
      "Fibonacci via matrix exponentiation (n up to 10^18).",
      "Fast exponentiation for RSA / Diffie-Hellman problems.",
    ],
    observations: [
      "O(log n) is fundamentally about halving — every bit of n is one iteration.",
      "Modular version is the same code with % applied after each multiply.",
      "Matrix exponentiation solves any linear recurrence in O(k^3 log n).",
    ],
    optimizations: [
      "Use built-in pow(a, n, m) in Python — implemented in C.",
      "For matrix exponentiation, exploit matrix structure (Fibonacci matrix is symmetric).",
      "Exponentiation by squaring for arbitrary associative operations (e.g., function composition).",
    ],
    followUps: [
      "What about huge exponents (n > 2^63)? — Python handles arbitrarily large ints; other languages need big-int libraries.",
      "What about non-integer exponents? — math.pow or log-space.",
    ],
  },
  related: [
    {
      id: "recursion",
      relation: "Recursive version is a single-line divide and conquer",
    },
  ],
  practice: [
    {
      title: "Pow(x, n)",
      difficulty: "Medium",
      why: "The Hello World of fast exponentiation.",
    },
    {
      title: "Super Pow",
      difficulty: "Medium",
      why: "Modular exponentiation with digit array.",
    },
    {
      title: "Count Good Numbers",
      difficulty: "Medium",
      why: "Fast pow modulo a prime.",
    },
    {
      title: "Fibonacci Number",
      difficulty: "Easy",
      why: "Matrix exponentiation version handles huge n.",
    },
  ],
  revision: {
    takeaways: [
      "a^n in O(log n) via repeated squaring.",
      "Iteration = number of bits in n.",
      "Modular variant applies % after every multiply.",
      "Matrix exponentiation solves linear recurrences.",
    ],
    formulas: [
      "Even: a^n = (a^(n/2))^2",
      "Odd:  a^n = a * a^(n-1)",
      "Loop: if n & 1: result *= base; base *= base; n >>= 1",
    ],
    complexitySummary:
      "O(log n) multiplications, O(1) space. Matrix version O(k^3 log n).",
    patterns: ["Modular power", "Matrix power", "Fast Fibonacci"],
    memoryTrick:
      "Square the base, halve the exponent. Bits of n drive multiplies.",
  },
};
