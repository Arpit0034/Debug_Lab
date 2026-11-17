import type { ConceptDetail, ConceptMeta } from '../cheatsheet/types';
import { CONCEPT_METAS, loadConceptDetail } from '../cheatsheet/data';
import type { Difficulty, ExplanationGrade, MCQuestion } from './types';
import { GeminiError, loadApiKey, loadGroqKey } from './apiKey';
import { recordUsage, recordGroqLimits } from './usage';
import { askNemotron, loadOpenRouterKey, OpenRouterError } from '../../services/ai/openrouter';


const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-3.5-flash',
  'gemini-2.5-pro',
];

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number };
}

function getKeyOrThrow(): string {
  const key = loadApiKey();
  if (!key) {
    throw new GeminiError(
      'missing-key',
      'Voice grading needs a Gemini API key. Open the setup screen and add one.',
    );
  }
  return key;
}


/** Groq models. 120b writes and checks questions (accuracy matters); 20b is enough for the short tutor replies. */
const GROQ_QUESTION_MODEL = 'openai/gpt-oss-120b';
const GROQ_TUTOR_MODEL = 'openai/gpt-oss-20b';
/** Tried in order when a model hits its rate limit. Groq counts limits per model, so another model still works. */
const GROQ_FALLBACK_MODELS = ['llama-3.3-70b-versatile', 'openai/gpt-oss-20b', 'llama-3.1-8b-instant'];

/** Text generation (questions, tutor). Groq only: Gemini is kept for voice grading. */
async function callGroqOnce(
  prompt: string,
  jsonMode: boolean,
  temperature = 0.85,
  model: string = GROQ_QUESTION_MODEL,
  reasoningEffort: 'low' | 'medium' = 'low',
): Promise<string> {
  const key = loadGroqKey();
  if (!key) {
    throw new GeminiError(
      'missing-key',
      'Question generation needs a Groq API key. Open the setup screen and add one.',
    );
  }

  let res: Response;
  try {
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        ...(model.startsWith('openai/gpt-oss') ? { reasoning_effort: reasoningEffort } : {}), // low = faster, fewer reasoning tokens
        messages: [{ role: 'user', content: prompt }],
        temperature,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      }),
    });
  } catch (err) {
    throw new GeminiError(
      'network',
      'Could not reach Groq. Check your internet connection and retry.',
      { cause: err },
    );
  }

  recordGroqLimits(res.headers); // real remaining quota, straight from Groq
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new GeminiError(
        'invalid-key',
        'Your Groq key was rejected (expired or revoked). Update your key to continue.',
        { statusCode: res.status },
      );
    }
    if (res.status === 429) {
      let wait = Number(res.headers.get('retry-after'));
      if (!Number.isFinite(wait) || wait <= 0) {
        // e.g. "7.5s" or "2m59.5s"
        const raw = res.headers.get('x-ratelimit-reset-tokens') ?? res.headers.get('x-ratelimit-reset-requests') ?? '';
        const m = raw.match(/^(?:(\d+)m)?(?:([\d.]+)s)?$/);
        wait = m ? Number(m[1] ?? 0) * 60 + Number(m[2] ?? 0) : 0;
      }
      throw new GeminiError(
        'quota',
        Number.isFinite(wait) && wait > 0
          ? 'Groq limit reached. Wait ' + Math.ceil(wait) + 's, then retry.'
          : 'Groq limit reached. Wait about a minute, then retry.',
        { statusCode: 429 },
      );
    }
    if (res.status >= 500) {
      throw new GeminiError('server', 'Groq had a server error. Retry in a moment.', { statusCode: res.status });
    }
    let detail = '';
    try {
      const j = (await res.json()) as { error?: { message?: string } };
      detail = j.error?.message ? ' ' + j.error.message : '';
    } catch {
      /* body was not JSON */
    }
    throw new GeminiError('unknown', 'Groq returned status ' + res.status + '.' + detail, { statusCode: res.status });
  }

  let data: {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };
  try {
    data = await res.json();
  } catch (err) {
    throw new GeminiError('parse', 'Groq returned an unreadable response. Retry.', { cause: err });
  }
  const u = data.usage;
  if (u) recordUsage('groq', u.prompt_tokens ?? 0, u.completion_tokens ?? 0, u.total_tokens);
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new GeminiError('parse', 'Groq returned an empty response. Retry.');
  return text;
}

/** Backup writer: free Nemotron through OpenRouter. Only used when Groq cannot answer and an OpenRouter key is saved. */
async function callNemotronFallback(prompt: string, jsonMode: boolean): Promise<string> {
  try {
    const text = await askNemotron(
      [
        {
          role: 'system',
          content: jsonMode
            ? 'Reply with exactly one valid JSON object and nothing else. No markdown fences, no commentary.'
            : 'Answer clearly and briefly.',
        },
        { role: 'user', content: prompt },
      ],
      6000,
    );
    if (!jsonMode) return text;
    const a = text.indexOf('{');
    const b = text.lastIndexOf('}');
    return a >= 0 && b > a ? text.slice(a, b + 1) : text;
  } catch (err) {
    if (err instanceof OpenRouterError) {
      const kind = err.kind === 'invalid-key' ? 'invalid-key' : err.kind;
      throw new GeminiError(kind, 'OpenRouter: ' + err.userMessage, { statusCode: err.statusCode });
    }
    throw err;
  }
}

/** Models Groq said do not exist (404) or are not allowed for this key. Skipped for the rest of the page session. */
const unavailableGroqModels = new Set<string>();

/** Calls the wanted model; on a 429 (rate limit) quietly tries the other Groq models before giving up. */
async function callGroq(
  prompt: string,
  jsonMode: boolean,
  temperature = 0.85,
  model: string = GROQ_QUESTION_MODEL,
  reasoningEffort: 'low' | 'medium' = 'low',
): Promise<string> {
  const models = [model, ...GROQ_FALLBACK_MODELS.filter((m) => m !== model)];
  let shortestWait: GeminiError | null = null;
  const waitOf = (e: GeminiError): number => {
    const m = e.userMessage.match(/Wait (\d+)s/);
    return m ? Number(m[1]) : 60;
  };
  let lastErr: unknown = null;
  for (const m of models) {
    if (unavailableGroqModels.has(m)) continue;
    try {
      return await callGroqOnce(prompt, jsonMode, temperature, m, reasoningEffort);
    } catch (err) {
      lastErr = err;
      if (err instanceof GeminiError && (err.statusCode === 404 || err.statusCode === 400)) {
        unavailableGroqModels.add(m); // wrong / retired / not enabled model name: try the next one
        continue;
      }
      if (err instanceof GeminiError && err.kind === 'quota') {
        if (!shortestWait || waitOf(err) < waitOf(shortestWait)) shortestWait = err;
        continue; // this model is rate limited: try the next one
      }
      if (err instanceof GeminiError && err.kind === 'server') continue; // Groq hiccup: try the next one
      throw err;
    }
  }
  const groqFailure = shortestWait ?? lastErr ?? new GeminiError('unknown', 'No Groq model is available for this key.');
  // Last resort: free Nemotron on OpenRouter, if the user saved a key for it.
  if (loadOpenRouterKey()) {
    try {
      return await callNemotronFallback(prompt, jsonMode);
    } catch (orErr) {
      // A 404 from OpenRouter has an actionable message (privacy setting), so show that one.
      if (orErr instanceof GeminiError && orErr.statusCode === 404) throw orErr;
    }
  }
  throw groqFailure;
}

async function callGemini(body: unknown): Promise<string> {
  const key = getKeyOrThrow();
  let lastError: unknown = null;

  for (const model of MODELS) {
    let res: Response;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
    } catch (err) {
      throw new GeminiError(
        'network',
        'Could not reach Gemini. Check your internet connection and retry.',
        { cause: err }
      );
    }

    // If model not found, try the next one silently
    if (res.status === 404) {
      continue;
    }

    if (!res.ok) {
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        throw new GeminiError(
          'invalid-key',
          'Your Gemini key was rejected (expired or revoked). Update your key to continue.',
          { statusCode: res.status }
        );
      }
      if (res.status === 429) {
        let waitSeconds: number | null = null;
        try {
          const j = (await res.clone().json()) as {
            error?: { details?: Array<Record<string, unknown>> };
          };
          const retry = j.error?.details?.find(
            (d) =>
              typeof d['@type'] === 'string' &&
              (d['@type'] as string).includes('RetryInfo')
          );
          const delay = retry?.retryDelay;
          if (typeof delay === 'string') {
            const m = delay.match(/^(\d+)/);
            if (m) waitSeconds = Number(m[1]);
          }
        } catch {
          /* ignore */
        }
        throw new GeminiError(
          'quota',
          waitSeconds
            ? 'Quota exceeded. Wait ' + waitSeconds + 's, then retry - or update your key.'
            : 'Quota exceeded. Wait about a minute, then retry - or update your key.',
          { statusCode: 429 }
        );
      }
      if (res.status >= 500) {
        throw new GeminiError(
          'server',
          'Gemini had a server error. Retry in a moment.',
          { statusCode: res.status }
        );
      }
      
      lastError = new GeminiError(
        'unknown',
        'Gemini returned status ' + res.status + ' for model ' + model + '.',
        { statusCode: res.status }
      );
      continue; // Try next model on other errors
    }

    let json: GeminiResponse;
    try {
      json = (await res.json()) as GeminiResponse;
    } catch (err) {
      throw new GeminiError(
        'parse',
        'Gemini returned an unreadable response. Retry.',
        { cause: err }
      );
    }

    // Tokens are spent even if the text is empty, so count them first.
    // Gemini's total includes hidden "thinking" tokens, so output = total - input.
    const um = json.usageMetadata;
    if (um) {
      const input = um.promptTokenCount ?? 0;
      const total = um.totalTokenCount ?? input + (um.candidatesTokenCount ?? 0);
      recordUsage('gemini', input, Math.max(0, total - input), total);
    }

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new GeminiError('parse', 'Gemini returned an empty response. Retry.');
    }
    return text;
  }

  if (lastError) throw lastError;
  throw new GeminiError(
    'unknown',
    'None of the supported Gemini models are available for this API key. Google may have deprecated them. Try generating a new key in Google AI Studio.'
  );
}

function parseJsonOrThrow<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new GeminiError(
      'parse',
      'The AI returned malformed JSON. Retry - if it keeps happening, update the key.',
      { cause: err }
    );
  }
}

/** Different "lenses" for a question, so three questions on one concept never feel the same. */
const ANGLES = [
  'a short real-world product or system scenario (no algorithm words in the stem)',
  'a problem statement with the clues a candidate should notice (input shape, constraints, what is asked)',
  'a requirement that rules out the obvious approach and forces the right technique',
  'what an interviewer hears in the first minute of a problem and what it should trigger',
  'an input-size or complexity requirement that points to the right technique',
];

const DIFFICULTY_BRIEF: Record<Difficulty, string> = {
  easy:
    'EASY: a clear, textbook-style scenario with explicit clues. One option is obviously right ' +
    'once the clue is spotted; the distractors are other well-known concepts that clearly do not fit.',
  medium:
    'MEDIUM: a realistic scenario where the clues are implied, not stated. The distractors are ' +
    'plausible techniques that a half-prepared candidate might pick, so the candidate must reason about the constraints.',
  hard:
    'HARD: a subtle, multi-constraint scenario where the first instinct is wrong. Distractors are close ' +
    'neighbours of the right answer, and choosing correctly needs a trade-off, an edge case or a complexity argument.',
};

function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Models like to put the right answer in B or C. Shuffle the options and re-point correct_index. */
function shuffleOptions(q: MCQuestion): MCQuestion {
  const order = shuffle([0, 1, 2, 3]);
  const options = order.map((i) => q.options[i]) as MCQuestion['options'];
  const correct = order.indexOf(q.correct_index) as MCQuestion['correct_index'];
  return { ...q, options, correct_index: correct };
}

function asQuestion(raw: unknown): MCQuestion | null {
  if (!raw || typeof raw !== 'object') return null;
  const q = raw as Partial<MCQuestion>;
  const ci = Number(q.correct_index);
  if (
    typeof q.question !== 'string' ||
    q.question.trim() === '' ||
    !Array.isArray(q.options) ||
    q.options.length !== 4 ||
    q.options.some((o) => typeof o !== 'string' || o.trim() === '') ||
    new Set(q.options.map((o) => String(o).trim().toLowerCase())).size !== 4 ||
    !Number.isInteger(ci) ||
    ci < 0 ||
    ci > 3
  ) {
    return null;
  }
  return {
    question: q.question.trim(),
    options: q.options.map((o) => String(o).trim()) as MCQuestion['options'],
    correct_index: ci as MCQuestion['correct_index'],
    why: typeof q.why === 'string' ? q.why.trim() : '',
  };
}


/**
 * Text calls (question generation) use Groq only.
 * Gemini is used for voice grading only, because it is the one that accepts audio.
 */
async function callJson(
  prompt: string,
  temperature: number,
  reasoningEffort: 'low' | 'medium' = 'low',
): Promise<string> {
  return callGroq(prompt, true, temperature, GROQ_QUESTION_MODEL, reasoningEffort);
}

/** Never offered as a wrong option: too broad, or a step inside many other techniques (a student could defend them). */
const GENERIC_IDS = new Set(['dynamic-programming', 'graphs', 'recursion', 'arrays', 'big-o-family', 'sorting', 'hash-maps']);

/** Too vague to be an answer. A round on one of these asks about specific techniques instead. */
const BROAD_IDS = new Set(['dynamic-programming', 'graphs', 'recursion', 'arrays', 'big-o-family']);

/** Independent blind checks per question. Set to 2 for a second check at higher temperature (more tokens). */
const VERIFY_PASSES = 1;

/** A different setting for each question, so scenarios never repeat. */
const SETTINGS = [
  'logistics and delivery', 'a social network', 'banking and payments', 'an online multiplayer game',
  'a compiler or build system', 'maps and navigation', 'video streaming', 'hospital scheduling',
  'an e-commerce store', 'a text editor', 'a file system', 'sensor and IoT data',
  'university course planning', 'a sports tournament', 'cloud infrastructure', 'a ride-sharing app',
];

/** Titles and aliases (text in parentheses, e.g. acronyms) that must not appear in a question stem. */
function nameVariants(title: string): string[] {
  const out = [title.replace(/\s*\([^)]*\)/g, '').trim()];
  const paren = title.match(/\(([^)]*)\)/);
  if (paren) out.push(paren[1].trim());
  return out.filter((n) => n.length >= 3);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mentionsConcept(text: string, title: string): boolean {
  const t = text.toLowerCase();
  return nameVariants(title).some((n) =>
    new RegExp('(^|[^a-z0-9])' + escapeRegExp(n.toLowerCase()) + '([^a-z0-9]|$)').test(t),
  );
}

/** Invented hardware limits were a main source of wrong questions. Only structural facts and input sizes are allowed. */
const INVENTED_LIMIT =
  /\b\d[\d,.]*\s?(kb|mb|gb|ms|milliseconds?|seconds?|bytes?)\b|\b(memory|time|stack)\s+limit|stack space/i;

/** Claims about how other methods perform. They were sometimes false, so the scenario may only describe the situation. */
const METHOD_CLAIM =
  /\b(naive|brute[- ]?force|too slow|too expensive|too costly|too much memory|does(?:n't| not) (?:work|scale)|fails?)\b/i;

const STOP = new Set([
  'which', 'approach', 'fits', 'best', 'that', 'with', 'from', 'each', 'given', 'must', 'have', 'will', 'into',
  'than', 'they', 'this', 'their', 'there', 'when', 'what', 'would', 'only', 'also', 'list', 'input', 'between',
  'where', 'while', 'after', 'before', 'about', 'these', 'those', 'other', 'every', 'using', 'needs', 'need',
  'such', 'over', 'more', 'most', 'some', 'been', 'does', 'should', 'could', 'then', 'them', 'were', 'many',
]);

function contentWords(s: string): Set<string> {
  return new Set((s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => w.length > 3 && !STOP.has(w)));
}

/** Overlap of content words. Catches the same scenario retold with a different noun. */
function tooSimilar(a: string, b: string): boolean {
  const A = contentWords(a);
  const B = contentWords(b);
  if (A.size === 0 || B.size === 0) return false;
  let shared = 0;
  A.forEach((w) => {
    if (B.has(w)) shared++;
  });
  return shared / Math.min(A.size, B.size) > 0.55;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

/** Groq's free tier is limited per minute. A short "wait N seconds" is retried once instead of failing the round. */
async function callJsonRetry(
  prompt: string,
  temperature: number,
  effort: 'low' | 'medium' = 'low',
): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await callJson(prompt, temperature, effort);
    } catch (err) {
      if (!(err instanceof GeminiError) || err.kind !== 'quota' || attempt >= 2) throw err;
      const m = err.userMessage.match(/Wait (\d+)s/);
      const secs = m ? Number(m[1]) : 60;
      if (secs > 90) throw err; // a daily limit: waiting here would just look frozen
      await sleep((secs + 1) * 1000);
    }
  }
}

/** First sentence only, to keep the writer prompt short (Groq's free tier is limited per minute). */
function shortEssence(s: string, max = 200): string {
  const m = s.match(/^.*?[.!?](\s|$)/);
  const t = (m ? m[0] : s).trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

function isMeta(m: ConceptMeta | undefined): m is ConceptMeta {
  return m !== undefined;
}

/** Concepts that can be the right answer next to the round concept: related first, then the same category. */
function neighbourPool(meta: ConceptMeta, detail: ConceptDetail): ConceptMeta[] {
  const ok = CONCEPT_METAS.filter((m) => m.id !== meta.id && !GENERIC_IDS.has(m.id));
  const byId = new Map(ok.map((m) => [m.id, m] as const));
  const related = shuffle((detail.related ?? []).map((r) => byId.get(r.id)).filter(isMeta));
  const relatedIds = new Set(related.map((m) => m.id));
  const sameCategory = shuffle(ok.filter((m) => m.category === meta.category && !relatedIds.has(m.id)));
  const out = [...related, ...sameCategory];
  if (BROAD_IDS.has(meta.id)) {
    const seen = new Set(out.map((m) => m.id));
    out.push(...shuffle(ok.filter((m) => !seen.has(m.id))));
  }
  return out;
}

/** Wrong options are real neighbours of the answer, chosen here. Harder = more close neighbours. */
function pickClose(
  answer: ConceptMeta,
  detail: ConceptDetail,
  difficulty: Difficulty,
  tempting: ConceptMeta | null,
): ConceptMeta[] {
  const pool = CONCEPT_METAS.filter(
    (m) => m.id !== answer.id && m.id !== tempting?.id && !GENERIC_IDS.has(m.id),
  );
  const byId = new Map(pool.map((m) => [m.id, m] as const));
  const related = shuffle((detail.related ?? []).map((r) => byId.get(r.id)).filter(isMeta));
  const relatedIds = new Set(related.map((m) => m.id));
  const sameCategory = shuffle(pool.filter((m) => m.category === answer.category && !relatedIds.has(m.id)));
  const close = [...related, ...sameCategory];
  const closeIds = new Set(close.map((m) => m.id));
  const far = shuffle(pool.filter((m) => !closeIds.has(m.id)));

  const out: ConceptMeta[] = tempting ? [tempting] : [];
  const add = (m: ConceptMeta): void => {
    if (out.length < 3 && !out.some((x) => x.id === m.id)) out.push(m);
  };
  const closeTarget = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3; // the tempting one counts as close
  for (const m of close) if (out.length < closeTarget) add(m);
  far.forEach(add);
  close.forEach(add);
  return out;
}

interface Spec {
  answer: ConceptMeta;
  essence: string;
  tempting: ConceptMeta | null;
  wrong: ConceptMeta[];
  signal: string;
  setting: string;
  angle: string;
}

/**
 * Decide, in code, what each question is about. About half the questions have the round concept as the answer; the
 * others have a close neighbour as the answer and the round concept as the tempting wrong option. So the key differs
 * from question to question. A broad concept (Graphs, DP) is never an answer: its questions use specific techniques.
 */
async function chooseAnswers(
  meta: ConceptMeta,
  detail: ConceptDetail,
  difficulty: Difficulty,
  ask: number,
  haveKeys: string[],
): Promise<Spec[]> {
  const settings = shuffle(SETTINGS);
  const angles = shuffle(ANGLES);
  const broad = BROAD_IDS.has(meta.id);
  const neighbours = neighbourPool(meta, detail);
  const usedAnswers = new Set(haveKeys);
  const takenNow = new Set<string>();
  const bulletsLeft = new Map<string, string[]>();
  let own = haveKeys.filter((k) => k === meta.id).length;
  let total = haveKeys.length;
  const specs: Spec[] = [];

  for (let i = 0; i < ask; i++) {
    let answer: ConceptMeta | null = null;
    let tempting: ConceptMeta | null = null;
    if (!broad && own * 2 <= total) {
      answer = meta;
      own++;
    } else {
      const n =
        neighbours.find((m) => !usedAnswers.has(m.id) && !takenNow.has(m.id)) ??
        neighbours.find((m) => !takenNow.has(m.id));
      if (n) {
        answer = n;
        tempting = broad ? null : meta;
        takenNow.add(n.id);
      } else if (!broad) {
        answer = meta;
        own++;
      }
    }
    if (!answer) break;
    total++;

    const d = answer.id === meta.id ? detail : await loadConceptDetail(answer.id);
    if (!d || !Array.isArray(d.whenToUse) || d.whenToUse.length === 0) continue;
    const wrong = pickClose(answer, d, difficulty, tempting);
    if (wrong.length < 3) continue;
    let left = bulletsLeft.get(answer.id);
    if (!left || left.length === 0) left = shuffle(d.whenToUse);
    const signal = left[0];
    bulletsLeft.set(answer.id, left.slice(1));
    specs.push({
      answer,
      essence: shortEssence(d.overview.essence),
      tempting,
      wrong,
      signal,
      setting: settings[i % settings.length],
      angle: angles[i % angles.length],
    });
  }
  return specs;
}

/**
 * When the strict check rejects every question (common on backup models), keep questions the checker at least
 * agrees contain the key, and as a last resort the unchecked ones. Set to false to show an error instead.
 */
const ALLOW_UNVERIFIED_FALLBACK = true;

/**
 * Blind check. The checker sees only the question and the options (no key, no writer reasoning), tests every option,
 * and lists all that a competent engineer could defend. A question survives only if the key is the single option
 * listed and nothing in it is untrue. Never fails open: if the check cannot run, the error is shown, not unchecked questions.
 */
async function verifyQuestions(qs: MCQuestion[]): Promise<MCQuestion[]> {
  let alive = qs;
  let lenient: MCQuestion[] = []; // pass 1: key is among the defensible options and nothing is false
  for (let pass = 0; pass < VERIFY_PASSES && alive.length > 0; pass++) {
    const prompt =
      'You are a strict DSA examiner. For each question, test EVERY option against the facts stated in the question ' +
      '(sizes, directed or undirected, edge weights, sorted or not, number of queries, what is asked). ' +
      'Judge only from the question text and do not assume facts that are not stated. ' +
      'An option "works" if a competent engineer could defend it as a correct and reasonably efficient approach for the stated facts, ' +
      'even if another option is better. List every option that works. ' +
      'Also set "false_claim" to true if the question states or implies something untrue about an algorithm or data structure ' +
      '(for example that a standard method is too slow or cannot handle a case it can handle).\n\n' +
      alive
        .map(
          (q, i) =>
            'Q' + (i + 1) + ': ' + q.question + '\n' +
            q.options.map((o, j) => '  ' + j + ') ' + o).join('\n'),
        )
        .join('\n\n') +
      '\n\nReturn JSON exactly: {"results":[{"valid":[option indexes that work],"false_claim":false}, ...]} with one entry per question, in order.';
    const text = await callJsonRetry(prompt, pass === 0 ? 0 : 0.4, 'medium');
    const parsed = parseJsonOrThrow<{ results?: Array<{ valid?: unknown; false_claim?: unknown }> }>(text);
    const results = Array.isArray(parsed.results) ? parsed.results : null;
    if (!results || results.length !== alive.length) {
      throw new GeminiError('parse', 'The quality check returned an unexpected answer. Retry.');
    }
    if (pass === 0) {
      lenient = alive.filter((q, i) => {
        const v = results[i]?.valid;
        const valid = Array.isArray(v) ? v.map(Number) : [];
        return valid.includes(q.correct_index) && results[i]?.false_claim !== true;
      });
    }
    alive = alive.filter((q, i) => {
      const v = results[i]?.valid;
      const valid = Array.isArray(v) ? v.map(Number) : [];
      return valid.length === 1 && valid[0] === q.correct_index && results[i]?.false_claim !== true;
    });
  }
  if (alive.length === 0 && ALLOW_UNVERIFIED_FALLBACK) {
    return lenient.length > 0 ? lenient : qs;
  }
  return alive;
}

export interface McBatchOptions {
  difficulty: Difficulty;
  /** How many questions to generate in one call. Defaults to 3. */
  count?: number;
  /** Questions already asked on this concept, so the model does not repeat them. */
  avoid?: string[];
}

/** One writer call plus one blind check. Returns only questions that passed every check. */
async function generateOnce(
  meta: ConceptMeta,
  detail: ConceptDetail,
  difficulty: Difficulty,
  want: number,
  avoid: string[],
  haveKeys: string[],
): Promise<MCQuestion[]> {
  const ask = want + 1; // one spare: some questions are dropped by the checks
  const specs = await chooseAnswers(meta, detail, difficulty, ask, haveKeys);
  if (specs.length === 0) throw new GeminiError('parse', 'Could not plan questions for this concept. Retry.');

  const prompt =
    'You are a DSA interview coach. Write ' + specs.length + ' recognition questions. Each one describes a situation, ' +
    'and the candidate must pick the technique that fits.\n\n' +
    'DIFFICULTY (every question must be this level):\n' + DIFFICULTY_BRIEF[difficulty] + '\n\n' +
    'For every question the four answer options are FIXED. You write only the scenario, one reason the right technique fits, ' +
    'and one reason each wrong technique fails.\n\n' +
    specs
      .map(
        (s, i) =>
          'Q' + (i + 1) + '\n' +
          '- Right technique: ' + s.answer.title + ' (' + s.essence + ')\n' +
          '- The scenario must be decided by this clue: ' + s.signal + '\n' +
          '- Setting: ' + s.setting + '\n' +
          '- Style: ' + s.angle + '\n' +
          '- Wrong techniques, in this order: ' + s.wrong.map((w) => w.title).join(' | ') +
          (s.tempting
            ? '\n- "' + s.tempting.title + '" is a tempting wrong answer here: the scenario must contain a fact that rules it out.'
            : ''),
      )
      .join('\n\n') +
    '\n\nRules:\n' +
    '- Plain text only. Do NOT use LaTeX or $ signs. Write math as plain text, e.g. O(n log n), 10^5. Put code in `backticks`.\n' +
    '- Describe the situation only. Never name any of the four techniques (or an obvious synonym or acronym) in the scenario. Never name other algorithms or data structures.\n' +
    '- Never say or imply that any method is slow, naive, brute force, too expensive or does not work. State facts about the data and the goal only.\n' +
    '- State every fact needed to decide: directed or undirected, whether weights or values can be negative, whether the input is sorted, input size, and one query or many.\n' +
    '- Every detail must matter. Leave out irrelevant fields, names and numbers.\n' +
    '- Use only structural facts and input sizes. Do NOT invent time limits, memory limits, stack sizes or other hardware numbers.\n' +
    '- The scenario must make the right technique the best fit, and each wrong technique clearly unsuitable because of a fact you stated. Exactly one option may be defensible.\n' +
    '- Each question uses its own setting and different wording.\n' +
    '- End the scenario with one short question, for example "Which approach fits best?".\n' +
    '- "fails_because": exactly 3 entries, in the same order as the wrong techniques. Each is one concrete sentence (under 25 words) saying why that technique does not fit THIS scenario, citing a fact from it.\n' +
    '- "why": one sentence explaining why the right technique fits, using only facts stated in the question. Never refer to options by letter.\n' +
    (avoid.length
      ? '- Do not repeat or lightly reword any of these earlier questions:\n  * ' + avoid.join('\n  * ') + '\n'
      : '') +
    '\nRandom seed: ' + Math.random().toString(36).slice(2, 10) + '\n' +
    'Return JSON exactly, with one entry per question in order:\n' +
    '{"questions":[{"question":"scenario and question","why":"one sentence","fails_because":["...","...","..."]}]}';

  const text = await callJsonRetry(prompt, 0.8);
  const parsed = parseJsonOrThrow<unknown>(text);
  const list: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { questions?: unknown })?.questions)
      ? (parsed as { questions: unknown[] }).questions
      : [];

  const accepted: MCQuestion[] = [];
  for (let i = 0; i < Math.min(list.length, specs.length); i++) {
    const item = list[i] as { question?: unknown; why?: unknown; fails_because?: unknown } | null;
    if (!item || typeof item.question !== 'string' || typeof item.why !== 'string') continue;
    const stem = item.question.trim();
    const spec = specs[i];
    const titles = [spec.answer.title, ...spec.wrong.map((w) => w.title)];
    const fails = Array.isArray(item.fails_because) ? item.fails_because : [];
    if (fails.length !== 3 || !fails.every((f) => typeof f === 'string' && f.trim().length >= 20)) continue;
    if (stem.length < 40 || item.why.trim() === '') continue;
    if (titles.some((t) => mentionsConcept(stem, t))) continue; // names an option: leaks or misleads
    if (INVENTED_LIMIT.test(stem) || METHOD_CLAIM.test(stem)) continue;
    if (avoid.some((a) => tooSimilar(stem, a)) || accepted.some((a) => tooSimilar(stem, a.question))) continue;
    const q = asQuestion({ question: stem, options: titles, correct_index: 0, why: item.why });
    if (!q) continue;
    accepted.push(shuffleOptions(q)); // shuffle before the check so position cannot bias it
  }

  return verifyQuestions(accepted);
}

/** Prefer questions whose answers differ, so one lucky guess does not clear the whole round. */
function pickDiverse(qs: MCQuestion[], want: number): MCQuestion[] {
  const chosen: MCQuestion[] = [];
  const keys = new Set<string>();
  for (const q of qs) {
    const k = q.options[q.correct_index];
    if (chosen.length < want && !keys.has(k)) {
      keys.add(k);
      chosen.push(q);
    }
  }
  for (const q of qs) {
    if (chosen.length >= want) break;
    if (!chosen.includes(q)) chosen.push(q);
  }
  return chosen;
}

/** Checked questions only. One retry for the missing ones; if still short, fewer questions are shown. */
export async function generateMcBatch(
  meta: ConceptMeta,
  detail: ConceptDetail,
  opts: McBatchOptions,
): Promise<MCQuestion[]> {
  const want = opts.count ?? 3;
  const avoid = (opts.avoid ?? []).slice(0, 9);
  const idOfKey = (q: MCQuestion): string =>
    CONCEPT_METAS.find((m) => m.title === q.options[q.correct_index])?.id ?? '';
  let out = await generateOnce(meta, detail, opts.difficulty, want, avoid, []);
  if (out.length < want) {
    try {
      const more = await generateOnce(
        meta,
        detail,
        opts.difficulty,
        want - out.length,
        [...avoid, ...out.map((q) => q.question)].slice(0, 12),
        out.map(idOfKey),
      );
      out = [...out, ...more];
    } catch (err) {
      if (out.length === 0) throw err; // nothing to show: surface the real error (quota, network, ...)
    }
  }
  if (out.length === 0) {
    throw new GeminiError('parse', 'No question passed the quality checks this time. Retry.');
  }
  return pickDiverse(out, want);
}

function cleanList(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '')
    : [];
}

/** Gemini sometimes leaves fields out; fill safe defaults so the UI never crashes. */
function normalizeGrade(raw: unknown): ExplanationGrade {
  const g = (raw && typeof raw === 'object' ? raw : {}) as Partial<ExplanationGrade>;
  const rawScore = Number(g.score);
  const score = Number.isFinite(rawScore) ? Math.min(5, Math.max(0, Math.round(rawScore))) : 0;
  const verdict = ['fluent', 'hesitant', 'froze'].includes(String(g.fluency?.verdict))
    ? (g.fluency?.verdict as ExplanationGrade['fluency']['verdict'])
    : 'hesitant';
  return {
    transcript: typeof g.transcript === 'string' ? g.transcript : '',
    score: score as ExplanationGrade['score'],
    strengths: cleanList(g.strengths),
    missing: cleanList(g.missing),
    errors: cleanList(g.errors),
    improvements: cleanList(g.improvements),
    better_answer: typeof g.better_answer === 'string' ? g.better_answer.trim() : '',
    one_line_feedback: typeof g.one_line_feedback === 'string' ? g.one_line_feedback : '',
    fluency: {
      verdict,
      hesitation_markers: Number(g.fluency?.hesitation_markers) || 0,
      ended_abruptly: Boolean(g.fluency?.ended_abruptly),
    },
  };
}

export async function gradeExplanation(
  meta: ConceptMeta,
  detail: ConceptDetail,
  audioBase64: string,
  mimeType: string,
): Promise<ExplanationGrade> {
  const prompt =
    'You are grading a spoken explanation of a DSA concept. You will receive ' +
    'the audio below. First transcribe it, then grade it against the reference.\n\n' +
    'Concept: ' + meta.title + '\n\n' +
    'Reference:\n' +
    '- Essence: ' + detail.overview.essence + '\n' +
    '- What: ' + detail.overview.what + '\n' +
    '- Why it matters: ' + detail.overview.whyImportant + '\n' +
    '- Internals:\n- ' +
    detail.internals.map((x) => x.title + ': ' + x.body).join('\n- ') + '\n' +
    '- When to use:\n- ' + detail.whenToUse.join('\n- ') + '\n' +
    '- Common mistakes:\n- ' +
    detail.mistakes.map((x) => x.mistake + ' -> ' + x.fix).join('\n- ') + '\n\n' +
    'Score 0-5 for content:\n' +
    '5 = complete, correct, structured (what + why + when + one gotcha)\n' +
    '4 = correct but missing one of the above\n' +
    '3 = correct but shallow\n' +
    '2 = partially correct, some errors\n' +
    '1 = mostly wrong\n' +
    '0 = no meaningful content\n\n' +
    'ALSO assess fluency. Freezing is not the same as not-knowing.\n' +
    '- "froze": under 20 words, stops mid-thought\n' +
    '- "hesitant": many fillers ("um", "I think", "so basically") or trailing off\n' +
    '- "fluent": spoke continuously, finished coherent thought\n\n' +
    'COACHING RULES (very important):\n' +
    '- Base every comment on what the speaker ACTUALLY said. Refer to their own words and ideas. Never give generic advice.\n' +
    '- "strengths": 1 to 3 specific things they did well.\n' +
    '- "missing": the key ideas from the reference that they did not say.\n' +
    '- "errors": anything they said that is wrong, each with the correction. Use an empty array if there are none.\n' +
    '- "improvements": 2 to 4 concrete, actionable suggestions for explaining it better next time. ' +
    'Say exactly what to add, what to cut, how to structure it (what, why, when, one gotcha), or what sentence to open with. One short sentence each.\n' +
    '- "better_answer": a model spoken answer in the first person, 4 to 6 sentences (80 to 110 words), covering what it is, ' +
    'why it works, when to use it and one gotcha, in natural spoken English that the speaker could say in an interview.\n' +
    '- "one_line_feedback": one sentence naming the single most important thing to fix.\n\n' +
    'Return JSON exactly:\n' +
    '{"transcript":"exact words you heard","score":3,' +
    '"strengths":["..."],"missing":["..."],"errors":["..."],' +
    '"improvements":["..."],"better_answer":"...",' +
    '"one_line_feedback":"...",' +
    '"fluency":{"verdict":"fluent","hesitation_markers":0,"ended_abruptly":false}}';

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: audioBase64 } },
        ],
      },
    ],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
  };

  const text = await callGemini(body);
  return normalizeGrade(parseJsonOrThrow<unknown>(text));
}


export async function askAiTutor(
  meta: ConceptMeta,
  type: 'simple' | 'analogy' | 'code',
): Promise<string> {
  let instruction = '';
  if (type === 'simple') {
    instruction = 'Explain this concept in plain English to a complete beginner in 2 sentences. Avoid jargon.';
  } else if (type === 'analogy') {
    instruction = 'Give a 1-sentence real-world analogy that makes this concept easy to understand.';
  } else if (type === 'code') {
    instruction = 'Provide a tiny, 5-line code snippet (Python) demonstrating the core idea of this concept.';
  }

  const prompt = `You are an expert DSA tutor.\nConcept: ${meta.title}\nTagline: ${meta.tagline}\n\n${instruction}\n\nReturn ONLY the plain text response, no markdown formatting.`;

  return await callGroq(prompt, false, 0.6, GROQ_TUTOR_MODEL);
}
