import { Filter, FileCog, FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/auth-provider";
import { Panel } from "../components/ui/panel";
import { Button } from "../components/ui/button";
import { useBankTransactions } from "../hooks/use-bank-transactions";
import type { BankTransaction } from "../types";

const analyticsTiles = [
  {
    titleKey: "analytics.bank.volume",
    value: "₾12,450",
    chip: "+32%",
    icon: Filter,
    copyKey: "analytics.bank.volumeCopy",
    accent: "from-brand-400 to-brand-600"
  },
  {
    titleKey: "analytics.bank.rules",
    value: "18",
    chip: "4 ახალი",
    icon: FlaskConical,
    copyKey: "analytics.bank.rulesCopy",
    accent: "from-emerald-300 to-emerald-500"
  },
  {
    titleKey: "analytics.bank.pending",
    value: "6",
    chip: "მოქმედება",
    icon: FileCog,
    copyKey: "analytics.bank.pendingCopy",
    accent: "from-amber-300 to-amber-500"
  }
];

export function BankAnalyticsPanel() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const { data } = useBankTransactions(entityId);

  const volume = data?.reduce((sum, transaction) => sum + Number(transaction.amount ?? 0), 0) ?? 0;
  const latest = data?.slice(0, 5) ?? [];

  return (
    <Panel className="space-y-6">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-xl text-ink-900">{t("analytics.bank.title")}</h2>
        <p className="text-sm text-ink-500">{t("analytics.bank.subtitle")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {analyticsTiles.map((tile) => (
          <div key={tile.titleKey} className="relative overflow-hidden rounded-3xl bg-white/70 p-5 shadow-sm">
            <div className={`absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${tile.accent} opacity-20`} />
            <div className="relative flex flex-col gap-3 text-sm text-ink-500">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                <tile.icon className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink-700">{t(tile.titleKey)}</span>
                <span className="text-xs font-semibold text-brand-600">{tile.chip}</span>
              </div>
              <p className="font-display text-2xl text-ink-900">
                {tile.titleKey === "analytics.bank.volume" ? `₾${volume.toLocaleString("ka-GE", { maximumFractionDigits: 2 })}` : tile.value}
              </p>
              <p className="text-xs text-ink-500">{t(tile.copyKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-ink-900">{t("analytics.bank.recentTitle")}</h3>
          <Button variant="ghost" size="sm" className="text-brand-600">
            {t("analytics.bank.manageRules")}
          </Button>
        </div>
        <ul className="divide-y divide-white/60 text-sm">
          {latest.length === 0 ? (
            <li className="py-6 text-center text-xs text-ink-400">{t("analytics.bank.noTransactions")}</li>
          ) : (
            latest.map((transaction: BankTransaction) => (
              <li key={transaction.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-ink-800">{transaction.description}</p>
                  <p className="text-xs text-ink-500">
                    {new Date(transaction.date).toLocaleDateString("ka-GE", { dateStyle: "medium" })}
                  </p>
                </div>
                <span className="text-xs font-semibold text-ink-700">
                  ₾{Number(transaction.amount ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </Panel>
  );
}
