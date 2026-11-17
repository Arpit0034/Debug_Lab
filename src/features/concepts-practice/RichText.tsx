import { parseRich } from './mathText';

/** Renders AI text: `code`, ```blocks```, **bold** and LaTeX math, with no extra library. */
export function RichText({ text }: { text: string }): React.ReactElement {
  const pieces = parseRich(text);
  return (
    <>
      {pieces.map((p, i) => {
        switch (p.kind) {
          case 'math':
            return <span key={i} className="cp-math">{p.text}</span>;
          case 'code':
            return <code key={i} className="cx-mono cp-inline-code">{p.text}</code>;
          case 'bold':
            return <strong key={i}>{p.text}</strong>;
          case 'block':
            return <pre key={i} className="cp-code-block"><code className="cx-mono">{p.text}</code></pre>;
          default:
            return <span key={i}>{p.text}</span>;
        }
      })}
    </>
  );
}
