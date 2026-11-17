export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = 'Loading…',
}: LoadingStateProps): React.ReactElement {
  return (
    <div className="cx-loading" role="status" aria-live="polite">
      {message}
    </div>
  );
}
