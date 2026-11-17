import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, Sparkles, Target, Timer } from 'lucide-react';
import { CONCEPT_METAS } from '../data';
import { practiceSummary } from '../../concepts-practice/storage';
import type { ConceptMeta } from '../types';

type Level = 'easy' | 'medium' | 'hard';
const LEVELS: Array<{ id: Level; label: string }> = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

/** Build a practice link. `go` skips the setup screen; `concept` makes that concept the first round. */
export function practiceHref(opts: { concept?: string; level?: Level; go?: boolean } = {}): string {
  const q = new URLSearchParams();
  if (opts.concept) q.set('c', opts.concept);
  if (opts.level) q.set('d', opts.level);
  if (opts.go) q.set('go', '1');
  const s = q.toString();
  return '/concepts/practice' + (s ? '?' + s : '');
}

function LevelPicker({ concept }: { concept?: string }): React.ReactElement {
  return (
    <div className="cx-practice__levels" role="group" aria-label="Start at a difficulty">
      <span className="cx-practice__levels-label">Jump in:</span>
      {LEVELS.map((l) => (
        <Link
          key={l.id}
          to={practiceHref({ concept, level: l.id, go: true })}
          className={'cx-practice__lvl cx-practice__lvl--' + l.id}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

/**
 * The main call-to-action on the Knowledge Hub. Practice is the core of the app,
 * so it sits at the very top, says what it does, and starts in one click at a chosen difficulty.
 * A floating button takes over once the banner scrolls out of view.
 */
export function PracticeCta(): React.ReactElement {
  const ref = useRef<HTMLElement | null>(null);
  const summary = useMemo(() => practiceSummary(), []);
  const total = CONCEPT_METAS.length;

  return (
    <>
      <section ref={ref} className="cx-practice" aria-labelledby="cx-practice-title">
        <div className="cx-practice__icon" aria-hidden="true">
          <Mic size={26} />
        </div>

        <div className="cx-practice__body">
          <span className="cx-practice__eyebrow">
            <Sparkles size={12} aria-hidden="true" /> Voice practice · the fastest way to find your gaps
          </span>
          <h2 id="cx-practice-title" className="cx-practice__title">
            Can you explain it out loud? Find out.
          </h2>
          <p className="cx-practice__desc">
            Reading a concept is easy. Saying it clearly in an interview is the hard part. Get a set
            of 3 questions at the difficulty you choose, explain the concept in your own words, and
            get AI feedback, including the concepts you know but freeze on.
          </p>
          <ul className="cx-practice__facts">
            <li>
              <Target size={13} aria-hidden="true" /> Random mix, weighted to your weak spots
            </li>
            <li>
              <Timer size={13} aria-hidden="true" /> You pick how many questions
            </li>
            <li>
              <Mic size={13} aria-hidden="true" /> Needs your microphone
            </li>
          </ul>
          <p className="cx-practice__stat">
            {summary.practiced === 0
              ? 'You have not practised yet. Your first session takes about 10 minutes.'
              : summary.practiced + ' of ' + total + ' concepts practised' +
                (summary.lastSessionAvg !== null ? ' · last session ' + summary.lastSessionAvg + '/5' : '')}
          </p>
        </div>

        <div className="cx-practice__actions">
          <Link to="/concepts/practice" className="cx-practice__btn">
            Start practicing
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <LevelPicker />
        </div>
      </section>
      <PracticeFab watch={ref} />
    </>
  );
}

/** Floating shortcut that appears only while the banner is off screen. */
function PracticeFab({ watch }: { watch: React.RefObject<HTMLElement | null> }): React.ReactElement | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = watch.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [watch]);

  if (!visible) return null;
  return (
    <Link to="/concepts/practice" className="cx-fab" aria-label="Start voice practice">
      <Mic size={18} aria-hidden="true" />
      <span>Practice</span>
    </Link>
  );
}

/** Compact practice button for the concept reader's top bar. */
export function PracticeBarButton({ conceptId }: { conceptId: string }): React.ReactElement {
  return (
    <Link
      to={practiceHref({ concept: conceptId })}
      className="cx-app-bar__practice"
      title="Practice this concept out loud"
    >
      <Mic size={14} aria-hidden="true" />
      <span>Practice</span>
    </Link>
  );
}

/** Shown at the end of a concept: the natural moment to test what you just read. */
export function PracticeConceptCta({ meta }: { meta: ConceptMeta }): React.ReactElement {
  return (
    <aside className="cx-practice cx-practice--concept cx-no-print" aria-label={'Practice ' + meta.title}>
      <div className="cx-practice__icon" aria-hidden="true">
        <Mic size={22} />
      </div>
      <div className="cx-practice__body">
        <span className="cx-practice__eyebrow">
          <Sparkles size={12} aria-hidden="true" /> Test yourself
        </span>
        <h2 className="cx-practice__title">Could you explain {meta.title} in an interview?</h2>
        <p className="cx-practice__desc">
          Answer 3 recognition questions, then say it out loud and get feedback. You will start with
          this concept.
        </p>
      </div>
      <div className="cx-practice__actions">
        <Link to={practiceHref({ concept: meta.id })} className="cx-practice__btn">
          Practice this concept
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <LevelPicker concept={meta.id} />
      </div>
    </aside>
  );
}
