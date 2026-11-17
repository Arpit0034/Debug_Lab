import type { Problem } from '../../types/problem';
import type { Attempt, PracticeMode } from '../../types/progress';
import { statusOf } from '../../utils/status';
import { weakTopics } from '../analytics/analytics';

export interface QueueContext {
  problems: Problem[];
  attempts: Attempt[];
  bookmarks: string[];
  rng?: () => number;
}

export interface QueueOptions {
  topic?: string;
  count?: number;
}

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Modes where the topic stays hidden: random, weak areas, interview and timed. */
export const BLIND_MODES: PracticeMode[] = ['random', 'weak', 'interview', 'timed'];

export function buildQueue(mode: PracticeMode, ctx: QueueContext, opts: QueueOptions = {}): string[] {
  const { problems, attempts, bookmarks } = ctx;
  const rng = ctx.rng ?? Math.random;
  const status = (p: Problem) => statusOf(p.id, attempts);
  const ids = (list: Problem[]) => list.map((p) => p.id);
  const cap = (list: string[]) => (opts.count ? list.slice(0, opts.count) : list);

  switch (mode) {
    case 'topic':
      return ids(problems.filter((p) => p.topic === opts.topic));
    case 'random':
      return cap(ids(shuffle(problems, rng)));
    case 'timed':
      return cap(ids(shuffle(problems, rng)));
    case 'interview':
      return cap(ids(shuffle(problems.filter((p) => p.difficulty !== 'Easy'), rng)));
    case 'unsolved':
      return ids(problems.filter((p) => status(p) === 'attempted'));
    case 'bookmarked':
      return ids(problems.filter((p) => bookmarks.includes(p.id)));
    case 'weak': {
      const topics = weakTopics(attempts, problems);
      const out: string[] = [];
      for (const t of topics) {
        out.push(...ids(shuffle(problems.filter((p) => p.topic === t && status(p) !== 'solved'), rng)));
      }
      return cap(out);
    }
  }
}
