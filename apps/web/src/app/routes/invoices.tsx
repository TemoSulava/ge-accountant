import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Panel } from "../components/ui/panel";
import { Button } from "../components/ui/button";
import { Tag } from "../components/ui/tag";
import { useAuth } from "../providers/auth-provider";
import { useInvoices } from "../hooks/use-invoices";
import type { Invoice } from "../types";

function formatAmount(value: string) {
  return Number(value ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 });
}

const statusVariant: Record<string, "default" | "success" | "danger" | "warning"> = {
  ISSUED: "default",
  PAID: "success",
  PARTIALLY_PAID: "warning",
  CANCELLED: "danger"
};

export function InvoicesPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const { data, isLoading } = useInvoices(entityId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink-900">{t("invoices.title")}</h2>
          <p className="text-sm text-ink-500">{t("invoices.subtitle")}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
          >
            {t("invoices.actions.new")}
          </Link>
        </div>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[720px] text-left text-sm text-ink-600">
            <thead className="text-xs uppercase tracking-[0.2em] text-ink-400">
              <tr>
                <th className="pb-3">{t("invoices.table.number")}</th>
                <th className="pb-3">{t("invoices.table.date")}</th>
                <th className="pb-3">{t("invoices.table.total")}</th>
                <th className="pb-3">{t("invoices.table.status")}</th>
                <th className="pb-3 text-right">{t("invoices.table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {isLoading || !data ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-ink-400">
                    {t("invoices.loading")}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-ink-400">
                    {t("invoices.empty")}
                  </td>
                </tr>
              ) : (
                data.map((invoice: Invoice) => (
                  <tr key={invoice.id} className="py-3 transition hover:bg-surface-muted/50">
                    <td className="py-4 font-medium text-ink-800">
                      <Link to={`/invoices/${invoice.id}`} className="text-brand-600 hover:text-brand-700">
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="py-4 text-xs text-ink-500">
                      {new Date(invoice.issueDate).toLocaleDateString("ka-GE", { dateStyle: "medium" })}
                    </td>
                    <td className="py-4 text-xs font-semibold text-ink-700">₾{formatAmount(invoice.total)}</td>
                    <td className="py-4">
                      <Tag variant={statusVariant[invoice.status] ?? "default"}>{invoice.status}</Tag>
                    </td>
                    <td className="py-4 text-right text-xs">
                      <Button variant="ghost" size="sm" className="text-brand-600" onClick={() => {}}>
                        {t("invoices.actions.view")}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
