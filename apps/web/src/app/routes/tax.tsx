import { useMemo, useState } from "react";
import { CalendarCheck2, CalendarRange, Download, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/auth-provider";
import { useTaxPeriods } from "../hooks/use-tax-periods";
import { useCloseTaxPeriod } from "../hooks/use-close-tax-period";
import { usePayTaxPeriod } from "../hooks/use-pay-tax-period";
import { Panel } from "../components/ui/panel";
import { Button } from "../components/ui/button";
import type { TaxPeriod } from "../types";
import { api } from "../../lib/api";

export function TaxPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const { data, isLoading } = useTaxPeriods(entityId);
  const closeMutation = useCloseTaxPeriod();
  const payMutation = usePayTaxPeriod();

  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");

  const periods = useMemo(() => data ?? [], [data]);

  const handleClose = async () => {
    if (!entityId) return;
    await closeMutation.mutateAsync({
      entityId,
      periodStart: periodStart || undefined,
      periodEnd: periodEnd || undefined
    });
    setPeriodStart("");
    setPeriodEnd("");
  };

  const handleMarkPaid = async (period: TaxPeriod) => {
    if (!entityId) return;
    await payMutation.mutateAsync({ entityId, taxPeriodId: period.id });
  };

  const handleExport = async (period: TaxPeriod) => {
    if (!entityId) return;
    const periodParam = new Date(period.periodStart).toISOString().slice(0, 7);
    const response = await api.get(`/entities/${entityId}/export/rs-ge`, {
      params: { period: periodParam },
      responseType: "blob"
    });
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rs-export-${periodParam}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!entityId) {
    return (
      <Panel>
        <p className="text-sm text-ink-500">{t("tax.empty.title")}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">{t("tax.title")}</h2>
        <p className="text-sm text-ink-500">{t("tax.subtitle")}</p>
      </header>

      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <CalendarRange className="h-5 w-5 text-brand-500" />
          <span className="text-sm font-semibold text-ink-700">{t("tax.form.title")}</span>
        </div>
        <p className="text-xs text-ink-500">{t("tax.form.description")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-ink-700">{t("tax.form.periodStart")}</span>
            <input
              type="date"
              value={periodStart}
              onChange={(event) => setPeriodStart(event.target.value)}
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-ink-700">{t("tax.form.periodEnd")}</span>
            <input
              type="date"
              value={periodEnd}
              onChange={(event) => setPeriodEnd(event.target.value)}
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </label>
        </div>
        <Button size="lg" disabled={closeMutation.isLoading} onClick={handleClose}>
          {closeMutation.isLoading ? t("tax.form.submitting") : t("tax.form.submit")}
        </Button>
      </Panel>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-left text-sm text-ink-600">
            <thead className="text-xs uppercase tracking-[0.2em] text-ink-400">
              <tr>
                <th className="pb-3">{t("tax.table.period")}</th>
                <th className="pb-3">{t("tax.table.turnover")}</th>
                <th className="pb-3">{t("tax.table.taxDue")}</th>
                <th className="pb-3">{t("tax.table.status")}</th>
                <th className="pb-3">{t("tax.table.paidAt")}</th>
                <th className="pb-3 text-right">{t("tax.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-ink-400">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> {t("dashboard.loading.copy")}
                  </td>
                </tr>
              ) : periods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-ink-400">
                    {t("tax.empty.copy")}
                  </td>
                </tr>
              ) : (
                periods.map((period) => {
                  const periodLabel = new Date(period.periodStart).toLocaleDateString("ka-GE", {
                    month: "long",
                    year: "numeric"
                  });
                  const status = period.paid ? t("tax.status.paid") : t("tax.status.unpaid");
                  return (
                    <tr key={period.id} className="py-4">
                      <td className="py-4 font-medium text-ink-800">{periodLabel}</td>
                      <td className="py-4 text-xs text-ink-500">
                        ₾{Number(period.turnover ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 text-xs text-ink-500">
                        ₾{Number(period.taxDue ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            period.paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-ink-500">
                        {period.paidAt
                          ? new Date(period.paidAt).toLocaleString("ka-GE", { dateStyle: "medium" })
                          : "—"}
                      </td>
                      <td className="py-4 text-right text-xs">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExport(period)}
                            disabled={payMutation.isLoading || closeMutation.isLoading}
                          >
                            <Download className="mr-2 h-3.5 w-3.5" />
                            {t("tax.actions.export")}
                          </Button>
                          {!period.paid && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleMarkPaid(period)}
                              disabled={payMutation.isLoading}
                            >
                              {payMutation.isLoading ? t("tax.form.submitting") : t("tax.actions.markPaid")}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <CalendarCheck2 className="h-4 w-4 text-brand-500" />
          <span>{t("tax.actions.close")}</span>
        </div>
        <BankAnalyticsPanel />
      </Panel>
    </div>
  );
}
