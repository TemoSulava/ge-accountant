import { useState } from "react";
import { Upload, Filter, ReceiptRussianRuble } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Panel } from "../components/ui/panel";
import { Dropzone } from "../components/ui/dropzone";
import { EmptyState } from "../components/ui/empty-state";
import { Button } from "../components/ui/button";
import { useAuth } from "../providers/auth-provider";
import { useExpenses } from "../hooks/use-expenses";
import type { Expense } from "../types";

const categories = [
  { id: "cat-1", name: "ტრანსპორტი", amount: 420 },
  { id: "cat-2", name: "ოფისი", amount: 680 },
  { id: "cat-3", name: "კლაუდ სერვისები", amount: 310 }
];

export function ExpensesPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const { data, isLoading } = useExpenses(entityId);
  const [filter, setFilter] = useState<string | null>(null);

  const filteredExpenses = (data ?? []).filter((expense) => (filter ? expense.categoryId === filter : true));
  const total = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink-900">{t("expenses.title")}</h2>
          <p className="text-sm text-ink-500">{t("expenses.subtitle")}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="ghost" size="sm" onClick={() => setFilter(null)}>
            <Filter className="mr-2 h-4 w-4" /> {t("expenses.actions.reset")}
          </Button>
          <Link
            to="/expenses/new"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
          >
            <Upload className="h-4 w-4" />
            {t("expenses.actions.add")}
          </Link>
        </div>
      </div>

      <Panel className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <Dropzone icon={<Upload className="h-6 w-6" />} hint={t("expenses.dropzone.hint")}>
            {t("expenses.dropzone.title")}
          </Dropzone>
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter((current) => (current === category.id ? null : category.id))}
                className="flex items-center justify-between rounded-2xl bg-surface-muted/70 px-4 py-3 text-left text-sm text-ink-600 transition hover:bg-surface-muted"
              >
                <div>
                  <p className="font-medium text-ink-800">{category.name}</p>
                  <p className="text-xs text-ink-500">₾{category.amount.toLocaleString("ka-GE")}</p>
                </div>
                <ReceiptRussianRuble className="h-4 w-4 text-brand-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div>
            <h3 className="font-display text-lg text-ink-900">{t("expenses.breakdown.title")}</h3>
            <p className="text-xs text-ink-500">{t("expenses.breakdown.copy")}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-ink-500">
            <span>{t("expenses.breakdown.total")}</span>
            <span className="font-semibold text-ink-800">₾{total.toLocaleString("ka-GE", { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </Panel>

      <Panel>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg text-ink-900">{t("expenses.list.title")}</h3>
          <span className="text-xs text-ink-500">{t("expenses.list.count", { count: filteredExpenses.length })}</span>
        </header>
        {isLoading ? (
          <p className="py-10 text-center text-xs text-ink-400">{t("expenses.loading")}</p>
        ) : filteredExpenses.length === 0 ? (
          <EmptyState
            title={t("expenses.empty.title")}
            description={t("expenses.empty.copy")}
            action={
              <Link
                to="/expenses/new"
                className="inline-flex items-center gap-2 rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600"
              >
                {t("expenses.actions.add")}
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-white/60 text-sm">
            {filteredExpenses.map((expense: Expense) => (
              <li key={expense.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-ink-800">{expense.description ?? t("expenses.list.noDescription")}</p>
                  <p className="text-xs text-ink-500">
                    {new Date(expense.date).toLocaleDateString("ka-GE", { dateStyle: "medium" })}
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink-700">
                  ₾{Number(expense.amount ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
