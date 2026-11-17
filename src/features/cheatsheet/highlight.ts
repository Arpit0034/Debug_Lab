export type TokenKind =
  | 'kw'
  | 'type'
  | 'str'
  | 'num'
  | 'comment'
  | 'punct'
  | 'ident'
  | 'space';

export interface Token {
  kind: TokenKind;
  value: string;
}

const COMMON_KW = [
  'if', 'else', 'for', 'while', 'do', 'return', 'break', 'continue',
  'true', 'false', 'null', 'nullptr', 'None', 'True', 'False',
  'try', 'catch', 'finally', 'throw', 'throws', 'raise', 'except',
  'class', 'struct', 'interface', 'enum', 'import', 'from', 'package',
  'this', 'self', 'super', 'new', 'delete',
  'public', 'private', 'protected', 'static', 'final', 'const',
  'constexpr', 'auto', 'void', 'int', 'long', 'short', 'byte', 'char',
  'boolean', 'float', 'double', 'signed', 'unsigned', 'bool', 'size_t',
  'def', 'lambda', 'yield', 'async', 'await', 'with', 'as', 'in',
  'not', 'and', 'or', 'is', 'assert', 'pass', 'global', 'nonlocal',
  'switch', 'case', 'default', 'instanceof', 'extends', 'implements',
  'abstract', 'synchronized', 'volatile', 'transient', 'native',
  'namespace', 'using', 'typename', 'template', 'friend', 'inline',
  'virtual', 'explicit', 'sizeof', 'typedef', 'union', 'extern',
  'register', 'goto', 'record',
];

const TYPE_HINTS = [
  'String', 'Object', 'Integer', 'Long', 'Double', 'Float', 'Boolean',
  'Character', 'ArrayList', 'List', 'Map', 'HashMap', 'Set', 'HashSet',
  'Deque', 'ArrayDeque', 'PriorityQueue', 'Stack', 'Queue',
  'std', 'vector', 'string', 'map', 'unordered_map', 'set',
  'unordered_set', 'pair', 'deque', 'priority_queue', 'unordered_multimap',
  'TreeNode', 'ListNode',
];

const KW_SET = new Set(COMMON_KW);
const TYPE_SET = new Set(TYPE_HINTS);

export function tokenize(
  code: string,
  lang: 'python' | 'java' | 'cpp',
): Token[] {
  const commentMark = lang === 'python' ? '#' : '//';
  const tokens: Token[] = [];
  let i = 0;

  const push = (kind: TokenKind, value: string) => {
    if (value) tokens.push({ kind, value });
  };

  while (i < code.length) {
    if (code.startsWith(commentMark, i)) {
      const end = code.indexOf('\n', i);
      const stop = end === -1 ? code.length : end;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    const ch = code[i];

    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== ch) {
        if (code[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, code.length);
      push('str', code.slice(i, j));
      i = j;
      continue;
    }

    if (ch >= '0' && ch <= '9') {
      let j = i;
      while (j < code.length && /[0-9a-fA-FxX._]/.test(code[j])) j++;
      push('num', code.slice(i, j));
      i = j;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (KW_SET.has(word)) push('kw', word);
      else if (TYPE_SET.has(word)) push('type', word);
      else push('ident', word);
      i = j;
      continue;
    }

    if (/\s/.test(ch)) {
      let j = i;
      while (j < code.length && /\s/.test(code[j])) j++;
      push('space', code.slice(i, j));
      i = j;
      continue;
    }

    push('punct', ch);
    i++;
  }

  return tokens;
}
