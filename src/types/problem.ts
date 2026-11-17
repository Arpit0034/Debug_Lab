export type Language = 'java' | 'python' | 'c';

export const LANGUAGES: readonly Language[] = ['java', 'python', 'c'];

export const LANGUAGE_LABELS: Record<Language, string> = {
  java: 'Java',
  python: 'Python',
  c: 'C',
};

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const DIFFICULTIES: readonly Difficulty[] = ['Easy', 'Medium', 'Hard'];

/** Default timer length in minutes per difficulty. */
export const TIMER_MINUTES: Record<Difficulty, number> = {
  Easy: 5,
  Medium: 10,
  Hard: 15,
};

export const TOPICS = [
  'Arrays',
  'Strings',
  'Recursion',
  'Basic Mathematics',
  'Bit Manipulation',
  'Complexity Analysis',
  'Searching',
  'Sorting',
  'Linked Lists',
  'Stacks and Queues',
  'Trees',
  'Heaps and Tries',
  'Graphs',
  'Hashing',
  'Advanced Data Structures',
  'Greedy',
  'Backtracking',
  'Sliding Window and Two Pointers',
  'Prefix Sum and Kadane',
  'Divide and Conquer',
  'Dynamic Programming',
  'Java Concepts',
  'Python Concepts',
  'C Concepts',
] as const;

export type Topic = (typeof TOPICS)[number];

export type PerLanguage<T> = Partial<Record<Language, T>>;

export interface Example {
  input: string;
  output: string;
  note?: string;
}

export interface TestCase {
  input: string;
  expected: string;
  buggyOutput?: string;
}

export interface Explanation {
  overview: string;
  algorithm: string;
  bug: string;
  whyItFails: string;
  failingTestCase: string;
  fix: string;
  whyFixWorks: string;
  dryRun: string;
  debuggingLesson: string;
}

export interface Complexity {
  time: string;
  space: string;
}

/** Lets scripts/runBank.ts run the buggy and correct code. Output must match across languages. */
export interface Harness {
  /** Exact stdout (trimmed) of the correct code. */
  expected: string;
  /** Statements that print the result: appended after the code (Python), inside main (Java, C). */
  driver: PerLanguage<string>;
}

export interface Problem {
  /** Internal id. Never shown before submission because the prefix can leak the topic. */
  id: string;
  /** Revealed only after the first submission. */
  title: string;
  difficulty: Difficulty;
  topic: Topic;
  subtopic: string;
  tags: string[];
  bugCategory: string;
  sourceInspiredBy: string;
  description: string;
  constraints: string[];
  examples: Example[];
  hints: string[];
  languages: Language[];
  buggyCode: PerLanguage<string>;
  correctCode: PerLanguage<string>;
  /** 1-based line numbers of the buggy lines, per language. */
  buggyLines: PerLanguage<number[]>;
  /** Accepted replacement lines, keyed by line number (as string), per language. */
  acceptedFixes: PerLanguage<Record<string, string[]>>;
  explanation: Explanation;
  complexity: Complexity;
  /** Use when a language version has different complexity (e.g. adjacency matrix in C). */
  complexityOverrides?: PerLanguage<Complexity>;
  testCases: TestCase[];
  harness?: Harness;
}
