// Compact CTA on the problem page that navigates to the dedicated visualizer route.
import { Link } from 'react-router-dom';
import { hasVisualizer } from '../../data/viz/vizIndex';
import type { Problem } from '../../types/problem';

export function VisualizerLink({ problem }: { problem: Problem }): React.ReactElement | null {
  if (!hasVisualizer(problem.id)) return null;
  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Visualize execution</h2>
          <p className="mt-1 text-xs text-muted">
            Step through the correct and buggy runs side by side with live variables and call stack.{' '}
            <Link to="/visualizer-guide" className="text-accent">How to read it</Link>
          </p>
        </div>
        <Link
          to={'/problem/' + problem.id + '/visualize'}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          Open visualizer →
        </Link>
      </div>
    </section>
  );
}
