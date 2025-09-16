import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps extends ButtonHTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
}

export const AccentCard = forwardRef<HTMLDivElement, CardProps>(
  ({ icon, title, description, actionLabel, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "glass-panel flex flex-col gap-4 rounded-3xl p-6 transition",
        "hover:-translate-y-1 hover:shadow-glow",
        className
      )}
      {...props}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-lg text-ink-900">{title}</h3>
        <p className="mt-1 text-sm text-ink-500">{description}</p>
      </div>
      <span className="text-xs font-semibold text-brand-600">{actionLabel}</span>
    </div>
  )
);

AccentCard.displayName = "AccentCard";
