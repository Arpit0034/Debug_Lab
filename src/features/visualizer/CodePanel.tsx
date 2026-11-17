// Scrollable code view with current line highlighted and buggy lines marked.
import { useEffect, useRef } from 'react';
import { MONO, VIS } from './theme';

interface Props {
  code: string;
  currentLine: number;
  buggyLines: number[];
  mode: 'correct' | 'buggy';
  /** Overrides the header label (used by the guide page). */
  title?: string;
}

export function CodePanel({ code, currentLine, buggyLines, mode, title }: Props): React.ReactElement {
  const lines = code.split('\n');
  const currentRef = useRef<HTMLDivElement | null>(null);
  const buggySet = new Set(buggyLines);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentLine]);

  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="text-xs font-medium" style={{ color: VIS.muted }}>
          {title ?? (mode === 'correct' ? 'Correct code' : 'Buggy code')}
        </span>
        <span className="text-xs" style={{ color: VIS.accent, fontFamily: MONO }}>
          line {currentLine}
        </span>
      </div>
      <div className="overflow-auto" style={{ maxHeight: 300, fontFamily: MONO, fontSize: 12, lineHeight: 1.5 }}>
        {lines.map((line, i) => {
          const n = i + 1;
          const isCurrent = n === currentLine;
          const isBuggy = mode === 'buggy' && buggySet.has(n);
          return (
            <div
              key={n}
              ref={isCurrent ? currentRef : null}
              className="flex"
              style={{
                background: isCurrent ? 'var(--surface-2)' : 'transparent',
                borderLeft: '3px solid ' + (isCurrent ? 'var(--accent)' : isBuggy ? 'var(--bad)' : 'transparent'),
              }}
            >
              <span
                className="select-none py-0.5 pr-2 text-right"
                style={{ width: 36, flexShrink: 0, color: isCurrent ? VIS.accent : VIS.muted }}
              >
                {n}
              </span>
              <span
                className="whitespace-pre py-0.5 pr-2"
                style={{ color: isCurrent ? VIS.fg : VIS.muted }}
              >
                {isCurrent ? '▶ ' : '  '}
                {line || ' '}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
