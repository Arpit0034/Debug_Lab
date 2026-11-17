// Dedicated full-page visualizer route: /problem/:id/visualize
import { Link, Navigate, useParams } from 'react-router-dom';
import { useApp } from '../../app/providers/context';
import { getProblem } from '../../data/problemRegistry';
import { hasVisualizer } from '../../data/viz/vizIndex';
import { VisualizerPanel } from './VisualizerPanel';

export function VisualizerPage(): React.ReactElement {
  const { id = '' } = useParams();
  const problem = getProblem(id);
  const { progress } = useApp();

  if (!problem) {
    return (
      <div className="space-y-2 p-6 text-sm">
        <p>Problem not found.</p>
        <Link to="/problems" className="text-accent">Back to problems</Link>
      </div>
    );
  }

  if (!hasVisualizer(problem.id)) {
    return (
      <div className="space-y-2 p-6 text-sm">
        <p>This problem does not have a visualizer.</p>
        <Link to={'/problem/' + problem.id} className="text-accent">Back to problem</Link>
      </div>
    );
  }

  const attempted = progress.attempts.some((a) => a.problemId === problem.id);
  if (!attempted) {
    return <Navigate to={'/problem/' + problem.id} replace />;
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to={'/problem/' + problem.id} className="text-xs text-muted hover:text-fg">
          ← Back to problem
        </Link>
        <h1 className="mt-1 text-xl font-semibold">{problem.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Step through the correct and buggy runs. Line numbers match the Python code.{' '}
          <Link to="/visualizer-guide" className="text-accent">New here? How to read this →</Link>
        </p>
      </div>
      <VisualizerPanel problem={problem} defaultOpen />
    </div>
  );
}
