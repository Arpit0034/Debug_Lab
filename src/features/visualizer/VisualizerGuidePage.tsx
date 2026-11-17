// "How to read the visualizer": a beginner guide with live, steppable demos of every visualizer type.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Canvas } from './Canvas';
import { CodePanel } from './CodePanel';
import { Controls } from './Controls';
import { deriveAnnotations } from './explain';
import { buildGuideDemos, type GuideDemo } from './guideDemos';
import { Legend } from './Legend';
import { SidePanel } from './SidePanel';
import type { Step } from './types';

function Card({ title, children, id }: { title: string; children: ReactNode; id?: string }): React.ReactElement {
  return (
    <section id={id} className="space-y-3 rounded-lg border border-line bg-surface p-4">
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Num({ n }: { n: number }): React.ReactElement {
  return (
    <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">{n}</span>
  );
}

function Bullets({ items }: { items: ReactNode[] }): React.ReactElement {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  );
}

/** A flat sketch of the screen with numbered parts, matching the explanations below it. */
function ScreenMap(): React.ReactElement {
  const box = 'flex items-center justify-center rounded border border-line bg-surface-2 p-3 text-xs text-muted';
  return (
    <div className="grid gap-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className={box + ' md:col-span-2'}><Num n={1} /> Controls: step buttons, slider, speed</div>
      <div className={box} style={{ minHeight: 180 }}><Num n={2} /> Canvas: the picture (tree, graph or calls)</div>
      <div className="grid gap-2">
        <div className={box}><Num n={3} /> Code, current line marked</div>
        <div className={box}><Num n={4} /> Step card: what this step does</div>
        <div className={box}><Num n={5} /> Variables (changes highlighted)</div>
        <div className={box}><Num n={6} /> Call stack</div>
      </div>
    </div>
  );
}

function DemoPlayer({ demo }: { demo: GuideDemo }): React.ReactElement {
  const steps: Step[] = demo.data.correct.steps;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const max = steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (index >= max) { setPlaying(false); return; }
    const id = window.setTimeout(() => setIndex((v) => Math.min(v + 1, max)), Math.max(120, 900 / speed));
    return () => window.clearTimeout(id);
  }, [playing, index, max, speed]);

  const step = steps[index] ?? null;
  const ann = useMemo(
    () => deriveAnnotations(demo.kind, step, steps, index, demo.data.structure),
    [demo, step, steps, index],
  );
  let prev: Step | null = null;
  if (step) {
    for (let j = index - 1; j >= 0; j--) if (steps[j].call === step.call) { prev = steps[j]; break; }
  }
  const next = index + 1 < steps.length ? steps[index + 1] : null;

  return (
    <div className="space-y-3">
      <Controls
        index={index}
        count={steps.length}
        playing={playing}
        speed={speed}
        canJump={false}
        onIndex={(i) => { setIndex(i); setPlaying(false); }}
        onPlayPause={() => setPlaying((v) => !v)}
        onSpeed={setSpeed}
        onJump={() => undefined}
      />
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-2">
          <Canvas kind={demo.kind} structure={demo.data.structure} steps={steps} stepIndex={index} divergenceCallId={null} />
          <Legend />
        </div>
        <div className="space-y-3">
          <CodePanel code={demo.data.code.correct} currentLine={step ? step.line : 1} buggyLines={[]} mode="correct" title="Code" />
          <SidePanel step={step} prev={prev} next={next} annotations={ann} code={demo.data.code.correct} run={demo.data.correct} isLast={index >= max} />
        </div>
      </div>
    </div>
  );
}

function DemoSection({ demo, n }: { demo: GuideDemo; n: number }): React.ReactElement {
  return (
    <Card title={n + '. ' + demo.title} id={'demo-' + demo.id}>
      <p className="text-sm text-muted">{demo.intro}</p>
      <p className="text-sm font-medium">Press Next (or the → key) and watch:</p>
      <Bullets items={demo.watch} />
      <DemoPlayer demo={demo} />
    </Card>
  );
}

export function VisualizerGuidePage(): React.ReactElement {
  const demos = useMemo(() => buildGuideDemos(), []);
  return (
    <div className="space-y-4">
      <PageHeader
        title="How to read the visualizer"
        subtitle="A 5-minute guide. Everything below is live: press Next in the demos to try it."
      >
        <Link to="/problems" className="text-sm text-accent">Go to problems →</Link>
      </PageHeader>

      <Card title="What it is for">
        <p className="text-sm text-muted">
          When your code gives a wrong answer, you normally take a pen, write the variables on paper and run the code line by line.
          The visualizer does that dry run for you, for the correct code and for your buggy code, so you can see
          <span className="text-fg"> exactly where the two stop behaving the same</span>. It is a debugging helper, not a movie: stop on any step and read it.
        </p>
        <Bullets items={[
          <>It shows one step at a time. <b className="text-fg">The highlighted line is the line that is about to run, not the one that just ran.</b></>,
          'Nothing changes on screen unless you press a button or Play. If something changed, the step card says why.',
          'Boring repeated setup (filling arrays, building adjacency lists) is cut short on purpose, with a note saying how many steps were skipped.',
        ]} />
      </Card>

      <Card title="The screen, part by part">
        <ScreenMap />
        <ol className="space-y-1.5 text-sm text-muted">
          <li><Num n={1} /><b className="text-fg">Controls.</b> First / Previous / Next / Last, Play, the slider, and speed. The ← → keys also step. "Jump to bug" goes to the first moment the buggy run differs from the correct one.</li>
          <li><Num n={2} /><b className="text-fg">Canvas.</b> The picture of your data. It changes type with the problem: a tree, a graph, or a tree of calls (examples below).</li>
          <li><Num n={3} /><b className="text-fg">Code.</b> The blue marked line is next to run. A red bar on the left marks the line that contains the bug (buggy tab only).</li>
          <li><Num n={4} /><b className="text-fg">Step card.</b> A plain sentence for this step: a check and whether it was True or False, the loop item taken, a function returning, or an error.</li>
          <li><Num n={5} /><b className="text-fg">Variables.</b> Values at this moment. Highlighted rows changed since the previous step; the grey text under a value says how (for example "[3]: 0 → 1").</li>
          <li><Num n={6} /><b className="text-fg">Call stack.</b> The functions that are running, newest at the bottom. It shows how deep the recursion is.</li>
        </ol>
        <p className="text-sm text-muted">
          The three tabs above the controls: <b className="text-fg">Correct</b> (the working solution), <b className="text-fg">Buggy</b> (yours or the planted bug), and
          <b className="text-fg"> Side by side</b> (both at the same step number, compact).
        </p>
      </Card>

      <Card title="Colours and symbols">
        <Legend />
        <Bullets items={[
          <><b className="text-fg">Blue glowing node:</b> what the current step is working on.</>,
          <><b className="text-fg">Green with a tick:</b> already visited (graphs) or already returned its answer (trees, calls).</>,
          <><b className="text-fg">Red with a cross:</b> the first step where the buggy run differs from the correct run.</>,
          <><b className="text-fg">Dashed grey:</b> not touched yet.</>,
          <><b className="text-fg">Pill "→ 5" under a node:</b> the value that call handed back.</>,
          <><b className="text-fg">Pill "visited=True" under a graph vertex:</b> the array value for that vertex.</>,
          <><b className="text-fg">Arrowhead on an edge:</b> the graph is directed; you may only go the way the arrow points. No arrowhead means you can go both ways.</>,
          <><b className="text-fg">Animated, brighter edge:</b> the edge involved in the current step.</>,
          <><b className="text-fg">"⋯ N repeated setup steps skipped":</b> repeated setup was hidden; the variables already include the result.</>,
        ]} />
      </Card>

      {demos.map((d, i) => <DemoSection key={d.id} demo={d} n={i + 1} />)}

      <Card title="How to find a bug with it">
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted">
          <li>Open the visualizer for a problem and click <b className="text-fg">Buggy</b>.</li>
          <li>Press <b className="text-fg">Jump to bug</b>. A red box tells you the first difference in words, for example "After line 14 ran, state[3] is 1 but should be 2".</li>
          <li>Read the <b className="text-fg">Step card</b> and the highlighted <b className="text-fg">code line</b>. Ask: "Is this what I wanted this line to do?"</li>
          <li>Press <b className="text-fg">Previous</b> a few times. Find the step just before the first wrong value. That line is usually the bug.</li>
          <li>Open <b className="text-fg">Side by side</b> and step both runs together to see where they separate.</li>
          <li>Go back to your own code and fix that line. Then try the problem again.</li>
        </ol>
      </Card>

      <Card title="Things that confuse everyone at first">
        <Bullets items={[
          <><b className="text-fg">"The line is highlighted but the variable did not change."</b> The line has not run yet. The change shows on the next step. The step card also previews it: "After this line: ...".</>,
          <><b className="text-fg">"Steps jump from line 4 to line 6."</b> Setup steps were skipped (see the note), or Python skipped a block because a check was False.</>,
          <><b className="text-fg">"A node is green but still moves."</b> Green only means "done at least once". The blue one is where you are now.</>,
          <><b className="text-fg">"The same function appears many times in the call stack."</b> That is recursion: each box is a separate call with its own variables.</>,
          <><b className="text-fg">"Variables look different after a call returns."</b> Each call has its own copy of its variables. Returning goes back to the caller's copy.</>,
          <><b className="text-fg">"Error card instead of a step."</b> The code crashed or raised an error. The card says what kind, why in plain words, and the facts (for example an index that is too big).</>,
          <><b className="text-fg">"The trace stops early."</b> Very long runs are cut at a step limit. A "Trace stopped" note appears if the code seemed to loop forever.</>,
        ]} />
      </Card>
    </div>
  );
}
