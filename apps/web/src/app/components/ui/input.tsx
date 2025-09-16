import { clsx } from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, className, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2 text-sm">
        {label && <span className="font-medium text-ink-700">{label}</span>}
        <input
          ref={ref}
          className={clsx(
            "w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 text-sm text-ink-800 shadow-sm",
            "placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400",
            error && "border-rose-400 focus:ring-rose-400",
            className
          )}
          {...props}
        />
        {description && !error && <span className="text-xs text-ink-400">{description}</span>}
        {error && <span className="text-xs font-medium text-rose-500">{error}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";
