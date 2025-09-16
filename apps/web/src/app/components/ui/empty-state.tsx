import { clsx } from "clsx";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "glass-panel rounded-3xl p-10 text-center",
        "flex flex-col items-center gap-4 text-ink-500",
        className
      )}
    >
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
        {icon ?? <Sparkles className="h-6 w-6" />}
      </div>
      <h3 className="font-display text-xl text-ink-900">{title}</h3>
      <p className="max-w-md text-sm text-ink-500">{description}</p>
      {action}
    </div>
  );
}
