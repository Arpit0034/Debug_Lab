export type CalloutType = 'info' | 'warn' | 'good' | 'bad';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps): React.ReactElement {
  const cls = type === 'info' ? 'cx-callout' : `cx-callout cx-callout--${type}`;
  return (
    <div className={cls}>
      {title && (
        <div className="cx-h4" style={{ marginTop: 0, marginBottom: '0.35rem' }}>
          {title}
        </div>
      )}
      <div style={{ margin: 0 }}>{children}</div>
    </div>
  );
}
