import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/auth-provider";
import { useProfitLoss, useCashflow } from "../hooks/use-cashflow";
import { Panel } from "../components/ui/panel";
import { Button } from "../components/ui/button";
import { ReportCard } from "../components/report-card";
import { ReportChart } from "../components/report-chart";

function toChartPoints(items: Array<{ date: string; amount: number }>) {
  return items.map((item) => ({
    date: new Date(item.date).toLocaleDateString("ka-GE", { month: "short", day: "2-digit" }),
    amount: item.amount
  }));
}

export function ReportsPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const [range, setRange] = useState<{ from?: string; to?: string }>({});

  const profitLossQuery = useProfitLoss(entityId, range);
  const cashflowQuery = useCashflow(entityId, range);

  const pnl = profitLossQuery.data;
  const cash = cashflowQuery.data;

  const incomeChart = useMemo(() => toChartPoints(pnl?.income.items ?? []), [pnl]);
  const expenseChart = useMemo(() => toChartPoints(pnl?.expenses.items ?? []), [pnl]);
  const cashChart = useMemo(() => toChartPoints(cash?.inflow.items ?? []), [cash]);
  const outflowChart = useMemo(() => toChartPoints(cash?.outflow.items ?? []), [cash]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">{t("reports.title")}</h2>
        <p className="text-sm text-ink-500">{t("reports.subtitle")}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-ink-500">
          {t("reports.filters.from")}
          <input
            type="date"
            className="ml-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={range.from ?? ""}
            onChange={(event) => setRange((prev) => ({ ...prev, from: event.target.value }))}
          />
        </label>
        <label className="text-xs text-ink-500">
          {t("reports.filters.to")}
          <input
            type="date"
            className="ml-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={range.to ?? ""}
            onChange={(event) => setRange((prev) => ({ ...prev, to: event.target.value }))}
          />
        </label>
        <Button size="sm" variant="ghost" onClick={() => setRange({})}>
          {t("reports.filters.reset")}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportCard
          title={t("reports.pnl.title")}
          subtitle={t("reports.pnl.subtitle")}
          amount={`₾${(pnl?.income.total ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`}
          link="/reports/pnl"
        >
          <ReportChart data={incomeChart} accent="#4c6fff" />
        </ReportCard>
        <ReportCard
          title={t("reports.expenses.title")}
          subtitle={t("reports.expenses.subtitle")}
          amount={`₾${(pnl?.expenses.total ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`}
        >
          <ReportChart data={expenseChart} accent="#f97316" />
        </ReportCard>
      </div>

      <Panel className="space-y-6">
        <header className="flex flex-col gap-2">
          <h3 className="font-display text-lg text-ink-900">{t("reports.cashflow.title")}</h3>
          <p className="text-xs text-ink-500">{t("reports.cashflow.subtitle")}</p>
        </header>
        <div className="grid gap-4 lg:grid-cols-2">
          <ReportCard
            title={t("reports.cashflow.inflow")}
            subtitle=""
            amount={`₾${(cash?.inflow.total ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`}
          >
            <ReportChart data={cashChart} accent="#22c55e" />
          </ReportCard>
          <ReportCard
            title={t("reports.cashflow.outflow")}
            subtitle=""
            amount={`₾${(cash?.outflow.total ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`}
          >
            <ReportChart data={outflowChart} accent="#ef4444" />
          </ReportCard>
        </div>
        <div className="flex items-center justify-between rounded-3xl bg-brand-500/10 px-6 py-4 text-sm text-brand-700">
          <span>{t("reports.cashflow.net")}</span>
          <span className="font-semibold text-brand-600">₾{(cash?.net ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}</span>
        </div>
      </Panel>
    </div>
  );
}
