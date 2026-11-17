import { Lightbulb } from 'lucide-react';
import type { ExplanationGrade, MCQuestion, QuestionAttempt, RoundResult } from './types';
import { roundQuestions } from './types';
import { loadProgress } from './storage';
import { RichText } from './RichText';

type Answer = 0 | 1 | 2 | 3 | null;

function OptionsList({ mc, mcAnswer }: { mc: MCQuestion; mcAnswer: Answer }): React.ReactElement {
  return (
    <ul className="cp-qopts">
      {mc.options.map((opt, i) => {
        const isCorrect = i === mc.correct_index;
        const isChosen = i === mcAnswer;
        let cls = 'cp-qopt';
        if (isCorrect) cls += ' cp-qopt--correct';
        else if (isChosen) cls += ' cp-qopt--wrong';
        return (
          <li key={i} className={cls}>
            <span className="cp-qopt__badge">{String.fromCharCode(65 + i)}</span>
            <span style={{ flex: 1 }}><RichText text={opt} /></span>
            {isChosen && <span className="cp-qopt__tag">Your answer</span>}
            {isCorrect && <span className="cp-qopt__tag">Correct</span>}
          </li>
        );
      })}
    </ul>
  );
}

/** The question that was asked, with your answer and the correct one. */
export function QuestionRecap({
  mc,
  mcAnswer,
  mcCorrect,
  label = 'Question',
  showWhy = false,
  collapsedOptions = false,
}: {
  mc: MCQuestion;
  mcAnswer: Answer;
  mcCorrect: boolean;
  label?: string;
  showWhy?: boolean;
  collapsedOptions?: boolean;
}): React.ReactElement {
  const status =
    mcAnswer === null ? 'Not answered' : mcCorrect ? '✓ You answered this correctly' : '✗ Your answer was incorrect';
  return (
    <div className="cp-qcard">
      <p className="cp-qcard__label">{label}</p>
      <div className="cp-qcard__text"><RichText text={mc.question} /></div>
      {collapsedOptions ? (
        <details className="cp-qcard__details">
          <summary>Show the options</summary>
          <OptionsList mc={mc} mcAnswer={mcAnswer} />
        </details>
      ) : (
        <OptionsList mc={mc} mcAnswer={mcAnswer} />
      )}
      <p className={'cp-qcard__status ' + (mcCorrect ? 'cp-qcard__status--good' : 'cp-qcard__status--bad')}>{status}</p>
      {showWhy && mc.why && (
        <p className="cx-small" style={{ margin: '0.35rem 0 0' }}>
          <strong>Why:</strong> <RichText text={mc.why} />
        </p>
      )}
    </div>
  );
}

/** All the questions answered in a round, one recap card each. */
export function QuestionSetRecap({
  attempts,
  label = 'Your questions',
  showWhy = false,
  collapsed = false,
}: {
  attempts: QuestionAttempt[];
  label?: string;
  showWhy?: boolean;
  collapsed?: boolean;
}): React.ReactElement {
  const right = attempts.filter((a) => a.correct).length;
  const body = attempts.map((a, i) => (
    <QuestionRecap
      key={i}
      mc={a.mc}
      mcAnswer={a.answer}
      mcCorrect={a.correct}
      label={attempts.length > 1 ? label + ' ' + (i + 1) + ' of ' + attempts.length : label}
      showWhy={showWhy}
      collapsedOptions={collapsed}
    />
  ));
  if (!collapsed) return <>{body}</>;
  return (
    <details className="cp-qset-recap">
      <summary>
        {label} - {right}/{attempts.length} correct
      </summary>
      {body}
    </details>
  );
}

/** Improvement suggestions and a model answer. */
export function CoachingBlocks({ explanation }: { explanation: ExplanationGrade }): React.ReactElement | null {
  const improvements = explanation.improvements ?? [];
  const better = explanation.better_answer ?? '';
  if (improvements.length === 0 && !better) return null;
  return (
    <>
      {improvements.length > 0 && (
        <div className="cp-improve">
          <p className="cp-improve__title">
            <Lightbulb size={14} aria-hidden="true" /> How to improve this answer
          </p>
          <ol>
            {improvements.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      )}
      {better && (
        <div className="cp-model">
          <p className="cp-section__title">A stronger answer (try saying it like this)</p>
          <p style={{ margin: 0 }}>{better}</p>
        </div>
      )}
    </>
  );
}

function RoundReview({ r, index }: { r: RoundResult; index: number }): React.ReactElement {
  const e = r.explanation;
  const attempts = roundQuestions(r);
  const right = attempts.filter((a) => a.correct).length;
  const allRight = right === attempts.length;
  return (
    <details className="cp-review">
      <summary className="cp-review__sum">
        <span className="cp-review__title">
          {index + 1}. {r.conceptTitle}
        </span>
        {r.difficulty && <span className={'cp-diff cp-diff--' + r.difficulty}>{r.difficulty}</span>}
        <span className={'cp-review__chip ' + (allRight ? 'cp-review__chip--good' : 'cp-review__chip--bad')}>
          {attempts.length === 1 ? (allRight ? 'Question ✓' : 'Question ✗') : 'Questions ' + right + '/' + attempts.length}
        </span>
        <span className="cp-review__chip">{e ? e.score + '/5' : 'Skipped'}</span>
      </summary>
      <div className="cp-review__body">
        <QuestionSetRecap attempts={attempts} label="Question" showWhy />
        {e ? (
          <>
            {e.one_line_feedback && <p className="cx-lead">{e.one_line_feedback}</p>}
            {e.transcript && (
              <div className="cp-section">
                <p className="cp-section__title">What you said</p>
                <blockquote className="cx-callout" style={{ margin: 0 }}>
                  {e.transcript}
                </blockquote>
              </div>
            )}
            <CoachingBlocks explanation={e} />
            {(e.missing ?? []).length > 0 && (
              <div className="cp-section">
                <p className="cp-section__title" style={{ color: 'var(--warn)' }}>Missing</p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {(e.missing ?? []).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {(e.errors ?? []).length > 0 && (
              <div className="cp-section">
                <p className="cp-section__title" style={{ color: 'var(--bad)' }}>Errors</p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {(e.errors ?? []).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="cx-small cx-muted">You skipped the speaking part of this round.</p>
        )}
      </div>
    </details>
  );
}

/** Every round of a session: question, your answer, what you said, and the feedback. */
export function RoundReviewList({
  history,
  heading = true,
}: {
  history: RoundResult[];
  heading?: boolean;
}): React.ReactElement | null {
  if (history.length === 0) return null;
  return (
    <section className="cp-reviews">
      {heading && (
        <>
          <h3 className="cx-h2" style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>
            Round-by-round review
          </h3>
          <p className="cx-small cx-muted" style={{ marginTop: 0 }}>
            Open a round to see the question, your answer, what you said and how to improve.
          </p>
        </>
      )}
      {history.map((r, i) => (
        <RoundReview key={r.conceptId + i} r={r} index={i} />
      ))}
    </section>
  );
}

/** Saved sessions from earlier practice, newest first. */
export function PastSessions(): React.ReactElement | null {
  const sessions = loadProgress()
    .sessions.filter((s) => Array.isArray(s.results) && s.results.length > 0)
    .slice(-10)
    .reverse();
  if (sessions.length === 0) return null;
  return (
    <section className="cp-past">
      <h2 className="cx-h2" style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>
        Past sessions
      </h2>
      <p className="cx-small cx-muted" style={{ marginTop: 0 }}>
        Your questions, answers and feedback are saved on this device.
      </p>
      {sessions.map((s) => {
        const n = s.results.length;
        const all = s.results.flatMap(roundQuestions);
        const mc = all.filter((a) => a.correct).length;
        const avg = (s.results.reduce((a, r) => a + (r.explanation?.score ?? 0), 0) / n).toFixed(1);
        return (
          <details key={s.date} className="cp-past__item">
            <summary className="cp-past__sum">
              <span className="cp-review__title">{new Date(s.date).toLocaleString()}</span>
              <span className="cp-review__chip">{n} {n === 1 ? 'round' : 'rounds'}</span>
              <span className="cp-review__chip">Questions {mc}/{all.length}</span>
              <span className="cp-review__chip">Avg {avg}/5</span>
            </summary>
            <RoundReviewList history={s.results} heading={false} />
          </details>
        );
      })}
    </section>
  );
}
