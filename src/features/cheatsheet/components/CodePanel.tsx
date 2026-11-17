import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CodeSample, ConceptLanguage } from '../types';
import { tokenize, type Token } from '../highlight';
import { loadConceptsState, setLanguage as persistLanguage } from '../conceptStorage';

const LANG_LABEL: Record<ConceptLanguage, string> = {
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
};

export interface CodePanelProps {
  samples: Partial<Record<ConceptLanguage, CodeSample>>;
  ariaLabel?: string;
}

function splitByLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const tok of tokens) {
    const parts = tok.value.split('\n');
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) lines.push([]);
      if (parts[i].length > 0) {
        lines[lines.length - 1].push({ kind: tok.kind, value: parts[i] });
      }
    }
  }
  return lines;
}

function pickInitialLanguage(
  samples: Partial<Record<ConceptLanguage, CodeSample>>,
): ConceptLanguage | null {
  const available = (Object.keys(samples) as ConceptLanguage[]).filter(
    (k) => samples[k] !== undefined,
  );
  if (available.length === 0) return null;
  const state = loadConceptsState();
  if (state.language && available.includes(state.language)) return state.language;
  if (available.includes('python')) return 'python';
  return available[0];
}

export function CodePanel({ samples, ariaLabel = 'Code samples' }: CodePanelProps): React.ReactElement {
  const [lang, setLang] = useState<ConceptLanguage | null>(() => pickInitialLanguage(samples));
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    if (lang && samples[lang] === undefined) {
      setLang(pickInitialLanguage(samples));
    }
  }, [samples, lang]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const sample = lang ? samples[lang] : undefined;

  const handleLang = useCallback((next: ConceptLanguage) => {
    setLang(next);
    try {
      persistLanguage(next);
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!sample) return;
    const text = sample.code;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* copy failed silently */
    }
  }, [sample]);

  const lines = useMemo(() => {
    if (!sample || !lang) return [];
    return splitByLines(tokenize(sample.code, lang));
  }, [sample, lang]);

  if (!sample || !lang) {
    return (
      <div className="cx-empty">No code samples available.</div>
    );
  }

  const highlight = new Set(sample.highlightLines ?? []);

  return (
    <div className="cx-card" aria-label={ariaLabel}>
      <div
        className="cx-row"
        style={{ justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}
      >
        <div className="cx-row" style={{ gap: '0.25rem' }} role="tablist" aria-label="Language">
          {(Object.keys(LANG_LABEL) as ConceptLanguage[]).map((k) => {
            const disabled = samples[k] === undefined;
            return (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={lang === k}
                disabled={disabled}
                onClick={() => handleLang(k)}
                className={
                  'cx-btn cx-btn--sm ' + (lang === k ? 'cx-btn--primary' : 'cx-btn--ghost')
                }
                style={{ opacity: disabled ? 0.4 : 1 }}
              >
                {LANG_LABEL[k]}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="cx-btn cx-btn--sm cx-btn--ghost"
          onClick={handleCopy}
          aria-live="polite"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      <div className="cx-code-block">
        <pre className="cx-code">
          <code>
            {lines.map((line, i) => {
              const lineNo = i + 1;
              const isHl = highlight.has(lineNo);
              return (
                <div
                  key={i}
                  style={
                    isHl
                      ? { background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }
                      : undefined
                  }
                >
                  <span
                    className="cx-muted"
                    style={{
                      display: 'inline-block',
                      width: '2.5rem',
                      textAlign: 'right',
                      paddingRight: '0.75rem',
                      userSelect: 'none',
                      opacity: 0.6,
                    }}
                    aria-hidden="true"
                  >
                    {lineNo}
                  </span>
                  {line.map((tok, j) => (
                    <span key={j} className={`tok-${tok.kind}`}>
                      {tok.value}
                    </span>
                  ))}
                  {'\n'}
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {sample.notes && sample.notes.length > 0 && (
        <ul className="cx-small cx-muted" style={{ marginTop: '0.75rem', paddingLeft: '1.25rem' }}>
          {sample.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
