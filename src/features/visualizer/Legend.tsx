// Small state legend below the canvas. Swatches mirror the node states drawn by Canvas.
export function Legend(): React.ReactElement {
  const items = [
    { state: 'current', label: 'current' },
    { state: 'good', label: 'returned / visited' },
    { state: 'bad', label: 'divergence' },
    { state: 'idle', label: 'not yet' },
  ];
  return (
    <div className="viz-root viz-legend" role="list" aria-label="Visualizer legend">
      {items.map((it) => (
        <div key={it.label} className="viz-legend-item" role="listitem">
          <span className="viz-swatch" data-state={it.state} aria-hidden="true" />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
