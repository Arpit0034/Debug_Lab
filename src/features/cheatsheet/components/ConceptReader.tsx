import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy } from 'lucide-react';
import type {
  ConceptDetail,
  ConceptMeta,
  LearningStatus,
} from '../types';
import type { Frame } from '../viz/types';
import { getViz } from '../viz/vizRegistry';
import { Section } from './Section';
import { Callout } from './Callout';
import { DryRunTable } from './DryRunTable';
import { CodePanel } from './CodePanel';
import { SectionToc, type TocSection } from './SectionToc';
import { StatusControl } from './StatusControl';
import { PracticeList, type ResolvedProblem } from './PracticeList';
import { StepPlayer } from '../viz/StepPlayer';
import { PracticeBarButton, PracticeConceptCta } from './PracticeCta';
import { AiExplain } from '../../../components/common/AiExplain';

const AI_PRESETS = [
  { label: 'Explain it simply', prompt: 'I did not understand this page. Explain this concept in simple words, as if I am new to it.' },
  { label: 'Real-life analogy', prompt: 'Give me one everyday real-life analogy for this concept and map each part of the analogy to the concept.' },
  { label: 'Tiny example', prompt: 'Walk me through a tiny example step by step, showing what changes at each step.' },
  { label: 'When do I use it?', prompt: 'How do I recognise a problem where this concept is the right tool? Give me the clues to look for.' },
];

/** The page content the AI re-explains. Kept short so the free model answers quickly. */
function buildAiContext(meta: ConceptMeta, detail: ConceptDetail): string {
  const parts: string[] = [
    'Concept: ' + meta.title + ' (' + meta.category + ', ' + meta.level + ')',
    'Tagline: ' + meta.tagline,
    'Essence: ' + detail.overview.essence,
    'What it is: ' + detail.overview.what,
    'Problem it solves: ' + detail.overview.problemSolved,
    'Why it matters: ' + detail.overview.whyImportant,
  ];
  if (detail.intuition.explanation) parts.push('Intuition: ' + detail.intuition.explanation);
  if (detail.intuition.analogy) parts.push('Analogy: ' + detail.intuition.analogy);
  if (detail.internals.length) {
    parts.push('How it works:\n' + detail.internals.map((s, i) => String(i + 1) + '. ' + s.title + ': ' + s.body).join('\n'));
  }
  if (detail.approach.summary) parts.push('Approach: ' + detail.approach.summary);
  if (detail.approach.steps.length) parts.push('Steps:\n- ' + detail.approach.steps.join('\n- '));
  if (detail.whenToUse.length) parts.push('When to use:\n- ' + detail.whenToUse.slice(0, 6).join('\n- '));
  const py = detail.code.python?.code;
  if (py) parts.push('Python code:\n' + py.slice(0, 1500));
  return parts.join('\n\n').slice(0, 9000);
}

const CATEGORY_LABEL: Record<ConceptMeta['category'], string> = {
  foundations: 'Foundations',
  'data-structures': 'Data Structures',
  algorithms: 'Algorithms',
  techniques: 'Techniques',
  paradigms: 'Paradigms',
  advanced: 'Advanced',
};

const LEVEL_LABEL: Record<ConceptMeta['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export interface ConceptReaderProps {
  meta: ConceptMeta;
  detail: ConceptDetail;
  status: LearningStatus;
  onStatusChange: (next: LearningStatus) => void;
  onBack: () => void;
  onNavigate: (id: string) => void;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  resolveProblem?: (id: string) => ResolvedProblem | null;
}

export function ConceptReader({
  meta,
  detail,
  status,
  onStatusChange,
  onBack,
  onNavigate,
  prev,
  next,
  resolveProblem,
}: ConceptReaderProps): React.ReactElement {
  const contentRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    const main = contentRef.current?.closest('main');
    if (main) main.scrollTop = 0;
    else if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [detail.id]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const sections = useMemo<TocSection[]>(() => {
    const list: TocSection[] = [{ id: 'overview', label: 'Overview' }];
    if (detail.intuition.analogy || detail.intuition.explanation)
      list.push({ id: 'intuition', label: 'Core Intuition' });
    if (detail.internals.length) list.push({ id: 'internals', label: 'Internal Working' });
    if (detail.visual.vizId || detail.visual.diagram || detail.visual.caption)
      list.push({ id: 'visual', label: 'Visual' });
    if (detail.approach.summary || detail.approach.steps.length)
      list.push({ id: 'approach', label: 'Approach' });
    if (Object.keys(detail.code).length) list.push({ id: 'code', label: 'Code' });
    list.push({ id: 'complexity', label: 'Complexity' });
    if (detail.dryRun?.steps.length) list.push({ id: 'dry-run', label: 'Dry Run' });
    if (detail.whenToUse.length || detail.whenNotToUse.length)
      list.push({ id: 'when', label: 'When to Use' });
    if (detail.mistakes.length) list.push({ id: 'mistakes', label: 'Common Mistakes' });
    const iv = detail.interview;
    if (iv.questions.length + iv.observations.length + iv.optimizations.length + iv.followUps.length)
      list.push({ id: 'interview', label: 'Interview' });
    if (detail.related.length) list.push({ id: 'related', label: 'Related' });
    if (detail.practice.length) list.push({ id: 'practice', label: 'Practice' });
    list.push({ id: 'revision', label: 'Quick Revision' });
    return list;
  }, [detail]);

  const vizFrames = useMemo<Frame[]>(() => {
    if (!detail.visual.vizId) return [];
    const def = getViz(detail.visual.vizId);
    if (!def) return [];
    try {
      const gen = def.generator as (i: unknown) => Frame[];
      return gen(def.defaultInput);
    } catch { return []; }
  }, [detail.visual.vizId]);

  const handleCopyLink = useCallback(async () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?c=${encodeURIComponent(detail.id)}`
      : '';
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }, [detail.id]);

  const hasCode = Object.keys(detail.code).length > 0;
  const hasInterview =
    detail.interview.questions.length +
    detail.interview.observations.length +
    detail.interview.optimizations.length +
    detail.interview.followUps.length > 0;

  return (
    <article ref={contentRef as React.RefObject<HTMLElement>} className="cx-reader-article">

      {/* ---- Sticky app bar ---- */}
      <div className="cx-app-bar">
        <button type="button" className="cx-app-bar__back" onClick={onBack}>
          <ArrowLeft size={14} />
          <span>Library</span>
        </button>
        <div className="cx-app-bar__crumbs">
          <span className="cx-app-bar__crumb">{CATEGORY_LABEL[meta.category]}</span>
          <span className="cx-app-bar__sep">›</span>
          <span className="cx-app-bar__crumb cx-app-bar__crumb--current">{meta.title}</span>
        </div>
        <div className="cx-app-bar__actions">
          <PracticeBarButton conceptId={meta.id} />
          <StatusControl
            status={status}
            onChange={onStatusChange}
            compact
            ariaLabel={`Learning status for ${meta.title}`}
          />
        </div>
      </div>

      <div className="cx-container">

        {/* ---- Hero ---- */}
        <header className="cx-reader-hero">
          <div className={`cx-row cx-cat-${meta.category}`} style={{ marginBottom: '0.75rem' }}>
            <span className="cx-chip cx-chip--cat">{CATEGORY_LABEL[meta.category]}</span>
            <span className="cx-chip">{LEVEL_LABEL[meta.level]}</span>
          </div>
          <h1 className="cx-h1">{meta.title}</h1>
          <p className="cx-lead" style={{ marginTop: '0.35rem' }}>{meta.tagline}</p>
          <div className="cx-row" style={{ gap: '0.4rem', marginTop: '1rem' }}>
            <span className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>⏱ {meta.time}</span>
            <span className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>💾 {meta.space}</span>
            <span className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>~{meta.estMinutes} min</span>
            <button
              type="button"
              className="cx-btn cx-btn--sm cx-btn--ghost"
              onClick={handleCopyLink}
              aria-live="polite"
              style={{ marginLeft: 'auto' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
        </header>

        {/* ---- Mobile TOC chips ---- */}
        <nav className="cx-reader-toc-mobile cx-no-print" aria-label="Sections">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(s.id);
                if (el) {
                  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                  catch { el.scrollIntoView(); }
                }
                if (typeof history !== 'undefined' && history.replaceState) {
                  history.replaceState(null, '', '#' + s.id);
                }
              }}
              className="cx-btn cx-btn--sm cx-btn--ghost"
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* ---- Main layout ---- */}
        <div className="cx-reader-layout">
          <aside className="cx-reader-toc-rail">
            <SectionToc sections={sections} />
          </aside>

          <div style={{ minWidth: 0 }}>

            {/* 1. Overview */}
            <Section id="overview" title="Overview">
              <div className="cx-callout" style={{ fontSize: '1.0625rem', fontWeight: 500, marginBottom: '1.5rem', lineHeight: 1.55 }}>
                <em>{detail.overview.essence}</em>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))', gap: '1.25rem' }}>
                <div><h4 className="cx-h4">What it is</h4><p style={{ margin: 0 }}>{detail.overview.what}</p></div>
                <div><h4 className="cx-h4">Problem it solves</h4><p style={{ margin: 0 }}>{detail.overview.problemSolved}</p></div>
                <div><h4 className="cx-h4">Why it matters</h4><p style={{ margin: 0 }}>{detail.overview.whyImportant}</p></div>
                {detail.overview.usedIn.length > 0 && (
                  <div>
                    <h4 className="cx-h4">Where it's used</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {detail.overview.usedIn.map((u, i) => <li key={i} className="cx-small">{u}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </Section>

            <AiExplain
              title="Not clear? Get it explained differently"
              hint="Ask AI to re-explain this concept in simpler words, an analogy or a worked example."
              getContext={() => buildAiContext(meta, detail)}
              presets={AI_PRESETS}
              placeholder={'Ask anything about ' + meta.title + '...'}
            />

            {/* 2. Intuition */}
            {(detail.intuition.analogy || detail.intuition.explanation) && (
              <Section id="intuition" title="Core Intuition">
                {detail.intuition.explanation && <p style={{ marginTop: 0 }}>{detail.intuition.explanation}</p>}
                {detail.intuition.analogy && (
                  <Callout type="good" title="Analogy">{detail.intuition.analogy}</Callout>
                )}
              </Section>
            )}

            {/* 3. Internals */}
            {detail.internals.length > 0 && (
              <Section id="internals" title="Internal Working">
                <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
                  {detail.internals.map((step, i) => (
                    <li key={i} style={{ marginBottom: '0.75rem' }}>
                      <strong>{step.title}.</strong> {step.body}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {/* 4. Visual */}
            {(detail.visual.vizId || detail.visual.diagram || detail.visual.caption) && (
              <Section id="visual" title="Visual Representation">
                {vizFrames.length > 0 ? (
                  <StepPlayer frames={vizFrames} title={meta.title + ' — visualization'} />
                ) : detail.visual.diagram ? (
                  <div className="cx-code-block">
                    <pre className="cx-code" style={{ whiteSpace: 'pre' }}>{detail.visual.diagram}</pre>
                  </div>
                ) : null}
                {detail.visual.caption && (
                  <p className="cx-small cx-muted" style={{ marginTop: '0.75rem' }}>{detail.visual.caption}</p>
                )}
              </Section>
            )}

            {/* 5. Approach */}
            {(detail.approach.summary || detail.approach.steps.length > 0) && (
              <Section id="approach" title="Algorithm / Approach">
                {detail.approach.summary && <p style={{ marginTop: 0 }}>{detail.approach.summary}</p>}
                {detail.approach.steps.length > 0 && (
                  <ol style={{ paddingLeft: '1.5rem' }}>
                    {detail.approach.steps.map((s, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{s}</li>)}
                  </ol>
                )}
                {detail.approach.template && (
                  <div style={{ marginTop: '1rem' }}>
                    <CodePanel samples={{ python: detail.approach.template }} ariaLabel="Template" />
                  </div>
                )}
              </Section>
            )}

            {/* 6. Code */}
            {hasCode && (
              <Section id="code" title="Code Implementations">
                <CodePanel samples={detail.code} ariaLabel={`${meta.title} — code`} />
                {detail.languageNotes && detail.languageNotes.length > 0 && (
                  <Callout type="info" title="Language notes">
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {detail.languageNotes.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </Callout>
                )}
              </Section>
            )}

            {/* 7. Complexity */}
            <Section id="complexity" title="Complexity Analysis">
              <div style={{ overflowX: 'auto' }}>
                <table className="cx-table">
                  <tbody>
                    <tr><th style={{ width: '8rem' }}>Best</th><td className="cx-mono">{detail.complexity.best}</td></tr>
                    <tr><th>Average</th><td className="cx-mono">{detail.complexity.average}</td></tr>
                    <tr><th>Worst</th><td className="cx-mono">{detail.complexity.worst}</td></tr>
                    <tr><th>Auxiliary</th><td className="cx-mono">{detail.complexity.auxiliary}</td></tr>
                    <tr><th>Total</th><td className="cx-mono">{detail.complexity.total}</td></tr>
                  </tbody>
                </table>
              </div>
              {detail.complexity.why.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 className="cx-h4">Why</h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    {detail.complexity.why.map((r, i) => (
                      <li key={i} style={{ marginBottom: '0.4rem' }}><strong>{r.label}:</strong> {r.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            {/* 8. Dry run */}
            {detail.dryRun && detail.dryRun.steps.length > 0 && (
              <Section id="dry-run" title="Dry Run">
                <div className="cx-grid-2" style={{ marginBottom: '1rem' }}>
                  <div><h4 className="cx-h4">Input</h4><p className="cx-mono cx-small" style={{ margin: 0 }}>{detail.dryRun.input}</p></div>
                  <div><h4 className="cx-h4">Initial state</h4><p className="cx-mono cx-small" style={{ margin: 0 }}>{detail.dryRun.initialState}</p></div>
                </div>
                <DryRunTable steps={detail.dryRun.steps} />
                <Callout type="good" title="Output">
                  <span className="cx-mono">{detail.dryRun.output}</span>
                </Callout>
              </Section>
            )}

            {/* 9 & 10. When / When not */}
            {(detail.whenToUse.length || detail.whenNotToUse.length) > 0 && (
              <Section id="when" title="When to Use / When NOT to Use">
                <div className="cx-grid-2">
                  <div>
                    <h4 className="cx-h4" style={{ color: 'var(--good)' }}>✓ When to use</h4>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {detail.whenToUse.map((w, i) => <li key={i} style={{ marginBottom: '0.35rem' }}>{w}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="cx-h4" style={{ color: 'var(--bad)' }}>✗ When NOT to use</h4>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {detail.whenNotToUse.map((w, i) => <li key={i} style={{ marginBottom: '0.35rem' }}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              </Section>
            )}

            {/* 11. Mistakes */}
            {detail.mistakes.length > 0 && (
              <Section id="mistakes" title="Common Mistakes & Edge Cases">
                <div className="cx-stack" style={{ gap: '0.75rem' }}>
                  {detail.mistakes.map((m, i) => (
                    <div key={i} className="cx-callout cx-callout--warn">
                      <div style={{ marginBottom: '0.25rem' }}><strong>⚠ {m.mistake}</strong></div>
                      <div className="cx-small"><strong>Fix:</strong> {m.fix}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 12. Interview */}
            {hasInterview && (
              <Section id="interview" title="Interview Insights">
                {detail.interview.questions.length > 0 && (
                  <details open style={{ marginBottom: '0.75rem' }}>
                    <summary className="cx-h4" style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                      Frequently asked questions ({detail.interview.questions.length})
                    </summary>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {detail.interview.questions.map((q, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{q}</li>)}
                    </ul>
                  </details>
                )}
                {detail.interview.observations.length > 0 && (
                  <details style={{ marginBottom: '0.75rem' }}>
                    <summary className="cx-h4" style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Key observations</summary>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {detail.interview.observations.map((o, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{o}</li>)}
                    </ul>
                  </details>
                )}
                {detail.interview.optimizations.length > 0 && (
                  <details style={{ marginBottom: '0.75rem' }}>
                    <summary className="cx-h4" style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Optimizations</summary>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {detail.interview.optimizations.map((o, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{o}</li>)}
                    </ul>
                  </details>
                )}
                {detail.interview.followUps.length > 0 && (
                  <details>
                    <summary className="cx-h4" style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Follow-up variations</summary>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {detail.interview.followUps.map((f, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{f}</li>)}
                    </ul>
                  </details>
                )}
              </Section>
            )}

            {/* 13. Related */}
            {detail.related.length > 0 && (
              <Section id="related" title="Related Concepts">
                <div className="cx-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                  {detail.related.map((r) => (
                    <button key={r.id} type="button" onClick={() => onNavigate(r.id)} className="cx-btn cx-btn--sm" title={r.relation}>
                      {r.id} <span className="cx-muted">— {r.relation}</span>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {/* 14. Practice */}
            {detail.practice.length > 0 && (
              <Section id="practice" title="Practice Problems">
                <PracticeList items={detail.practice} resolveProblem={resolveProblem} />
              </Section>
            )}

            {/* 15. Revision */}
            <Section id="revision" title="Quick Revision">
              <div className="cx-card" style={{ background: 'var(--cx-bg-muted)' }}>
                {detail.revision.memoryTrick && (
                  <div className="cx-callout cx-callout--good" style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.0625rem', fontWeight: 500 }}>
                    <strong>Memory trick:</strong> {detail.revision.memoryTrick}
                  </div>
                )}
                {detail.revision.takeaways.length > 0 && (
                  <>
                    <h4 className="cx-h4">Takeaways</h4>
                    <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1rem' }}>
                      {detail.revision.takeaways.map((t, i) => <li key={i} style={{ marginBottom: '0.35rem' }}>{t}</li>)}
                    </ul>
                  </>
                )}
                {detail.revision.formulas.length > 0 && (
                  <>
                    <h4 className="cx-h4">Formulas</h4>
                    <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1rem' }}>
                      {detail.revision.formulas.map((f, i) => (
                        <li key={i} className="cx-mono" style={{ marginBottom: '0.35rem', fontSize: '0.875rem' }}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}
                {detail.revision.complexitySummary && (
                  <>
                    <h4 className="cx-h4">Complexity summary</h4>
                    <p className="cx-mono cx-small" style={{ margin: '0 0 1rem' }}>{detail.revision.complexitySummary}</p>
                  </>
                )}
                {detail.revision.patterns.length > 0 && (
                  <>
                    <h4 className="cx-h4">Patterns</h4>
                    <div className="cx-row" style={{ gap: '0.35rem', flexWrap: 'wrap' }}>
                      {detail.revision.patterns.map((p, i) => (
                        <span key={i} className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>{p}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Section>

            {/* Practice this concept */}
            <PracticeConceptCta meta={meta} />

            {/* Prev / Next */}
            <nav
              className="cx-no-print"
              aria-label="Concept navigation"
              style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--cx-border)' }}
            >
              {prev ? (
                <button type="button" className="cx-btn" onClick={() => onNavigate(prev.id)} style={{ maxWidth: '45%' }}>
                  <ArrowLeft size={14} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prev.title}</span>
                </button>
              ) : <span />}
              {next ? (
                <button type="button" className="cx-btn" onClick={() => onNavigate(next.id)} style={{ maxWidth: '45%', marginLeft: 'auto' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{next.title}</span>
                  <ArrowRight size={14} />
                </button>
              ) : <span />}
            </nav>
          </div>
        </div>
      </div>
    </article>
  );
}
