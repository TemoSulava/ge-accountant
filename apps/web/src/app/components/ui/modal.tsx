import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/40 bg-white/90 p-6 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {title && <h3 className="font-display text-xl text-ink-900">{title}</h3>}
            {description && <p className="text-sm text-ink-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-500 hover:text-ink-800"
          >
            ×
          </button>
        </div>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
