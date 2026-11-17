export type Verdict = 'fluent' | 'hesitant' | 'froze';

export interface MCQuestion {
  question: string;
  options: [string, string, string, string];
  correct_index: 0 | 1 | 2 | 3;
  why: string;
}

export interface FluencyReport {
  verdict: Verdict;
  hesitation_markers: number;
  ended_abruptly: boolean;
}

export interface ExplanationGrade {
  transcript: string;
  score: 0 | 1 | 2 | 3 | 4 | 5;
  strengths: string[];
  missing: string[];
  errors: string[];
  improvements?: string[];
  better_answer?: string;
  one_line_feedback: string;
  fluency: FluencyReport;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AnswerIndex = 0 | 1 | 2 | 3;

/** One recognition question the user actually answered. */
export interface QuestionAttempt {
  mc: MCQuestion;
  answer: AnswerIndex | null;
  correct: boolean;
}

export interface RoundResult {
  conceptId: string;
  conceptTitle: string;
  /** Legacy single-question fields. Kept so sessions saved before question sets still load. */
  mc: MCQuestion;
  mcAnswer: 0 | 1 | 2 | 3 | null;
  /** True when every question answered in the round was correct. */
  mcCorrect: boolean;
  /** Every question answered this round (new sessions). Absent on older saved sessions. */
  questions?: QuestionAttempt[];
  difficulty?: Difficulty;
  explanation: ExplanationGrade | null;
  timestamp: string;
}

export type Phase =
  | 'api-key-setup'
  | 'setup'
  | 'loading-mc'
  | 'answering-mc'
  | 'feedback-mc'
  | 'recording'
  | 'grading'
  | 'result'
  | 'report'
  | 'error';

export interface ErrorCard {
  message: string;
  hint?: string;
  retryable: boolean;
  statusCode?: number;
  kind?: string;
  onRetry?: () => void;
}

/** The questions of a round, whether it was saved before or after question sets existed. */
export function roundQuestions(r: RoundResult): QuestionAttempt[] {
  if (Array.isArray(r.questions) && r.questions.length > 0) return r.questions;
  return [{ mc: r.mc, answer: r.mcAnswer, correct: r.mcCorrect }];
}
