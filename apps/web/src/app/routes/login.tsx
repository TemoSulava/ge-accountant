import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../providers/auth-provider";
import { Panel } from "../components/ui/panel";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login, user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setError("ვერ მოხერხდა ავტორიზაცია. გადაამოწმეთ მონაცემები.");
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
            <h1 className="mt-4 font-display text-4xl text-ink-900">მოგესალმებით, ფინანსური მშვიდობა წინ არის</h1>
            <p className="mt-2 text-sm text-ink-500">გაიარეთ ავტორიზაცია ინდ. მეწარმის ანგარიშზე წუთებში.</p>
          </header>

          <Panel className="w-full max-w-md">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
              />
              {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "სესია იხსნება..." : "შესვლა"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-ink-500">
              ჯერ არ გაქვთ ანგარიში? {" "}
              <Link to="/register" className="font-semibold text-brand-600">
                შექმენით რამდენიმე წამში
              </Link>
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
