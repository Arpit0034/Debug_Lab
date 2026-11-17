export type ConceptCategoryId =
  | 'foundations'
  | 'data-structures'
  | 'algorithms'
  | 'techniques'
  | 'paradigms'
  | 'advanced';

export type ConceptLevel = 'beginner' | 'intermediate' | 'advanced';
export type ConceptLanguage = 'python' | 'java' | 'cpp';
export type LearningStatus = 'not-started' | 'learning' | 'completed';
export type ContentTier = 'flagship' | 'core' | 'overview';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ConceptMeta {
  id: string;
  title: string;
  tagline: string;
  category: ConceptCategoryId;
  subcategory?: string;
  level: ConceptLevel;
  tier: ContentTier;
  time: string;
  space: string;
  estMinutes: number;
  keywords: string[];
  patterns: string[];
  relatedTopics?: string[];
  chunk: string;
}

export interface CodeSample {
  code: string;
  notes?: string[];
  highlightLines?: number[];
}

export interface ComplexityReason {
  label: string;
  reason: string;
}

export interface DryRunStep {
  step: string;
  state: string;
  note: string;
}

export interface PracticeItem {
  problemId?: string;
  title: string;
  difficulty: Difficulty;
  why: string;
  /** Optional external URL override; otherwise looked up from data/practice-links.ts */
  url?: string;
}

export interface RelatedLink {
  id: string;
  relation: string;
}

export interface ConceptDetail {
  id: string;
  overview: {
    essence: string;
    what: string;
    problemSolved: string;
    whyImportant: string;
    usedIn: string[];
  };
  intuition: { explanation: string; analogy: string };
  internals: { title: string; body: string }[];
  visual: { vizId?: string; diagram?: string; caption: string };
  approach: { summary: string; steps: string[]; template?: CodeSample };
  code: Partial<Record<ConceptLanguage, CodeSample>>;
  languageNotes?: string[];
  complexity: {
    best: string;
    average: string;
    worst: string;
    auxiliary: string;
    total: string;
    why: ComplexityReason[];
  };
  /** Optional — overview-tier concepts may skip the dry run. */
  dryRun?: {
    input: string;
    initialState: string;
    steps: DryRunStep[];
    output: string;
  };
  whenToUse: string[];
  whenNotToUse: string[];
  mistakes: { mistake: string; fix: string }[];
  interview: {
    questions: string[];
    observations: string[];
    optimizations: string[];
    followUps: string[];
  };
  related: RelatedLink[];
  practice: PracticeItem[];
  revision: {
    takeaways: string[];
    formulas: string[];
    complexitySummary: string;
    patterns: string[];
    memoryTrick: string;
  };
}

export interface ConceptsState {
  status: Record<string, LearningStatus>;
  lastOpened?: string;
  language?: ConceptLanguage;
}
