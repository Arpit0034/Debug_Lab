import { readJSON, writeJSON } from '../../services/storage/storageService';
import type {
  ConceptsState,
  ConceptLanguage,
  LearningStatus,
} from './types';

const KEY = 'concepts' as const;
const STATUSES: LearningStatus[] = ['not-started', 'learning', 'completed'];
const LANGS: ConceptLanguage[] = ['python', 'java', 'cpp'];

const EMPTY: ConceptsState = { status: {} };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function validate(raw: unknown): ConceptsState | null {
  if (!isRecord(raw)) return null;
  const statusRaw = raw.status;
  if (!isRecord(statusRaw)) return null;
  const clean: Record<string, LearningStatus> = {};
  for (const [k, v] of Object.entries(statusRaw)) {
    if (typeof v === 'string' && (STATUSES as string[]).includes(v)) {
      clean[k] = v as LearningStatus;
    }
  }
  const out: ConceptsState = { status: clean };
  if (typeof raw.lastOpened === 'string') out.lastOpened = raw.lastOpened;
  if (typeof raw.language === 'string' && (LANGS as string[]).includes(raw.language)) {
    out.language = raw.language as ConceptLanguage;
  }
  return out;
}

export function loadConceptsState(): ConceptsState {
  try {
    const raw = readJSON<unknown>(KEY, EMPTY, (v): v is unknown => v !== undefined);
    return validate(raw) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveConceptsState(state: ConceptsState): void {
  writeJSON(KEY, state);
}

export function setConceptStatus(
  id: string,
  status: LearningStatus,
): ConceptsState {
  const cur = loadConceptsState();
  const next: ConceptsState = {
    ...cur,
    status: { ...cur.status, [id]: status },
  };
  saveConceptsState(next);
  return next;
}

export function setLastOpened(id: string): ConceptsState {
  const cur = loadConceptsState();
  const next: ConceptsState = { ...cur, lastOpened: id };
  saveConceptsState(next);
  return next;
}

export function setLanguage(lang: ConceptLanguage): ConceptsState {
  const cur = loadConceptsState();
  const next: ConceptsState = { ...cur, language: lang };
  saveConceptsState(next);
  return next;
}

export function cycleStatus(s: LearningStatus): LearningStatus {
  if (s === 'not-started') return 'learning';
  if (s === 'learning') return 'completed';
  return 'not-started';
}
