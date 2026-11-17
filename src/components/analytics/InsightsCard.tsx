export function InsightsCard({ insights }: { insights: string[] }) {
  if (insights.length === 0) {
    return (
      <div className="ana-card p-5 text-sm text-muted">
        Solve a few more problems to unlock personalized insights.
      </div>
    );
  }

  return (
    <div className="ana-card p-5">
      <h2 className="text-sm font-medium mb-3">Insights</h2>
      <ul className="space-y-2 text-sm">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
