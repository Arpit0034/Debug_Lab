import type { DryRunStep } from '../types';

export interface DryRunTableProps {
  steps: DryRunStep[];
}

export function DryRunTable({ steps }: DryRunTableProps): React.ReactElement {
  if (steps.length === 0) {
    return <p className="cx-small cx-muted">No dry run provided.</p>;
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="cx-table">
        <thead>
          <tr>
            <th style={{ width: '4rem' }}>Step</th>
            <th>State</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((s, i) => (
            <tr key={i}>
              <td className="cx-mono" style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                {s.step}
              </td>
              <td className="cx-mono" style={{ fontSize: '0.8125rem' }}>
                {s.state}
              </td>
              <td style={{ fontSize: '0.8125rem' }}>{s.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
