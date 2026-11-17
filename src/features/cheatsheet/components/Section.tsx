export interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, title, children }: SectionProps): React.ReactElement {
  return (
    <section id={id}>
      <h2 id={`${id}-heading`} className="cx-section-title">
        {title}
      </h2>
      {children}
    </section>
  );
}
