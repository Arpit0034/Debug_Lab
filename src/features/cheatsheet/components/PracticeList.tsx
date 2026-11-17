import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { Difficulty, PracticeItem } from '../types';
import { getPracticeLink } from '../data/practice-links';

const DIFF_COLOR: Record<Difficulty, string> = {
  Easy: 'var(--good)',
  Medium: 'var(--warn)',
  Hard: 'var(--bad)',
};

const SOURCE_COLOR: Record<'LC' | 'GFG' | 'HR', string> = {
  LC: 'var(--warn)',
  GFG: 'var(--good)',
  HR: 'var(--accent)',
};

export interface ResolvedProblem {
  title: string;
  difficulty: Difficulty;
}

export interface PracticeListProps {
  items: PracticeItem[];
  resolveProblem?: (id: string) => ResolvedProblem | null;
}

export function PracticeList({ items, resolveProblem }: PracticeListProps): React.ReactElement {
  if (items.length === 0) {
    return <p className="cx-small cx-muted">No practice problems listed for this concept.</p>;
  }

  return (
    <ul className="cx-stack" style={{ gap: '0.5rem', padding: 0, listStyle: 'none', margin: 0 }}>
      {items.map((item, i) => {
        const resolved =
          item.problemId && resolveProblem ? resolveProblem(item.problemId) : null;
        const title = resolved?.title ?? item.title;
        const difficulty = resolved?.difficulty ?? item.difficulty;

        // Link priority: explicit url → practice-links lookup → internal registry
        const explicitUrl = item.url;
        const lookup = explicitUrl ? undefined : getPracticeLink(item.title);
        const external = explicitUrl
          ? { url: explicitUrl, source: externalSource(explicitUrl) }
          : lookup;
        const internalLink = item.problemId && resolved;

        return (
          <li
            key={i}
            className="cx-card"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span
              className="cx-chip"
              style={{
                color: DIFF_COLOR[difficulty],
                borderColor: `color-mix(in srgb, ${DIFF_COLOR[difficulty]} 40%, var(--cx-border))`,
                background: `color-mix(in srgb, ${DIFF_COLOR[difficulty]} 12%, var(--cx-bg-muted))`,
                textTransform: 'none',
                letterSpacing: 0,
                fontWeight: 700,
              }}
            >
              {difficulty}
            </span>

            <div style={{ flex: 1, minWidth: '12rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {external ? (
                  <a
                    href={external.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--cx-accent)',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {title}
                    <ExternalLink size={12} aria-hidden="true" />
                    <span
                      className="cx-chip"
                      style={{
                        textTransform: 'none',
                        letterSpacing: 0,
                        fontSize: '0.625rem',
                        padding: '0.05rem 0.4rem',
                        color: SOURCE_COLOR[external.source],
                        borderColor: `color-mix(in srgb, ${SOURCE_COLOR[external.source]} 45%, var(--cx-border))`,
                        background: `color-mix(in srgb, ${SOURCE_COLOR[external.source]} 12%, var(--cx-bg-muted))`,
                      }}
                    >
                      {external.source}
                    </span>
                  </a>
                ) : internalLink ? (
                  <Link
                    to={`/problem/${item.problemId}`}
                    style={{ color: 'var(--cx-accent)', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {title}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 600 }}>{title}</span>
                )}
              </div>
              <div className="cx-small cx-muted" style={{ marginTop: '0.15rem', lineHeight: 1.45 }}>
                {item.why}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function externalSource(url: string): 'LC' | 'GFG' | 'HR' {
  if (url.includes('leetcode.com')) return 'LC';
  if (url.includes('geeksforgeeks.org')) return 'GFG';
  if (url.includes('hackerrank.com')) return 'HR';
  return 'LC';
}
