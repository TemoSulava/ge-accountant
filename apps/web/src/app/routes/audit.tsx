import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";
import { useAuditLogs } from "../hooks/use-audit-logs";
import type { AuditLog } from "../types";
import { Panel } from "../components/ui/panel";
import { Button } from "../components/ui/button";
import { Tag } from "../components/ui/tag";

const ACTION_BADGES: Record<string, "default" | "success" | "warning"> = {
  "invoice:create": "success",
  "invoice:update": "default",
  "expense:create": "success",
  "tax:closePeriod": "warning"
};

export function AuditLogsPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const [searchParams, setSearchParams] = useSearchParams();

  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? 50);

  const auditQuery = useAuditLogs(entityId, { from, to, limit });

  const actions = useMemo(() => Array.from(new Set((auditQuery.data ?? []).map((log) => log.action))), [auditQuery.data]);
  const [actionFilter, setActionFilter] = useState<string | null>(null);

  const filteredLogs = (auditQuery.data ?? []).filter((log) => (actionFilter ? log.action === actionFilter : true));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">{t("audit.title")}</h2>
        <p className="text-sm text-ink-500">{t("audit.subtitle")}</p>
      </header>

      <Panel className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
          <label>
            {t("audit.filters.from")}
            <input
              type="date"
              className="ml-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={from ?? ""}
              onChange={(event) => setSearchParams((prev) => ({ ...Object.fromEntries(prev), from: event.target.value }))}
            />
          </label>
          <label>
            {t("audit.filters.to")}
            <input
              type="date"
              className="ml-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={to ?? ""}
              onChange={(event) => setSearchParams((prev) => ({ ...Object.fromEntries(prev), to: event.target.value }))}
            />
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchParams({});
              setActionFilter(null);
            }}
          >
            {t("audit.filters.reset")}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag variant={actionFilter === null ? "success" : "default"}>
            <button type="button" onClick={() => setActionFilter(null)}>{t("audit.filters.all")}</button>
          </Tag>
          {actions.map((action) => (
            <Tag key={action} variant={actionFilter === action ? "warning" : "default"}>
              <button type="button" onClick={() => setActionFilter(action)}>{action}</button>
            </Tag>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-left text-sm text-ink-600">
            <thead className="text-xs uppercase tracking-[0.2em] text-ink-400">
              <tr>
                <th className="pb-3">{t("audit.table.time")}</th>
                <th className="pb-3">{t("audit.table.action")}</th>
                <th className="pb-3">{t("audit.table.details")}</th>
                <th className="pb-3">{t("audit.table.user")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {auditQuery.isLoading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-xs text-ink-400">
                    {t("audit.loading")}
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-xs text-ink-400">
                    {t("audit.empty")}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: AuditLog) => (
                  <tr key={log.id} className="py-3">
                    <td className="py-3 text-xs text-ink-500">
                      {new Date(log.createdAt).toLocaleString("ka-GE", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="py-3">
                      <Tag variant={ACTION_BADGES[log.action] ?? "default"}>{log.action}</Tag>
                    </td>
                    <td className="py-3 text-xs text-ink-600">
                      {JSON.stringify(log.details, null, 2)}
                    </td>
                    <td className="py-3 text-xs text-ink-500">{log.userId}</td>
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
