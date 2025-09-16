import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    const variants: Record<ButtonProps["variant"], string> = {
      primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-glow",
      secondary: "bg-surface-muted text-ink-700 hover:text-ink-900 border border-white/60",
      ghost: "text-ink-500 hover:text-ink-900"
    };

    const sizes: Record<ButtonProps["size"], string> = {
      sm: "px-4 py-2 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-sm"
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
