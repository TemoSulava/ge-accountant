import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../providers/auth-provider";
import { Panel } from "../components/ui/panel";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    locale: z.string().default("ka"),
    firstName: z.string().optional(),
    lastName: z.string().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "პაროლები უნდა ემთხვეოდეს",
    path: ["confirmPassword"]
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser, user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { locale: "ka" } });

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const { email, password, locale, firstName, lastName } = values;
      await registerUser({ email, password, locale, firstName, lastName });
    } catch (err) {
      setError("ვერ მოხერხდა რეგისტრაცია. სცადეთ სხვანაირი ელფოსტა");
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="grid-background">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-12">
          <header className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
              Solo Accounting
            </span>
            <h1 className="mt-4 font-display text-4xl text-ink-900">დაიწყეთ სოლო ბუღალტერიის სუფთა დაფა</h1>
            <p className="mt-2 text-sm text-ink-500">დაარეგისტრირეთ ანგარიში რამდენიმე დეტალით და შექმენით თქვენი IE პროფილი.</p>
          </header>

          <Panel className="w-full max-w-lg">
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-3 md:grid-cols-2">
                <Input label="სახელი" placeholder="მაგ. ნინო" {...register("firstName")}/>
                <Input label="გვარი" placeholder="მაგ. ჭიპაშვილი" {...register("lastName")}/>
              </div>
              <Input
                label="ელფოსტა"
                placeholder="demo@local.ge"
                type="email"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />
              <Input
                label="პაროლი"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                error={errors.password?.message}
              />
              <Input
                label="გაიმეორე პაროლი"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
              {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "ვაქმნით ანგარიშს..." : "რეგისტრაცია"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-ink-500">
              უკვე გაქვთ ანგარიში?{" "}
              <Link to="/login" className="font-semibold text-brand-600">
                დაბრუნდით შესასვლელში
              </Link>
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
