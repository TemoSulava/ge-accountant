import { clsx } from "clsx";
import { ReactNode } from "react";

interface PanelProps {
  className?: string;
  children: ReactNode;
}

export function Panel({ className, children }: PanelProps) {
  return (
    <div className={clsx("glass-panel rounded-3xl p-6", className)}>
      {children}
    </div>
  );
}
