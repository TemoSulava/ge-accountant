import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface LoadingOverlayProps {
  heading?: string;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ heading = "იტვირთება", message = "გთხოვთ დაელოდოთ...", className }: LoadingOverlayProps) {
  return (
    <div
      className={clsx(
        "glass-panel flex flex-col items-center justify-center gap-3 rounded-3xl p-8 text-center",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      <div>
        <p className="font-display text-lg text-ink-800">{heading}</p>
        <p className="text-sm text-ink-500">{message}</p>
      </div>
    </div>
  );
}
