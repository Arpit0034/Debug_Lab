import { useEffect, useMemo, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view';
import { StateEffect, StateField, type Extension } from '@codemirror/state';
import type { Language } from '../../types/problem';

export type LineMark = 'selected' | 'hit' | 'wrong' | 'missed' | 'fixed';

const setMarks = StateEffect.define<Record<number, LineMark>>();

const marksField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setMarks)) {
        const ranges = Object.entries(e.value)
          .map(([line, mark]) => ({ n: Number(line), mark }))
          .filter(({ n }) => n >= 1 && n <= tr.state.doc.lines)
          .map(({ n, mark }) =>
            Decoration.line({ class: `cm-mark-${mark}` }).range(tr.state.doc.line(n).from),
          );
        return Decoration.set(ranges, true);
      }
    }
    return value.map(tr.changes);
  },
  provide: (f) => EditorView.decorations.from(f),
});

const markTheme = EditorView.baseTheme({
  '.cm-mark-selected': { backgroundColor: 'rgba(79, 140, 255, 0.28)', boxShadow: 'inset 3px 0 0 #4f8cff' },
  '.cm-mark-hit': { backgroundColor: 'rgba(63, 185, 122, 0.25)', boxShadow: 'inset 3px 0 0 #3fb97a' },
  '.cm-mark-wrong': { backgroundColor: 'rgba(229, 96, 79, 0.25)', boxShadow: 'inset 3px 0 0 #e5604f' },
  '.cm-mark-missed': { backgroundColor: 'rgba(224, 164, 58, 0.25)', boxShadow: 'inset 3px 0 0 #e0a43a' },
  '.cm-mark-fixed': { backgroundColor: 'rgba(63, 185, 122, 0.25)', boxShadow: 'inset 3px 0 0 #3fb97a' },
});

function languageExtension(language: Language): Extension {
  if (language === 'java') return java();
  if (language === 'python') return python();
  return cpp();
}

interface Props {
  code: string;
  language: Language;
  marks: Record<number, LineMark>;
  /** When provided and not locked, clicking a line calls this with its 1-based number. */
  onToggleLine?: (line: number) => void;
  dark: boolean;
  fontSize: number;
  ariaLabel: string;
}

export function CodeEditor({ code, language, marks, onToggleLine, dark, fontSize, ariaLabel }: Props) {
  const viewRef = useRef<EditorView | null>(null);
  const marksRef = useRef(marks);
  const toggleRef = useRef(onToggleLine);

  useEffect(() => {
    marksRef.current = marks;
    toggleRef.current = onToggleLine;
    viewRef.current?.dispatch({ effects: setMarks.of(marks) });
  }, [marks, onToggleLine]);

  const extensions = useMemo<Extension[]>(
    () => [
      languageExtension(language),
      marksField,
      markTheme,
      EditorView.editable.of(false),
      EditorView.theme({
        '&': { fontSize: `${fontSize}px` },
        '.cm-scroller': { fontFamily: 'var(--font-mono)' },
        '.cm-line': { cursor: 'pointer' },
      }),
      EditorView.domEventHandlers({
        mousedown(event, view) {
          const toggle = toggleRef.current;
          if (!toggle) return false;
          const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
          if (pos === null) return false;
          toggle(view.state.doc.lineAt(pos).number);
          return true;
        },
      }),
    ],
    [language, fontSize],
  );

  return (
    <CodeMirror
      key={language}
      value={code}
      extensions={extensions}
      theme={dark ? oneDark : 'light'}
      readOnly
      editable={false}
      aria-label={ariaLabel}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
        dropCursor: false,
        indentOnInput: false,
      }}
      onCreateEditor={(view) => {
        viewRef.current = view;
        view.dispatch({ effects: setMarks.of(marksRef.current) });
      }}
    />
  );
}
