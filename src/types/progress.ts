import type { Language } from './problem';

export type BugResult = 'correct' | 'partial' | 'incorrect';
export type FixStatus = 'verified' | 'self-verified' | 'unverified';

export interface FixAttempt {
  line: number;
  submitted: string;
  status: FixStatus;
}

export interface ComplexityAttempt {
  time: string;
  space: string;
  timeCorrect: boolean;
  spaceCorrect: boolean;
}

export interface Attempt {
  id: string;
  problemId: string;
  language: Language;
  timestamp: number;
  selectedLines: number[];
  bugResult: BugResult;
  fixes: FixAttempt[];
  complexity?: ComplexityAttempt;
  timeSpentSec: number;
  withinTime: boolean;
  /** True if this was the first ever submission for this problem. */
  firstAttempt: boolean;
}

export interface TimerRecord {
  elapsedSec: number;
  running: boolean;
  startedAt: number | null;
}

/** Work in progress for one problem, kept per language so switching never loses it. */
export interface Draft {
  selectedLines: Partial<Record<Language, number[]>>;
  fixInputs: Partial<Record<Language, Record<string, string>>>;
  timer: TimerRecord;
  updatedAt: number;
}

export interface ProgressData {
  attempts: Attempt[];
  drafts: Record<string, Draft>;
  lastVisited: { problemId: string; language: Language } | null;
}

export type PracticeMode = 'topic' | 'random' | 'weak' | 'interview' | 'unsolved' | 'bookmarked' | 'timed';

export interface PracticeSession {
  mode: PracticeMode;
  label: string;
  queue: string[];
  index: number;
  startedAt: number;
  /** Fixed total time in seconds. Only the timed challenge has one. */
  totalSec?: number;
}

export type ThemeMode = 'dark' | 'light';

export interface Settings {
  theme: ThemeMode;
  language: Language;
  fontSize: number;
  showHints: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  language: 'python',
  fontSize: 14,
  showHints: true,
};

export const EMPTY_PROGRESS: ProgressData = {
  attempts: [],
  drafts: {},
  lastVisited: null,
};
