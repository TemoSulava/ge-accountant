import { ReactNode } from "react";
import { clsx } from "clsx";

interface TagProps {
  children: ReactNode;
  variant?: "default" | "success" | "danger" | "warning";
}

export function Tag({ children, variant = "default" }: TagProps) {
  const variants = {
    default: "bg-surface-muted text-ink-600",
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-rose-100 text-rose-700",
    warning: "bg-amber-100 text-amber-700"
  };

  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", variants[variant])}>
      {children}
    </span>
  );
}
