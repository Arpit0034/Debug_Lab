import { Link } from 'react-router-dom';
import { Award, ExternalLink, Mic, RotateCcw, Square, KeyRound, Sparkles } from 'lucide-react';
import type {
  AnswerIndex,
  Difficulty,
  ErrorCard,
  ExplanationGrade,
  MCQuestion,
  QuestionAttempt,
  RoundResult,
} from './types';
import { roundQuestions } from './types';

import { CoachingBlocks, QuestionSetRecap, RoundReviewList } from './reviews';
import { RichText } from './RichText';

const ROUND_OPTIONS = [5, 7] as const;
const PER_ROUND_OPTIONS = [1, 2, 3] as const;
export const QUESTIONS_PER_SET = 3;

const DIFFICULTY_INFO: Record<Difficulty, { label: string; blurb: string }> = {
  easy: { label: 'Easy', blurb: 'Clear clues, obvious wrong answers' },
  medium: { label: 'Medium', blurb: 'Implied clues, plausible distractors' },
  hard: { label: 'Hard', blurb: 'Subtle, close neighbours, trade-offs' },
};

export function ApiKeyPanel({
  input,
  groqInput,
  error,
  saving,
  hasSavedGroq,
  hasSavedGemini,
  onChange,
  onGroqChange,
  orInput,
  onOrChange,
  hasSavedOr,
  onSubmit,
}: {
  input: string;
  groqInput: string;
  error: string | null;
  saving: boolean;
  hasSavedGroq: boolean;
  hasSavedGemini: boolean;
  onChange: (v: string) => void;
  onGroqChange: (v: string) => void;
  orInput: string;
  onOrChange: (v: string) => void;
  hasSavedOr: boolean;
  onSubmit: () => void;
}): React.ReactElement {
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saving) onSubmit();
  };
  const canSave = !saving && (groqInput.trim() !== '' || hasSavedGroq);
  const linkStyle = {
    color: 'var(--accent)',
    border: '1px solid color-mix(in srgb, var(--accent) 30%, var(--line))',
  } as const;

  return (
    <form className="cx-card" style={{ padding: '1.5rem' }} onSubmit={submit}>
      <h2 className="cx-h2" style={{ marginTop: 0, fontSize: '1.25rem' }}>
        Connect AI
      </h2>
      <p className="cx-lead">
        Two free keys, two jobs. Groq writes your questions. Gemini listens to your voice. Keys stay in this browser.
      </p>

      <div className="cp-section">
        <label
          htmlFor="groq-key"
          className="cp-section__title"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          1. Groq API key (required - writes the questions)
        </label>
        <div className="cp-key-input-wrap">
          <KeyRound className="cp-key-icon" size={18} />
          <input
            id="groq-key"
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={groqInput}
            onChange={(e) => onGroqChange(e.target.value)}
            placeholder={hasSavedGroq ? 'Saved - leave empty to keep it' : 'gsk_...'}
            className="cp-key-input"
            disabled={saving}
          />
        </div>
        <p className="cx-small cx-muted" style={{ marginTop: '0.5rem' }}>
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="cx-btn cx-btn--sm cx-btn--ghost"
            style={linkStyle}
          >
            Get a free Groq key <ExternalLink size={12} />
          </a>
          <span className="cx-small cx-muted" style={{ marginLeft: '0.5rem' }}>
            Sign in, click Create API Key, copy it (starts with gsk_)
          </span>
        </p>
      </div>

      <div className="cp-section" style={{ marginTop: '1.5rem' }}>
        <label
          htmlFor="gemini-key"
          className="cp-section__title"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          2. Gemini API key (voice mode only - grades your speaking)
        </label>
        <div className="cp-key-input-wrap">
          <KeyRound className="cp-key-icon" size={18} />
          <input
            id="gemini-key"
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            placeholder={hasSavedGemini ? 'Saved - leave empty to keep it' : 'AIzaSy...'}
            className="cp-key-input"
            disabled={saving}
          />
        </div>
        <p className="cx-small cx-muted" style={{ marginTop: '0.5rem' }}>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="cx-btn cx-btn--sm cx-btn--ghost"
            style={linkStyle}
          >
            Get a free Gemini key <ExternalLink size={12} />
          </a>
          <span className="cx-small cx-muted" style={{ marginLeft: '0.5rem' }}>
            Needed only when you record your answer. You can add it later.
          </span>
        </p>
      </div>

      <div className="cp-section" style={{ marginTop: '1.5rem' }}>
        <label
          htmlFor="openrouter-key"
          className="cp-section__title"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          3. OpenRouter key (optional - free Nemotron backup when Groq is rate limited)
        </label>
        <div className="cp-key-input-wrap">
          <KeyRound className="cp-key-icon" size={18} />
          <input
            id="openrouter-key"
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={orInput}
            onChange={(e) => onOrChange(e.target.value)}
            placeholder={hasSavedOr ? 'Saved - leave empty to keep it' : 'sk-or-...'}
            className="cp-key-input"
            disabled={saving}
          />
        </div>
        <p className="cx-small cx-muted" style={{ marginTop: '0.5rem' }}>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="cx-btn cx-btn--sm cx-btn--ghost"
            style={linkStyle}
          >
            Get a free OpenRouter key <ExternalLink size={12} />
          </a>
          <span className="cx-small cx-muted" style={{ marginLeft: '0.5rem' }}>
            Also enable free models at openrouter.ai/settings/privacy.
          </span>
        </p>
      </div>

      {error && (
        <div
          className="cx-callout cx-callout--bad"
          style={{ marginTop: '0.75rem' }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'var(--surface-2)', borderRadius: '0.5rem', border: '1px solid var(--line)' }}>
        <p className="cx-small cx-muted" style={{ margin: 0, lineHeight: 1.5 }}>
          <strong>🔒 Privacy:</strong> Your keys are saved in this browser only. The Groq key is sent only to Groq,
          and the Gemini key only to Google (with your voice recording). If you deploy this publicly, add a backend proxy.
        </p>
      </div>

      <div
        className="cx-row"
        style={{ justifyContent: 'flex-end', marginTop: '1.25rem' }}
      >
        <button
          type="submit"
          className="cx-btn cx-btn--primary"
          disabled={!canSave}
        >
          {saving ? 'Validating...' : 'Save & validate'}
        </button>
      </div>
    </form>
  );
}

export function SessionSetupPanel({
  keyPrefix,
  targetRounds,
  onRoundsChange,
  difficulty,
  onDifficultyChange,
  perRound,
  onPerRoundChange,
  focusTitle,
  onClearFocus,
  onStart,
  onChangeKey,
  audioSupported,
  resumable,
  hasGeminiKey,
  sessionsLeft,
}: {
  sessionsLeft: number;
  hasGeminiKey: boolean;
  keyPrefix: string;
  targetRounds: number;
  onRoundsChange: (n: number) => void;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  perRound: 1 | 2 | 3;
  onPerRoundChange: (n: 1 | 2 | 3) => void;
  focusTitle: string | null;
  onClearFocus: () => void;
  onStart: () => void;
  onChangeKey: () => void;
  audioSupported: boolean;
  resumable: boolean;
}): React.ReactElement {
  const minutesPerRound = 1 + perRound * 0.5 + 1; // read + answer, then ~1 min of speaking and feedback
  const total = Math.max(5, Math.round((targetRounds * minutesPerRound) / 5) * 5);
  return (
    <div className="cx-card" style={{ padding: '1.5rem' }}>
      <div
        className="cx-row"
        style={{ justifyContent: 'space-between', marginBottom: '1rem' }}
      >
        <span
          className="cx-small"
          style={{ color: 'var(--good)', fontWeight: 600 }}
        >
          Groq connected - <code className="cx-mono">{keyPrefix}</code>
          {hasGeminiKey ? ' - Gemini voice ready' : ''}
        </span>
        <button
          type="button"
          className="cx-btn cx-btn--sm cx-btn--ghost"
          onClick={onChangeKey}
        >
          Change key
        </button>
      </div>

      {!hasGeminiKey && (
        <div className="cx-callout cx-callout--warn" style={{ marginBottom: '1rem' }}>
          Voice grading needs a free Gemini key. You can answer the questions now and add the key when it asks, or{' '}
          <button
            type="button"
            className="cx-btn cx-btn--sm cx-btn--ghost"
            onClick={onChangeKey}
          >
            add it now
          </button>
          .
        </div>
      )}

      {focusTitle && (
        <div className="cp-focus">
          <span>
            Starting with <strong>{focusTitle}</strong>, then a random mix.
          </span>
          <button type="button" className="cx-btn cx-btn--sm cx-btn--ghost" onClick={onClearFocus}>
            Clear
          </button>
        </div>
      )}

      <div className="cp-section">
        <p className="cp-section__title" id="cp-diff-label">Difficulty</p>
        <div className="cp-seg" role="radiogroup" aria-labelledby="cp-diff-label">
          {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={d === difficulty}
              className={'cp-seg__btn cp-seg__btn--' + d + (d === difficulty ? ' is-on' : '')}
              onClick={() => onDifficultyChange(d)}
            >
              <span className="cp-seg__name">{DIFFICULTY_INFO[d].label}</span>
              <span className="cp-seg__hint">{DIFFICULTY_INFO[d].blurb}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cp-section">
        <p className="cp-section__title" id="cp-per-label">Questions you must answer each round</p>
        <div className="cx-row" style={{ gap: '0.5rem', marginTop: '0.5rem' }} role="radiogroup" aria-labelledby="cp-per-label">
          {PER_ROUND_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={n === perRound}
              className={'cx-btn ' + (n === perRound ? 'cx-btn--primary' : 'cx-btn--ghost')}
              onClick={() => onPerRoundChange(n)}
            >
              {n} of {QUESTIONS_PER_SET}
            </button>
          ))}
        </div>
        <p className="cx-small cx-muted" style={{ marginTop: '0.75rem' }}>
          Every round shows {QUESTIONS_PER_SET} fresh {difficulty} questions. Answer at least {perRound}
          {perRound < QUESTIONS_PER_SET ? ' (the rest are optional)' : ''}, then explain the concept out loud.
        </p>
      </div>

      <div className="cp-section">
        <p className="cp-section__title" id="cp-rounds-label">Concepts this session</p>
        <div className="cx-row" style={{ gap: '0.5rem', marginTop: '0.5rem' }} role="radiogroup" aria-labelledby="cp-rounds-label">
          {ROUND_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={n === targetRounds}
              className={
                'cx-btn ' +
                (n === targetRounds ? 'cx-btn--primary' : 'cx-btn--ghost')
              }
              onClick={() => onRoundsChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="cx-small cx-muted" style={{ marginTop: '0.75rem' }}>
          About {total} minutes in total.
        </p>
      </div>

      <div className="cp-section">
        <p className="cp-section__title">Each round</p>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.7 }}>
          <li>Answer {perRound} or more of {QUESTIONS_PER_SET} recognition questions on one concept</li>
          <li>Explain that concept out loud for up to 90 seconds</li>
          <li>AI grades your content and your fluency</li>
          <li>
            After {targetRounds} concepts you get a report with freeze-risk flags
          </li>
        </ol>
        <p className="cx-small cx-muted" style={{ marginTop: '0.5rem' }}>
          Concepts are picked at random, weighted toward the ones you know least.
        </p>
      </div>

      {!audioSupported && (
        <div className="cx-callout cx-callout--bad">
          <strong>Microphone not available.</strong> Use Chrome, Safari, or
          Firefox on localhost or HTTPS.
        </div>
      )}

      <p className="cx-small cx-muted" style={{ marginTop: '1rem', textAlign: 'right' }}>
        {sessionsLeft > 0
          ? sessionsLeft + ' session' + (sessionsLeft === 1 ? '' : 's') + ' left today'
          : 'Daily limit reached. Come back tomorrow.'}
      </p>

      <div
        className="cx-row"
        style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}
      >
        <button
          type="button"
          className="cx-btn cx-btn--primary"
          onClick={onStart}
          disabled={!audioSupported || sessionsLeft <= 0}
        >
          {resumable ? 'Resume session' : 'Start session'} &rarr;
        </button>
      </div>
    </div>
  );
}

export function McPanel({
  mc,
  onAnswer,
  disabled,
  answer,
  correctIndex,
  hideWhy,
}: {
  mc: MCQuestion;
  onAnswer: (idx: 0 | 1 | 2 | 3) => void;
  disabled: boolean;
  answer: 0 | 1 | 2 | 3 | null;
  correctIndex: 0 | 1 | 2 | 3 | null;
  hideWhy?: boolean;
}): React.ReactElement {
  return (
    <div>
      <div className="cp-question"><RichText text={mc.question} /></div>
      <div className="cp-options">
        {mc.options.map((opt, i) => {
          const idx = i as 0 | 1 | 2 | 3;
          const isChosen = answer === idx;
          const isCorrect = correctIndex === idx;
          let cls = 'cp-option';
          if (disabled && isCorrect) cls += ' cp-option--correct';
          else if (disabled && isChosen && !isCorrect)
            cls += ' cp-option--wrong';
          return (
            <button
              key={idx}
              type="button"
              className={cls}
              aria-pressed={isChosen}
              disabled={disabled}
              onClick={() => onAnswer(idx)}
            >
              <span className="cp-option__badge">
                {String.fromCharCode(65 + idx)}
              </span>
              <span><RichText text={opt} /></span>
            </button>
          );
        })}
      </div>
      {disabled && correctIndex !== null && !hideWhy && (
        <div className="cx-callout cx-callout--good">
          <strong>Why:</strong> <RichText text={mc.why} />
        </div>
      )}
    </div>
  );
}

/** Three questions at once. Each locks when answered and shows the right answer and why. */
export function McSetPanel({
  questions,
  answers,
  required,
  difficulty,
  onAnswer,
}: {
  questions: MCQuestion[];
  answers: (AnswerIndex | null)[];
  required: number;
  difficulty: Difficulty;
  onAnswer: (qi: number, idx: AnswerIndex) => void;
}): React.ReactElement {
  const done = answers.filter((a) => a !== null).length;
  return (
    <div className="cp-qset">
      <div className="cp-qset__head">
        <span className={'cp-diff cp-diff--' + difficulty}>{difficulty}</span>
        <span className="cx-small cx-muted">
          {done} of {questions.length} answered
          {done < required ? ' - answer at least ' + required + ' to continue' : ''}
        </span>
      </div>
      {questions.map((q, qi) => {
        const a = answers[qi] ?? null;
        const locked = a !== null;
        return (
          <section
            key={qi}
            className={
              'cp-qset__item' +
              (locked ? (a === q.correct_index ? ' is-right' : ' is-wrong') : '')
            }
            aria-label={'Question ' + (qi + 1)}
          >
            <p className="cp-qset__num">
              Question {qi + 1}
              {qi >= required && !locked ? <span className="cp-qset__opt">optional</span> : null}
            </p>
            <McPanel
              mc={q}
              onAnswer={(idx) => onAnswer(qi, idx)}
              disabled={locked}
              answer={a}
              correctIndex={locked ? q.correct_index : null}
              hideWhy={a === q.correct_index}
            />
          </section>
        );
      })}
    </div>
  );
}

export function RecordingPanel({
  isRecording,
  timer,
  maxSeconds,
  onStart,
  onStop,
}: {
  isRecording: boolean;
  timer: number;
  maxSeconds: number;
  onStart: () => void;
  onStop: () => void;
}): React.ReactElement {
  return (
    <div className={'cp-record' + (isRecording ? ' cp-record--active' : '')}>
      <p className="cx-lead" style={{ textAlign: 'center', margin: 0 }}>
        Explain the concept in your own words, as if speaking to an interviewer.
      </p>
      {isRecording && (
        <p className="cp-record__timer">
          {timer}s / {maxSeconds}s
        </p>
      )}
      {isRecording ? (
        <button
          type="button"
          className="cp-record__btn"
          onClick={onStop}
          aria-label="Stop recording"
        >
          <Square size={20} fill="currentColor" />
        </button>
      ) : (
        <button
          type="button"
          className="cp-record__btn cp-record__btn--idle"
          onClick={onStart}
          aria-label="Start recording"
        >
          <Mic size={22} />
        </button>
      )}
      <p
        className="cx-small cx-muted"
        style={{ margin: 0, textAlign: 'center' }}
      >
        {isRecording
          ? 'Recording... stops automatically at 90 seconds.'
          : 'Click the microphone to start. 90-second limit.'}
      </p>
    </div>
  );
}

export function ResultPanel({
  explanation,
  conceptTitle,
  attempts,
}: {
  explanation: ExplanationGrade;
  conceptTitle: string;
  attempts: QuestionAttempt[];
}): React.ReactElement {
  const v = explanation.fluency;
  return (
    <div>
      <h2 className="cx-h2" style={{ marginTop: 0, fontSize: '1.25rem' }}>
        {conceptTitle} - feedback
      </h2>
      <QuestionSetRecap attempts={attempts} label="Recognition question" showWhy />

      <div className="cp-score">
        <span className="cp-score__num">{explanation.score}/5</span>
        <span className={'cp-verdict cp-verdict--' + v.verdict}>
          {v.verdict}
        </span>
        <span className="cx-small cx-muted" style={{ marginLeft: 'auto' }}>
          {v.hesitation_markers} filler word
          {v.hesitation_markers === 1 ? '' : 's'}
        </span>
      </div>
      <p className="cx-lead" style={{ marginTop: 0 }}>
        {explanation.one_line_feedback}
      </p>

      <div className="cp-section">
        <p className="cp-section__title">What you said</p>
        <blockquote className="cx-callout" style={{ margin: 0 }}>
          {explanation.transcript}
        </blockquote>
      </div>

      <CoachingBlocks explanation={explanation} />

      {explanation.strengths.length > 0 && (
        <div className="cp-section">
          <p className="cp-section__title" style={{ color: 'var(--good)' }}>
            Strengths
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {explanation.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {explanation.missing.length > 0 && (
        <div className="cp-section">
          <p className="cp-section__title" style={{ color: 'var(--warn)' }}>
            Missing
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {explanation.missing.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      {explanation.errors.length > 0 && (
        <div className="cp-section">
          <p className="cp-section__title" style={{ color: 'var(--bad)' }}>
            Errors
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {explanation.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ReportPanel({
  history,
  targetRounds,
  onReset,
}: {
  history: RoundResult[];
  targetRounds: number;
  onReset: () => void;
}): React.ReactElement {
  const attempts = history.flatMap(roundQuestions);
  const mcCorrect = attempts.filter((a) => a.correct).length;
  const mcTotal = attempts.length;
  const avgScore = history.length
    ? (
        history.reduce((s, h) => s + (h.explanation?.score ?? 0), 0) /
        history.length
      ).toFixed(1)
    : '0.0';
  const sorted = [...history].sort(
    (a, b) => (b.explanation?.score ?? 0) - (a.explanation?.score ?? 0),
  );
  const strongest = sorted.slice(0, 3);
  const weakest = sorted.slice(-3).reverse();
  const froze = history.filter((h) => h.explanation?.fluency.verdict === 'froze');

  return (
    <div>
      <h2 className="cx-h2" style={{ marginTop: 0 }}>
        Session report
      </h2>
      <p className="cx-lead">
        {history.length}/{targetRounds} concepts &middot; Questions {mcCorrect}/{mcTotal} (
        {mcTotal ? Math.round((mcCorrect / mcTotal) * 100) : 0}%) &middot; Avg{' '}
        {avgScore}/5
      </p>

      <div className="cp-report">
        <div className="cp-report__card cp-report__card--good">
          <p className="cp-section__title" style={{ color: 'var(--good)' }}>
            <Award size={12} /> Strongest
          </p>
          <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {strongest.map((h) => (
              <li key={h.conceptId}>
                <strong>{h.conceptTitle}</strong> &mdash;{' '}
                {h.explanation?.score}/5
              </li>
            ))}
          </ol>
        </div>

        <div className="cp-report__card cp-report__card--bad">
          <p className="cp-section__title" style={{ color: 'var(--bad)' }}>
            Needs work
          </p>
          <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {weakest.map((h) => (
              <li key={h.conceptId}>
                <strong>{h.conceptTitle}</strong> &mdash;{' '}
                {h.explanation?.score}/5
                {h.explanation?.missing.length ? (
                  <>
                    <br />
                    <span className="cx-small cx-muted">
                      Missing: {h.explanation.missing.slice(0, 2).join('; ')}
                    </span>
                  </>
                ) : null}
                {h.explanation?.improvements?.[0] ? (
                  <>
                    <br />
                    <span className="cx-small">
                      <strong>Tip:</strong> {h.explanation.improvements[0]}
                    </span>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        {froze.length > 0 && (
          <div className="cp-report__card cp-report__card--freeze">
            <p className="cp-section__title" style={{ color: 'var(--warn)' }}>
              Freeze risk - knew it but couldn&apos;t speak it
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {froze.map((h) => (
                <li key={h.conceptId}>
                  <strong>{h.conceptTitle}</strong>
                  <br />
                  <span className="cx-small cx-muted">
                    Re-reading will not help - practice speaking this one 3
                    times out loud.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <RoundReviewList history={history} />

      <div
        className="cx-row"
        style={{ justifyContent: 'space-between', marginTop: '1.5rem' }}
      >
        <Link to="/concepts" className="cx-btn cx-btn--ghost">
          &larr; Back to concepts
        </Link>
        <button
          type="button"
          className="cx-btn cx-btn--primary"
          onClick={onReset}
        >
          <RotateCcw size={14} /> New session
        </button>
      </div>
    </div>
  );
}

export function ErrorPanel({
  card,
  onUpdateKey,
  onSkip,
}: {
  card: ErrorCard;
  onUpdateKey: () => void;
  /** Lets the user move on to the next round when voice grading keeps failing. */
  onSkip?: () => void;
}): React.ReactElement {
  return (
    <div
      className="cx-card"
      style={{ padding: '1.5rem', borderLeft: '3px solid var(--bad)' }}
    >
      <h2
        className="cx-h2"
        style={{ marginTop: 0, fontSize: '1.25rem', color: 'var(--bad)' }}
      >
        Something went wrong
      </h2>
      <p style={{ marginTop: 0, fontSize: '1rem' }}>{card.message}</p>
      {card.hint && <p className="cx-small cx-muted">{card.hint}</p>}
      {card.statusCode && (
        <p className="cx-small cx-muted">HTTP {card.statusCode}</p>
      )}
      <div
        className="cx-row"
        style={{
          justifyContent: 'flex-end',
          gap: '0.5rem',
          marginTop: '1.25rem',
        }}
      >
        {onSkip && (
          <button type="button" className="cx-btn cx-btn--ghost" onClick={onSkip}>
            Skip voice, next concept
          </button>
        )}
        {card.retryable && card.onRetry && (
          <button
            type="button"
            className="cx-btn cx-btn--ghost"
            onClick={card.onRetry}
          >
            Retry
          </button>
        )}
        <button
          type="button"
          className="cx-btn cx-btn--primary"
          onClick={onUpdateKey}
        >
          Update API key
        </button>
      </div>
    </div>
  );
}


export function TutorPanel({
  onAsk,
  loading,
  response,
}: {
  onAsk: (type: 'simple' | 'analogy' | 'code') => void;
  loading: boolean;
  response: string | null;
}): React.ReactElement {
  return (
    <div className="cx-card" style={{ marginTop: '1rem', border: '1px solid color-mix(in srgb, var(--accent) 30%, var(--line))', background: 'color-mix(in srgb, var(--accent) 4%, var(--surface))' }}>
      <p className="cp-section__title" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <Sparkles size={14} /> AI Tutor
      </p>
      <p className="cx-small" style={{ margin: '0 0 0.75rem 0' }}>
        Not sure what this means? Ask the AI for a different perspective:
      </p>
      <div className="cx-row" style={{ gap: '0.5rem', marginBottom: response ? '1rem' : '0' }}>
        <button
          type="button"
          className="cx-btn cx-btn--sm cx-btn--ghost"
          onClick={() => onAsk('simple')}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Simple English'}
        </button>
        <button
          type="button"
          className="cx-btn cx-btn--sm cx-btn--ghost"
          onClick={() => onAsk('analogy')}
          disabled={loading}
        >
          Real-world analogy
        </button>
        <button
          type="button"
          className="cx-btn cx-btn--sm cx-btn--ghost"
          onClick={() => onAsk('code')}
          disabled={loading}
        >
          Code snippet
        </button>
      </div>
      {response && (
        <div className="cx-callout cx-callout--good" style={{ margin: 0, fontSize: '0.875rem' }}>
          {response}
        </div>
      )}
    </div>
  );
}
