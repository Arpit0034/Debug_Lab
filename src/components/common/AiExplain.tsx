import { useCallback, useState } from 'react';
import { ExternalLink, KeyRound, Sparkles } from 'lucide-react';
import {
  NEMOTRON_MODEL,
  OpenRouterError,
  askNemotron,
  clearOpenRouterKey,
  loadOpenRouterKey,
  saveOpenRouterKey,
  validateOpenRouterKey,
  type ChatMessage,
} from '../../services/ai/openrouter';
import {
  MAX_CONTEXT_CHARS,
  MAX_QUESTION_CHARS,
  OFF_TOPIC_MESSAGE,
  SCOPE_RULES,
  checkQuestion,
  checkRateLimit,
  isOffTopicAnswer,
  recordRequest,
} from '../../services/ai/guardrails';

export interface ExplainPreset {
  label: string;
  prompt: string;
}

interface Props {
  title?: string;
  /** Short line under the title. */
  hint?: string;
  /** Everything the AI needs to know. Built only when the student asks. */
  getContext: () => string;
  presets: ExplainPreset[];
  placeholder?: string;
}

interface Turn {
  q: string;
  a: string;
}

const MAX_TURNS_SENT = 6;

const SYSTEM_PROMPT =
  'You are a patient DSA tutor inside a practice website. The student did not understand the ' +
  "website's own explanation, so explain it again in a clearer way.\n" +
  SCOPE_RULES +
  'Answer shape (follow it every time):\n' +
  '1. First line: the key takeaway in ONE short sentence.\n' +
  '2. Then 3 to 5 short bullets starting with "- ". One idea per bullet. Bold the key term with **double stars**. ' +
  'When you use a technical term, say what it means and WHY it behaves that way.\n' +
  '3. If code helps, add ONE small code block in ``` fences (only the lines that matter).\n' +
  'Rules: under about 180 words unless asked for more. Refer to code lines as "line N". Wrap code names in `backticks`. ' +
  'No headings, no tables, no LaTeX, no greeting, no closing question.\n' +
  'Use the CONTEXT below. If the student asks something outside it, answer briefly and say so.\n\n' +
  'CONTEXT:\n';

const box: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--accent) 30%, var(--line))',
  background: 'color-mix(in srgb, var(--accent) 4%, var(--surface))',
  borderRadius: '0.5rem',
  padding: 'clamp(0.85rem, 3.5vw, 1.25rem)',
  marginTop: '1rem',
  minWidth: 0,
  overflowWrap: 'anywhere',
};

const btn: React.CSSProperties = {
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  color: 'inherit',
  borderRadius: '0.375rem',
  padding: '0.5rem 0.85rem',
  minHeight: '2.75rem', // 44px tap target
  fontSize: '0.875rem',
  cursor: 'pointer',
};

const field: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '2.75rem',
  border: '1px solid var(--line)',
  borderRadius: '0.375rem',
  background: 'var(--bg)',
  color: 'inherit',
  fontSize: '1rem', // 16px: iPhone Safari zooms the page on smaller inputs
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: 'var(--accent)',
  borderColor: 'var(--accent)',
  color: '#fff',
};

const linkStyle: React.CSSProperties = {
  color: 'var(--accent)',
  textDecoration: 'underline',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.2rem',
};

const muted: React.CSSProperties = { color: 'var(--muted)' };

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/** `code`, **bold**, *italic* and "line N" highlights, with no markdown library. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) => {
    const k = keyPrefix + i;
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={k}
          style={{
            fontFamily: MONO,
            fontSize: '0.85em',
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            padding: '0.05rem 0.35rem',
            borderRadius: '0.3rem',
            overflowWrap: 'anywhere',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={k} style={{ fontWeight: 650 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <em key={k}>{part.slice(1, -1)}</em>;
    }
    return <span key={k}>{part}</span>;
  });
}

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'code'; text: string };

/** Splits the model's markdown into paragraphs, lists and code blocks. */
function parseBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  const lines = raw.replace(/\r/g, '').split('\n');
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ') });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      flush();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      blocks.push({ kind: 'code', text: code.join('\n') });
      continue;
    }
    const bullet = /^\s*[-*\u2022]\s+(.*)$/.exec(line);
    const num = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || num) {
      flush();
      const kind = bullet ? 'ul' : 'ol';
      const item = (bullet ?? num)![1];
      const last = blocks[blocks.length - 1];
      if (last && (last.kind === 'ul' || last.kind === 'ol') && last.kind === kind) last.items.push(item);
      else blocks.push({ kind, items: [item] });
      continue;
    }
    const heading = /^\s{0,3}#{1,4}\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      blocks.push({ kind: 'p', text: '**' + heading[1].replace(/\*+/g, '') + '**' });
      continue;
    }
    if (line.trim() === '') flush();
    else para.push(line.trim());
  }
  flush();
  return blocks;
}

function renderAnswer(text: string): React.ReactNode {
  const blocks = parseBlocks(text);
  return blocks.map((b, i) => {
    const k = 'b' + i;
    if (b.kind === 'code') {
      return (
        <pre
          key={k}
          style={{
            margin: '0.7rem 0 0',
            padding: '0.75rem 0.9rem',
            overflowX: 'auto',
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            borderRadius: '0.45rem',
            fontSize: '0.8125rem',
            lineHeight: 1.55,
            maxWidth: '100%',
            whiteSpace: 'pre',
          }}
        >
          <code style={{ fontFamily: MONO }}>{b.text}</code>
        </pre>
      );
    }
    if (b.kind === 'ul' || b.kind === 'ol') {
      const Tag = b.kind;
      return (
        <Tag
          key={k}
          style={{
            margin: '0.6rem 0 0',
            paddingLeft: '1.25rem',
            listStyle: b.kind === 'ul' ? 'disc' : 'decimal',
            display: 'grid',
            gap: '0.45rem',
          }}
        >
          {b.items.map((it, j) => (
            <li key={j} style={{ paddingLeft: '0.15rem', lineHeight: 1.6 }}>
              {renderInline(it, k + '-' + j + '-')}
            </li>
          ))}
        </Tag>
      );
    }
    // the first paragraph is the key takeaway: give it a highlight
    const isTakeaway = i === 0;
    return (
      <p
        key={k}
        style={
          isTakeaway
            ? {
                margin: 0,
                padding: '0.6rem 0.8rem',
                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                borderRadius: '0.45rem',
                lineHeight: 1.6,
                fontWeight: 500,
              }
            : { margin: '0.7rem 0 0', lineHeight: 1.6 }
        }
      >
        {renderInline(b.text, k + '-')}
      </p>
    );
  });
}

function KeySetup({ onSaved, notice }: { onSaved: () => void; notice?: string | null }): React.ReactElement {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await validateOpenRouterKey(value);
      saveOpenRouterKey(value);
      setValue('');
      onSaved();
    } catch (err) {
      setError(err instanceof OpenRouterError ? err.userMessage : err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {notice && (
        <p role="alert" style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--bad)' }}>
          {notice}
        </p>
      )}
      <p style={{ margin: '0 0 0.6rem', fontSize: '0.875rem' }}>
        Get a different explanation from AI. It is free, and you use your own key (takes about 2 minutes):
      </p>
      <ol style={{ margin: '0 0 0.75rem', paddingLeft: '1.4rem', listStyle: 'decimal', fontSize: '0.875rem', lineHeight: 1.7 }}>
        <li>
          Open{' '}
          <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            openrouter.ai <ExternalLink size={11} />
          </a>{' '}
          and sign up (Google or GitHub works).
        </li>
        <li>
          Go to{' '}
          <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Settings, Keys <ExternalLink size={11} />
          </a>{' '}
          and click <strong>Create Key</strong>. Any name is fine. Leave the credit limit empty.
        </li>
        <li>
          Copy the key (it starts with <code>sk-or-</code>) and paste it below.
        </li>
      </ol>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 14rem' }}>
          <KeyRound size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', ...muted }} />
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="sk-or-..."
            disabled={busy}
            aria-label="OpenRouter API key"
            style={{ ...field, padding: '0.45rem 0.6rem 0.45rem 1.9rem' }}
          />
        </div>
        <button type="submit" style={{ ...btnPrimary, opacity: busy || !value.trim() ? 0.5 : 1 }} disabled={busy || !value.trim()}>
          {busy ? 'Checking...' : 'Save key'}
        </button>
      </div>
      {error && (
        <p role="alert" style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--bad)' }}>
          {error}
        </p>
      )}
      <p style={{ margin: '0.6rem 0 0', fontSize: '0.75rem', ...muted }}>
        Uses the free model <code>{NEMOTRON_MODEL}</code>, so it costs nothing, but free models have per-minute and
        per-day request limits. Your key stays in this browser and is sent only to OpenRouter. The same key works on
        the Problems and Concepts pages.
      </p>
    </form>
  );
}

export function AiExplain({ title = 'Still unclear? Ask AI', hint, getContext, presets, placeholder }: Props): React.ReactElement {
  const [hasKey, setHasKey] = useState<boolean>(() => loadOpenRouterKey() !== null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');

  const ask = useCallback(
    async (q: string, typed = false) => {
      if (loading) return;
      // Typed questions are cleaned and screened. Preset buttons are trusted text.
      let text = q.trim();
      if (typed) {
        const check = checkQuestion(q);
        if (!check.ok) {
          setError(check.reason);
          return;
        }
        text = check.text;
      }
      if (!text) return;
      const limited = checkRateLimit();
      if (limited) {
        setError(limited);
        return;
      }
      setLoading(true);
      setPending(text);
      setError(null);
      try {
        recordRequest();
        const history: ChatMessage[] = turns.slice(-MAX_TURNS_SENT).flatMap((t) => [
          { role: 'user' as const, content: t.q },
          { role: 'assistant' as const, content: t.a },
        ]);
        const answer = await askNemotron([
          { role: 'system', content: SYSTEM_PROMPT + getContext().slice(0, MAX_CONTEXT_CHARS) },
          ...history,
          { role: 'user', content: text },
        ]);
        if (isOffTopicAnswer(answer)) {
          setError(OFF_TOPIC_MESSAGE);
        } else {
          setTurns((prev) => [...prev, { q: text, a: answer }]);
          setQuestion('');
        }
      } catch (err) {
        if (err instanceof OpenRouterError && (err.kind === 'invalid-key' || err.kind === 'missing-key')) {
          setHasKey(false);
        }
        setError(err instanceof OpenRouterError ? err.userMessage : err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
        setPending(null);
      }
    },
    [getContext, loading, turns],
  );

  const changeKey = () => {
    clearOpenRouterKey();
    setHasKey(false);
  };

  return (
    <section style={box} aria-label="AI explanation">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Sparkles size={14} /> {title}
        </h3>
        {hasKey && (
          <button type="button" style={{ ...btn, border: 'none', background: 'none', padding: 0, ...muted, textDecoration: 'underline' }} onClick={changeKey}>
            Change key
          </button>
        )}
      </div>
      {hint && <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem', ...muted }}>{hint}</p>}

      <div style={{ marginTop: '0.75rem' }}>
        {!hasKey ? (
          <KeySetup
            notice={error}
            onSaved={() => {
              setHasKey(true);
              setError(null);
            }}
          />
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {presets.map((p) => (
                <button key={p.label} type="button" style={{ ...btn, opacity: loading ? 0.5 : 1 }} disabled={loading} onClick={() => void ask(p.prompt)}>
                  {p.label}
                </button>
              ))}
            </div>

            {turns.map((t, i) => (
              <div key={i} style={{ marginTop: '1rem' }}>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', ...muted }}>
                  {t.q.length > 110 ? t.q.slice(0, 110) + '...' : t.q}
                </p>
                <div
                  style={{
                    fontSize: '0.9375rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '0.6rem',
                    padding: 'clamp(0.7rem, 3vw, 1rem)',
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {renderAnswer(t.a)}
                </div>
              </div>
            ))}

            {loading && (
              <p role="status" style={{ margin: '0.9rem 0 0', fontSize: '0.8125rem', ...muted }}>
                Thinking about "{pending && pending.length > 60 ? pending.slice(0, 60) + '...' : pending}"... a large free model can take up to a minute.
              </p>
            )}

            {error && (
              <p role="alert" style={{ margin: '0.75rem 0 0', fontSize: '0.8125rem', color: 'var(--bad)' }}>
                {error}
              </p>
            )}

            <form
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.9rem', flexWrap: 'wrap' }}
              onSubmit={(e) => {
                e.preventDefault();
                void ask(question, true);
              }}
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={MAX_QUESTION_CHARS}
                placeholder={placeholder ?? 'Ask your own question...'}
                aria-label="Ask the AI a question"
                disabled={loading}
                style={{ ...field, flex: '1 1 12rem', width: 'auto', padding: '0.45rem 0.6rem' }}
              />
              <button type="submit" style={{ ...btnPrimary, opacity: loading || !question.trim() ? 0.5 : 1 }} disabled={loading || !question.trim()}>
                Ask
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
