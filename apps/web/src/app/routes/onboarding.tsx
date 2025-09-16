import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Panel } from "../components/ui/panel";
import { useAuth } from "../providers/auth-provider";
import type { EntityRequest } from "../types";

const schema = z.object({
  displayName: z.string().min(2),
  taxStatus: z.enum(["SMALL_BUSINESS", "STANDARD"]).default("SMALL_BUSINESS"),
  annualThreshold: z.coerce.number().min(0).default(500000),
  iban: z.string().optional(),
  bankName: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string().default("Asia/Tbilisi")
});

type FormValues = z.infer<typeof schema>;

export function OnboardingPage() {
  const { createEntity, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { taxStatus: "SMALL_BUSINESS", annualThreshold: 500000, timezone: "Asia/Tbilisi" } });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await createEntity(values as EntityRequest);
    } catch (err) {
      setError("პროფილის შექმნა ვერ მოხერხდა");
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="grid-background">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-12 px-6 py-12">
          <header className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
              შენი IE სივრცე
            </span>
            <h1 className="mt-4 font-display text-3xl text-ink-900">მოგესალმებით, {user?.firstName ?? user?.email}</h1>
            <p className="mt-2 text-sm text-ink-500">აივსეთ ძირითადი დეტალები რომ დავიწყოთ ბუღალტერიის ავტომატიზაცია.</p>
          </header>

          <Panel className="w-full">
            <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="პროფილის სახელი"
                  placeholder="მაგ. ნინო ჭიპაშვილი გრაფიკული სტუდიო"
                  {...register("displayName")}
                  error={errors.displayName?.message}
                />
                <Input
                  label="საიდენთიფიკაციო კოდი"
                  placeholder="12345678901"
                  {...register("taxId")}
                  error={errors.taxId?.message}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="IBAN"
                  placeholder="GE00BG0000000000000000"
                  {...register("iban")}
                  error={errors.iban?.message}
                />
                <Input
                  label="ბანკი"
                  placeholder="საქართველოს ბანკი"
                  {...register("bankName")}
                  error={errors.bankName?.message}
                />
              </div>

              <Input
                label="მისამართი"
                placeholder="თბილისი, ნიკო ნიკოლაძის 12"
                {...register("address")}
                error={errors.address?.message}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="ზღვარი (₾)"
                  type="number"
                  {...register("annualThreshold", { valueAsNumber: true })}
                  error={errors.annualThreshold?.message}
                />
                <Input
                  label="დროის სარტყელი"
                  {...register("timezone")}
                  error={errors.timezone?.message}
                />
              </div>

              {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "ვახორციელებთ настройკას..." : "პროფილის გახსნა"}
              </Button>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
}
