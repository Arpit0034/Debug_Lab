export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps): React.ReactElement {
  return (
    <div className="cx-empty">
      <p className="cx-h3" style={{ margin: '0 0 0.5rem' }}>
        {title}
      </p>
      {description && <p style={{ margin: '0 0 1rem' }}>{description}</p>}
      {action && (
        <button type="button" className="cx-btn cx-btn--primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
