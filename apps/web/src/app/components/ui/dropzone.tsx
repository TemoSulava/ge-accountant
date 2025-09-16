import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { clsx } from "clsx";

interface DropzoneProps extends ButtonHTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  hint?: string;
}

export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, icon, hint, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "group flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-brand-300/60",
          "bg-white/70 p-10 text-center text-sm text-ink-500 transition hover:border-brand-400 hover:bg-white",
          className
        )}
        {...props}
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
          {icon}
        </div>
        <div className="font-medium text-ink-800">{children}</div>
        {hint && <p className="text-xs text-ink-400">{hint}</p>}
      </div>
    );
  }
);

Dropzone.displayName = "Dropzone";
