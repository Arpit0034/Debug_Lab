export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): React.ReactElement {
  return (
    <div className="cx-error" role="alert">
      <strong>Error: </strong>
      {message}
      {onRetry && (
        <button
          type="button"
          className="cx-btn cx-btn--sm"
          onClick={onRetry}
          style={{ marginLeft: '0.75rem' }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
