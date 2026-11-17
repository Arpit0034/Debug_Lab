import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ConceptDetail, ConceptMeta } from '../cheatsheet/types';
import { CONCEPT_METAS, loadConceptDetail } from '../cheatsheet/data';
import { AudioRecorder, type RecordedAudio } from './audio';
import { generateMcBatch, gradeExplanation, askAiTutor } from './gemini';
import {
  GeminiError,
  loadAnyKey,
  loadApiKey,
  loadGroqKey,
  maskKey,
  saveApiKey,
  saveGroqKey,
  validateApiKey,
  validateGroqKey,
} from './apiKey';
import {
  DEFAULT_PREFS,
  loadPrefs,
  pickWeakestConcept,
  recentQuestionsFor,
  recordRound,
  savePrefs,
  sessionsLeftToday,
  tryStartSession,
  upsertSession,
} from './storage';
import type {
  AnswerIndex,
  Difficulty,
  ErrorCard,
  ExplanationGrade,
  MCQuestion,
  Phase,
  QuestionAttempt,
  RoundResult,
} from './types';
import {
  ApiKeyPanel,
  ErrorPanel,
  McSetPanel,
  QUESTIONS_PER_SET,
  RecordingPanel,
  ReportPanel,
  ResultPanel,
  SessionSetupPanel,
  TutorPanel,
} from './panels';
import { PastSessions, QuestionSetRecap } from './reviews';
import { StagedProgress, UsageBar } from './progressUi';
import { resetUsage } from './usage';
import { loadOpenRouterKey, saveOpenRouterKey, validateOpenRouterKey } from '../../services/ai/openrouter';
import './practice.css';
import '../cheatsheet/concepts.css';

const MAX_RECORD_SECONDS = 90;

/** Everything one round needs, generated ahead of time. */
interface Prepared {
  detail: ConceptDetail;
  questions: MCQuestion[];
}

/** One practice session: the concepts are chosen up front and their questions are generated in the background. */
interface Run {
  plan: ConceptMeta[];
  difficulty: Difficulty;
  jobs: Map<number, Promise<Prepared>>;
  resolved: Map<number, Prepared>;
  cancelled: boolean;
  onReady: () => void;
}

/** Pick every concept of the session now (focus concept first), never repeating one. */
function planConcepts(focusId: string | null, rounds: number): ConceptMeta[] {
  const ids = CONCEPT_METAS.map((m) => m.id);
  const used = new Set<string>();
  const plan: ConceptMeta[] = [];
  while (plan.length < rounds) {
    const id =
      plan.length === 0 && focusId && ids.includes(focusId)
        ? focusId
        : pickWeakestConcept(ids, used);
    const meta = id ? CONCEPT_METAS.find((m) => m.id === id) : undefined;
    if (!meta) break;
    used.add(meta.id);
    plan.push(meta);
  }
  return plan;
}

function prepareRound(run: Run, idx: number): Promise<Prepared> {
  const meta = run.plan[idx];
  const p = (async (): Promise<Prepared> => {
    if (run.cancelled) throw new Error('Session ended');
    const detail = await loadConceptDetail(meta.id);
    if (!detail) throw new Error('Concept ' + meta.id + ' not found');
    const questions = await generateMcBatch(meta, detail, {
      difficulty: run.difficulty,
      count: QUESTIONS_PER_SET,
      avoid: recentQuestionsFor(meta.id),
    });
    const prepared = { detail, questions };
    if (!run.cancelled) {
      run.resolved.set(idx, prepared);
      run.onReady();
    }
    return prepared;
  })();
  p.catch(() => {}); // failures are handled when that round is actually needed
  return p;
}

/** Rounds are generated one after another (not all at once) to stay inside free-tier rate limits. */
function createRun(plan: ConceptMeta[], difficulty: Difficulty, onReady: () => void): Run {
  const run: Run = { plan, difficulty, jobs: new Map(), resolved: new Map(), cancelled: false, onReady };
  let chain: Promise<unknown> = Promise.resolve();
  plan.forEach((_, i) => {
    const job = chain.then(() => prepareRound(run, i));
    run.jobs.set(i, job);
    chain = job.catch(() => undefined);
  });
  return run;
}

function parseDifficulty(v: string | null): Difficulty | null {
  return v === 'easy' || v === 'medium' || v === 'hard' ? v : null;
}

export function ConceptsPracticePage(): React.ReactElement {
  const [phase, setPhase] = useState<Phase>(() =>
    loadAnyKey() ? 'setup' : 'api-key-setup',
  );

  // The Groq key unlocks the page (questions). The Gemini key is only for voice grading.
  const [storedKey, setStoredKey] = useState<string | null>(() => loadAnyKey());
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(() => loadApiKey() !== null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [orKeyInput, setOrKeyInput] = useState('');
  const [apiKeySaving, setApiKeySaving] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const [params] = useSearchParams();
  const [prefs] = useState(() => loadPrefs());
  const [difficulty, setDifficulty] = useState<Difficulty>(
    () => parseDifficulty(params.get('d')) ?? prefs.difficulty,
  );
  const [perRound, setPerRound] = useState<1 | 2 | 3>(prefs.perRound);
  const [focusId, setFocusId] = useState<string | null>(() => {
    const c = params.get('c');
    return c && CONCEPT_METAS.some((m) => m.id === c) ? c : null;
  });
  const [targetRounds, setTargetRounds] = useState(prefs.rounds || DEFAULT_PREFS.rounds);
  const [roundIndex, setRoundIndex] = useState(0);
  const [sessionsLeft, setSessionsLeft] = useState(() => sessionsLeftToday());
  const [currentMeta, setCurrentMeta] = useState<ConceptMeta | null>(null);
  const [currentDetail, setCurrentDetail] = useState<ConceptDetail | null>(null);
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [answers, setAnswers] = useState<(AnswerIndex | null)[]>([]);
  const [currentAudio, setCurrentAudio] = useState<RecordedAudio | null>(null);
  const [explanation, setExplanation] = useState<ExplanationGrade | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [recordTimer, setRecordTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [errorCard, setErrorCard] = useState<ErrorCard | null>(null);
  const [tutorResponse, setTutorResponse] = useState<string | null>(null);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [readyCount, setReadyCount] = useState(0);
  const [plannedRounds, setPlannedRounds] = useState(0);

  const runRef = useRef<Run | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const stopRecordingRef = useRef<(() => void) | null>(null);
  const sessionStartRef = useRef<string>(new Date().toISOString());
  // Latest recording, readable from Retry even if React state is stale
  const currentAudioRef = useRef<RecordedAudio | null>(null);

  const audioSupported = AudioRecorder.isSupported();
  const autoStartedRef = useRef(false);

  useEffect(() => {
    savePrefs({ difficulty, perRound, rounds: targetRounds });
  }, [difficulty, perRound, targetRounds]);

  const required = Math.min(perRound, questions.length || QUESTIONS_PER_SET);
  const answeredCount = answers.filter((a) => a !== null).length;
  const canContinue = answeredCount >= required;

  /** Only the questions the user answered become part of the round. */
  const attempts = useMemo<QuestionAttempt[]>(
    () =>
      questions
        .map((mc, i) => ({ mc, answer: answers[i] ?? null, correct: answers[i] === mc.correct_index }))
        .filter((a) => a.answer !== null),
    [questions, answers],
  );
  const anyWrong = attempts.some((a) => !a.correct);
  // Help links and the tutor name the concept, so wait until every question is answered.
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  useEffect(() => {
    return () => {
      if (runRef.current) runRef.current.cancelled = true;
      recorderRef.current?.abort();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const handleError = useCallback((err: unknown, retryFn?: () => void) => {
    let message: string;
    let retryable = true;
    let statusCode: number | undefined;
    let kind: string | undefined;

    if (err instanceof GeminiError) {
      message = err.userMessage;
      retryable = err.retryable;
      statusCode = err.statusCode;
      kind = err.kind;
    } else if (err instanceof Error) {
      message = err.message;
    } else {
      message = String(err);
    }

    setErrorCard({
      message,
      retryable: retryable && !!retryFn,
      statusCode,
      kind,
      onRetry: retryFn,
    });
    setPhase('error');
  }, []);

  const startRound = useCallback(
    async (currentHistory: RoundResult[]) => {
      setErrorCard(null);
      setQuestions([]);
      setAnswers([]);
      setCurrentAudio(null);
      currentAudioRef.current = null;
      setExplanation(null);
      setTutorResponse(null);

      const idx = currentHistory.length;
      const run = runRef.current;
      const meta = run?.plan[idx];
      if (!run || !meta) {
        setPhase('report');
        return;
      }
      setCurrentMeta(meta);

      const apply = (p: Prepared) => {
        setCurrentDetail(p.detail);
        setQuestions(p.questions);
        setAnswers(p.questions.map(() => null));
        setPhase('answering-mc');
      };

      // Prefetched in the background: show it instantly, no loading screen.
      const ready = run.resolved.get(idx);
      if (ready) {
        apply(ready);
        return;
      }

      setPhase('loading-mc');
      try {
        const job = run.jobs.get(idx);
        if (!job) throw new Error('This round was not prepared.');
        const p = await job;
        if (runRef.current !== run) return; // session was reset meanwhile
        apply(p);
      } catch (err) {
        if (runRef.current !== run) return;
        handleError(err, () => {
          run.jobs.set(idx, prepareRound(run, idx)); // fresh attempt for just this round
          void startRound(currentHistory);
        });
      }
    },
    [handleError],
  );

  const startSession = useCallback(() => {
    if (!tryStartSession()) {
      setSessionsLeft(0);
      return;
    }
    setSessionsLeft(sessionsLeftToday());
    if (runRef.current) runRef.current.cancelled = true;
    resetUsage();
    sessionStartRef.current = new Date().toISOString();
    const plan = planConcepts(focusId, targetRounds);
    runRef.current = createRun(plan, difficulty, () => setReadyCount((c) => c + 1));
    setReadyCount(0);
    setPlannedRounds(plan.length);
    setHistory([]);
    setRoundIndex(0);
    void startRound([]);
  }, [startRound, focusId, targetRounds, difficulty]);

  // Quick-start links from the Concepts hub (?go=1) skip the setup screen.
  useEffect(() => {
    if (autoStartedRef.current) return;
    if (params.get('go') !== '1') return;
    autoStartedRef.current = true;
    if (phase === 'setup' && storedKey && audioSupported) startSession();
  }, [params, phase, storedKey, audioSupported, startSession]);

  const answerQuestion = useCallback((qi: number, idx: AnswerIndex) => {
    setAnswers((prev) => {
      if (prev[qi] !== null && prev[qi] !== undefined) return prev; // locked once answered
      const next = prev.slice();
      next[qi] = idx;
      return next;
    });
  }, []);

  const retryGrade = useCallback(async () => {
    const audio = currentAudioRef.current;
    if (!currentMeta || !currentDetail || !audio) {
      handleError(new Error('Cannot retry: original audio is gone.'));
      return;
    }
    setPhase('grading');
    setErrorCard(null);
    try {
      const grade = await gradeExplanation(
        currentMeta,
        currentDetail,
        audio.base64,
        audio.mimeType,
      );
      setExplanation(grade);
      setPhase('result');
    } catch (err) {
      handleError(err, () => void retryGrade());
    }
  }, [currentMeta, currentDetail, handleError]);

  const handleAskTutor = useCallback(async (type: 'simple' | 'analogy' | 'code') => {
    if (!currentMeta) return;
    setTutorLoading(true);
    setTutorResponse(null);
    try {
      const res = await askAiTutor(currentMeta, type);
      setTutorResponse(res);
    } catch (err) {
      handleError(err, () => void handleAskTutor(type));
    } finally {
      setTutorLoading(false);
    }
  }, [currentMeta, handleError]);

  const beginRecording = useCallback(async () => {
    const rec = new AudioRecorder();
    try {
      await rec.start();
      recorderRef.current = rec;
      setIsRecording(true);
      setRecordTimer(0);
      timerRef.current = window.setInterval(() => {
        setRecordTimer((t) => {
          if (t + 1 >= MAX_RECORD_SECONDS) {
            if (timerRef.current) window.clearInterval(timerRef.current);
            timerRef.current = null;
            stopRecordingRef.current?.();
            return MAX_RECORD_SECONDS;
          }
          return t + 1;
        });
      }, 1000);
    } catch (err) {
      handleError(err, () => setPhase('recording'));
    }
  }, [handleError]);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (!rec) return;
    try {
      const audio = await rec.stop();
      setCurrentAudio(audio);
      currentAudioRef.current = audio;
      setPhase('grading');
      if (!currentMeta || !currentDetail)
        throw new Error('Concept data missing');
      const grade = await gradeExplanation(
        currentMeta,
        currentDetail,
        audio.base64,
        audio.mimeType,
      );
      setExplanation(grade);
      setPhase('result');
    } catch (err) {
      handleError(err, () => void retryGrade());
    }
  }, [currentMeta, currentDetail, handleError, retryGrade]);

  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  const buildResult = useCallback(
    (grade: ExplanationGrade | null): RoundResult | null => {
      if (!currentMeta || attempts.length === 0) return null;
      const first = attempts[0];
      return {
        conceptId: currentMeta.id,
        conceptTitle: currentMeta.title,
        mc: first.mc,
        mcAnswer: first.answer,
        mcCorrect: attempts.every((a) => a.correct),
        questions: attempts,
        difficulty,
        explanation: grade,
        timestamp: new Date().toISOString(),
      };
    },
    [currentMeta, attempts, difficulty],
  );

  const commitRound = useCallback(
    (grade: ExplanationGrade | null) => {
      const result = buildResult(grade);
      if (!result) return;
      const next = [...history, result];
      setHistory(next);
      recordRound(result.conceptId, grade?.score ?? 0); // a skipped explanation scores 0
      upsertSession(sessionStartRef.current, next);
      setRoundIndex((r) => r + 1);
      if (next.length >= targetRounds) {
        setPhase('report');
      } else {
        void startRound(next);
      }
    },
    [buildResult, history, targetRounds, startRound],
  );

  const skipRound = useCallback(() => {
    // Stop any live recording so the mic is released before moving on.
    recorderRef.current?.abort();
    recorderRef.current = null;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    commitRound(null);
  }, [commitRound]);
  const finishRound = useCallback(() => {
    if (explanation) commitRound(explanation);
  }, [commitRound, explanation]);

  const handleApiKeySubmit = useCallback(async () => {
    setApiKeySaving(true);
    setApiKeyError(null);
    try {
      // Groq (questions) is required. Typing a new key replaces the saved one; empty reuses it.
      const groq = groqKeyInput.trim() || loadGroqKey() || '';
      await validateGroqKey(groq);
      saveGroqKey(groq);
      setStoredKey(groq);

      // Gemini (voice) is optional here. Only validate it when a new one was typed.
      const gem = apiKeyInput.trim();
      if (gem) {
        await validateApiKey(gem);
        saveApiKey(gem);
        setHasGeminiKey(true);
      }

      // OpenRouter (free Nemotron backup) is optional. Only validate when a new one was typed.
      const orKey = orKeyInput.trim();
      if (orKey) {
        await validateOpenRouterKey(orKey);
        saveOpenRouterKey(orKey);
      }

      setApiKeyInput('');
      setGroqKeyInput('');
      setOrKeyInput('');

      const retry = errorCard?.onRetry;
      if (retry) {
        setErrorCard(null);
        retry();
        return;
      }
      setPhase('setup');
    } catch (err) {
      if (err instanceof GeminiError) setApiKeyError(err.userMessage);
      else setApiKeyError(err instanceof Error ? err.message : String(err));
    } finally {
      setApiKeySaving(false);
    }
  }, [apiKeyInput, groqKeyInput, orKeyInput, errorCard]);

  const onChangeKey = useCallback(() => {
    setApiKeyInput('');
    setGroqKeyInput('');
    setApiKeyError(null);
    setPhase('api-key-setup');
  }, []);

  const resetSession = useCallback(() => {
    if (runRef.current) runRef.current.cancelled = true;
    runRef.current = null;
    setPlannedRounds(0);
    setHistory([]);
    setRoundIndex(0);
    setCurrentMeta(null);
    setCurrentDetail(null);
    setQuestions([]);
    setAnswers([]);
    setExplanation(null);
    setCurrentAudio(null);
    currentAudioRef.current = null;
    setErrorCard(null);
    setIsRecording(false);
    setPhase('setup');
  }, []);

  const progressPct = useMemo(
    () => Math.round((roundIndex / targetRounds) * 100),
    [roundIndex, targetRounds],
  );

  const inSession = phase !== 'setup' && phase !== 'api-key-setup';

  const showProgress =
    phase !== 'setup' &&
    phase !== 'api-key-setup' &&
    phase !== 'report' &&
    phase !== 'error';

  return (
    <div className="cx-root cp-root">
      <div className="cx-container" style={{ maxWidth: '52rem' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
          <Link
            to="/concepts"
            className="cx-btn cx-btn--sm cx-btn--ghost"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft size={14} /> Concepts
          </Link>
        </nav>

        <header style={{ marginBottom: '1.5rem' }}>
          <h1 className="cx-h1" style={{ fontSize: '1.75rem' }}>
            Speaking Practice
          </h1>
          <p className="cx-lead" style={{ marginTop: '0.35rem' }}>
            Answer a set of recognition questions, then explain the concept out
            loud. Each session trains both recall and speaking fluency.
          </p>
        </header>

        {inSession && <UsageBar ready={readyCount} total={plannedRounds} />}

        {showProgress && (
          <>
            <div className="cp-progress">
              <div
                className="cp-progress__bar"
                style={{ width: progressPct + '%' }}
              />
            </div>
            <p className="cx-small cx-muted" style={{ marginBottom: '1rem' }}>
              Round {Math.min(roundIndex + 1, targetRounds)} of {targetRounds}
              {/* The concept name is also the answer, so keep it hidden until the questions are done. */}
              {currentMeta && phase !== 'loading-mc' && phase !== 'answering-mc'
                ? ' - ' + currentMeta.title
                : ''}{' '}
              - {difficulty}
            </p>
          </>
        )}

        {phase === 'api-key-setup' && (
          <ApiKeyPanel
            input={apiKeyInput}
            groqInput={groqKeyInput}
            error={apiKeyError}
            saving={apiKeySaving}
            hasSavedGroq={loadGroqKey() !== null}
            hasSavedGemini={hasGeminiKey}
            onChange={setApiKeyInput}
            onGroqChange={setGroqKeyInput}
            orInput={orKeyInput}
            onOrChange={setOrKeyInput}
            hasSavedOr={loadOpenRouterKey() !== null}
            onSubmit={handleApiKeySubmit}
          />
        )}

        {phase === 'setup' && storedKey && (
          <SessionSetupPanel
            keyPrefix={maskKey(storedKey)}
            targetRounds={targetRounds}
            onRoundsChange={setTargetRounds}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            perRound={perRound}
            onPerRoundChange={setPerRound}
            focusTitle={
              focusId ? (CONCEPT_METAS.find((m) => m.id === focusId)?.title ?? null) : null
            }
            onClearFocus={() => setFocusId(null)}
            onStart={startSession}
            onChangeKey={onChangeKey}
            audioSupported={audioSupported}
            resumable={false}
            hasGeminiKey={hasGeminiKey}
            sessionsLeft={sessionsLeft}
          />
        )}

        {phase === 'setup' && storedKey && <PastSessions />}

        {phase === 'loading-mc' && (
          <StagedProgress
            stages={['Loading concept notes', 'Writing ' + QUESTIONS_PER_SET + ' ' + difficulty + ' questions', 'Checking and shuffling options']}
            expectedMs={5000}
          />
        )}

        {phase === 'answering-mc' && questions.length > 0 && currentMeta && (
          <>
            <McSetPanel
              questions={questions}
              answers={answers}
              required={required}
              difficulty={difficulty}
              onAnswer={answerQuestion}
            />
            <div
              className="cp-setbar"
            >
              <span className="cx-small cx-muted">
                {answeredCount} of {questions.length} answered
                {canContinue ? '' : ' - need ' + required}
              </span>
              <div className="cx-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                {anyWrong && allAnswered && (
                  <Link
                    to={`/concepts?c=${currentMeta.id}`}
                    target="_blank"
                    className="cx-btn cx-btn--ghost"
                  >
                    Read full concept ↗
                  </Link>
                )}
                {canContinue && (
                  <button type="button" className="cx-btn cx-btn--ghost" onClick={skipRound}>
                    {anyWrong ? 'Skip concept' : 'Skip voice, next concept'}
                  </button>
                )}
                <button
                  type="button"
                  className="cx-btn cx-btn--primary"
                  disabled={!canContinue}
                  onClick={() => setPhase('recording')}
                >
                  {anyWrong ? 'Try to explain anyway →' : 'Explain from memory →'}
                </button>
              </div>
            </div>

            {anyWrong && allAnswered && (
              <TutorPanel
                onAsk={handleAskTutor}
                loading={tutorLoading}
                response={tutorResponse}
              />
            )}
          </>
        )}

        {phase === 'recording' && attempts.length > 0 && (
          <QuestionSetRecap attempts={attempts} label="Your questions" collapsed />
        )}

        {phase === 'recording' && (
          <RecordingPanel
            isRecording={isRecording}
            timer={recordTimer}
            maxSeconds={MAX_RECORD_SECONDS}
            onStart={beginRecording}
            onStop={stopRecording}
          />
        )}

        {phase === 'recording' && (
          <div className="cx-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <button type="button" className="cx-btn cx-btn--ghost" onClick={skipRound}>
              {roundIndex + 1 >= targetRounds ? 'Skip voice, see report' : 'Skip voice, next concept'} &rarr;
            </button>
          </div>
        )}

        {phase === 'grading' && (
          <StagedProgress
            stages={['Preparing audio', 'Uploading to Gemini', 'Transcribing your speech', 'Grading against the reference']}
            expectedMs={5000 + (currentAudio?.durationMs ?? 30000) * 0.25}
          />
        )}

        {phase === 'result' && explanation && currentMeta && attempts.length > 0 && (
          <>
            <ResultPanel
              explanation={explanation}
              conceptTitle={currentMeta.title}
              attempts={attempts}
            />
            <div
              className="cx-row"
              style={{
                justifyContent: 'flex-end',
                gap: '0.5rem',
                marginTop: '1.5rem',
              }}
            >
              <button
                type="button"
                className="cx-btn cx-btn--primary"
                onClick={finishRound}
              >
                {roundIndex + 1 >= targetRounds
                  ? 'See report'
                  : 'Next concept'}{' '}
                &rarr;
              </button>
            </div>
          </>
        )}

        {phase === 'report' && (
          <ReportPanel
            history={history}
            targetRounds={targetRounds}
            onReset={resetSession}
          />
        )}

        {phase === 'error' && errorCard && (
          <ErrorPanel card={errorCard} onUpdateKey={onChangeKey} onSkip={attempts.length > 0 ? skipRound : undefined} />
        )}
      </div>
    </div>
  );
}
