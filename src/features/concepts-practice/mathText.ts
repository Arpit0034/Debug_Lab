/**
 * Turns the LaTeX the AI sometimes writes ("$a^b \pmod m$", "O(n^{2})", "\frac{a}{b}") into
 * readable text with real superscripts ("aᵇ (mod m)", "O(n²)"). No library needed.
 */
const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ',
  m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
};
const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', r: 'ᵣ',
  s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
};

const SYMBOLS: Array<[string, string]> = [
  ['times', '×'], ['cdot', '·'], ['leq', '≤'], ['le', '≤'], ['geq', '≥'], ['ge', '≥'], ['neq', '≠'],
  ['ne', '≠'], ['approx', '≈'], ['infty', '∞'], ['sum', '∑'], ['prod', '∏'], ['pm', '±'],
  ['rightarrow', '→'], ['to', '→'], ['leftarrow', '←'], ['Rightarrow', '⇒'], ['Leftarrow', '⇐'],
  ['in', '∈'], ['ldots', '…'], ['dots', '…'], ['cdots', '…'], ['oplus', '⊕'], ['land', '∧'],
  ['lor', '∨'], ['lfloor', '⌊'], ['rfloor', '⌋'], ['lceil', '⌈'], ['rceil', '⌉'], ['equiv', '≡'],
  ['cup', '∪'], ['cap', '∩'], ['subset', '⊂'], ['mid', '|'], ['Theta', 'Θ'], ['Omega', 'Ω'],
  ['Sigma', 'Σ'], ['theta', 'θ'], ['alpha', 'α'], ['beta', 'β'], ['gamma', 'γ'], ['delta', 'δ'],
  ['epsilon', 'ε'], ['pi', 'π'], ['sigma', 'σ'], ['lambda', 'λ'], ['mu', 'μ'], ['log', 'log'],
  ['ln', 'ln'], ['min', 'min'], ['max', 'max'], ['gcd', 'gcd'], ['lg', 'lg'],
];

function toScript(body: string, map: Record<string, string>, mark: '^' | '_'): string {
  const chars = [...body.trim()];
  const out = chars.map((c) => map[c]);
  return out.length > 0 && out.every(Boolean) ? out.join('') : mark + '(' + body.trim() + ')';
}

export function latexToText(src: string): string {
  let s = src;
  s = s.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)');
  s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)');
  s = s.replace(/\\(?:text|textbf|textit|mathrm|mathbf|mathit|operatorname)\s*\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\pmod\s*\{([^{}]*)\}/g, ' (mod $1)');
  s = s.replace(/\\pmod\s+([A-Za-z0-9]+)/g, ' (mod $1)');
  s = s.replace(/\\(?:bmod|mod)(?![A-Za-z])/g, ' mod ');
  s = s.replace(/\\(?:left|right|big|Big|bigg|Bigg)(?![A-Za-z])/g, '');
  for (const [cmd, sym] of SYMBOLS) {
    s = s.replace(new RegExp('\\\\' + cmd + '(?![A-Za-z])', 'g'), sym);
  }
  s = s.replace(/\^\s*\{([^{}]*)\}/g, (_m, b: string) => toScript(b, SUP, '^'));
  s = s.replace(/\^\s*(-?[A-Za-z0-9])/g, (_m, b: string) => toScript(b, SUP, '^'));
  s = s.replace(/_\s*\{([^{}]*)\}/g, (_m, b: string) => toScript(b, SUB, '_'));
  s = s.replace(/_\s*([A-Za-z0-9])/g, (_m, b: string) => toScript(b, SUB, '_'));
  s = s.replace(/\\[,;:! ]/g, ' ');
  s = s.replace(/\\\\/g, ' ');
  s = s.replace(/[{}]/g, '');
  s = s.replace(/\\([A-Za-z]+)/g, '$1'); // unknown command: keep its name, drop the backslash
  return s.replace(/\s{2,}/g, ' ').trim();
}

export type Piece =
  | { kind: 'text'; text: string }
  | { kind: 'math'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'block'; text: string }
  | { kind: 'bold'; text: string };

// Order matters: fenced code, $$..$$, \[..\], \(..\), inline code, $..$, **bold**.
const TOKEN =
  /```(?:[a-zA-Z0-9+#-]*\n)?([\s\S]*?)```|\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|`([^`\n]+)`|\$(?!\s)([^$\n]+?)(?<!\s)\$|\*\*([^*\n]+)\*\*/g;

export function parseRich(input: string): Piece[] {
  const out: Piece[] = [];
  let last = 0;
  for (const m of input.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ kind: 'text', text: input.slice(last, at) });
    if (m[1] !== undefined) out.push({ kind: 'block', text: m[1].replace(/\n$/, '') });
    else if (m[2] !== undefined) out.push({ kind: 'math', text: latexToText(m[2]) });
    else if (m[3] !== undefined) out.push({ kind: 'math', text: latexToText(m[3]) });
    else if (m[4] !== undefined) out.push({ kind: 'math', text: latexToText(m[4]) });
    else if (m[5] !== undefined) out.push({ kind: 'code', text: m[5] });
    else if (m[6] !== undefined) out.push({ kind: 'math', text: latexToText(m[6]) });
    else if (m[7] !== undefined) out.push({ kind: 'bold', text: m[7] });
    last = at + m[0].length;
  }
  if (last < input.length) out.push({ kind: 'text', text: input.slice(last) });
  return out;
}
