import type { Language, PerLanguage, Problem } from '../types/problem';

export interface BugSpec {
  /** A snippet that must appear in the correct line. Throws if the line number is wrong. */
  was: string;
  /** The buggy replacement for this line (indentation is copied from the correct line). */
  buggy: string;
  /** Extra accepted fixes besides the correct line itself. */
  fixes?: string[];
}

export interface LangSpec {
  /** The correct code. Line numbers in `bugs` refer to this text (1-based). */
  correct: string;
  bugs: Record<number, BugSpec>;
}

export type ProblemSpec = Omit<
  Problem,
  'buggyCode' | 'correctCode' | 'buggyLines' | 'acceptedFixes' | 'languages'
> & { code: PerLanguage<LangSpec> };

function toLines(code: string): string[] {
  return code.replace(/^\n/, '').replace(/\n+$/, '').split('\n');
}

/**
 * Authors write the correct code once and list which lines are buggy.
 * Buggy code, buggy line numbers and accepted fixes are derived, so the
 * line numbers shown in the editor can never drift from the data.
 */
export function defineProblem(spec: ProblemSpec): Problem {
  const { code, ...rest } = spec;
  const problem: Problem = {
    ...rest,
    languages: [],
    buggyCode: {},
    correctCode: {},
    buggyLines: {},
    acceptedFixes: {},
  };

  (Object.keys(code) as Language[]).forEach((lang) => {
    const langSpec = code[lang];
    if (!langSpec) return;
    const correctLines = toLines(langSpec.correct);
    const buggyLines = [...correctLines];
    const bugNumbers = Object.keys(langSpec.bugs)
      .map(Number)
      .sort((a, b) => a - b);
    const fixes: Record<string, string[]> = {};

    for (const n of bugNumbers) {
      const bug = langSpec.bugs[n];
      const original = correctLines[n - 1];
      if (original === undefined) {
        throw new Error(`Problem ${spec.id} (${lang}): bug line ${n} is out of range`);
      }
      if (!original.includes(bug.was)) {
        throw new Error(
          `Problem ${spec.id} (${lang}): line ${n} is "${original.trim()}" but expected it to contain "${bug.was}"`,
        );
      }
      const indent = original.match(/^\s*/)?.[0] ?? '';
      buggyLines[n - 1] = indent + bug.buggy.trim();
      fixes[String(n)] = Array.from(new Set([original.trim(), ...(bug.fixes ?? [])]));
    }

    problem.languages.push(lang);
    problem.correctCode[lang] = correctLines.join('\n');
    problem.buggyCode[lang] = buggyLines.join('\n');
    problem.buggyLines[lang] = bugNumbers;
    problem.acceptedFixes[lang] = fixes;
  });

  return problem;
}
