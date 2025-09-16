interface ReportCardProps {
  title: string;
  subtitle: string;
  amount: string;
  link?: string;
  children?: React.ReactNode;
}

export function ReportCard({ title, subtitle, amount, link, children }: ReportCardProps) {
  return (
    <div className="glass-panel relative flex flex-col gap-4 rounded-3xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400">{subtitle}</p>
          <h3 className="font-display text-xl text-ink-900">{title}</h3>
        </div>
        {link ? (
          <a
            href={link}
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
          >
            {amount}
          </a>
        ) : (
          <span className="text-2xl font-semibold text-ink-900">{amount}</span>
        )}
      </div>
      {children}
    </div>
  );
}
