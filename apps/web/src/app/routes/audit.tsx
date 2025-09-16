import { Panel } from "../components/ui/panel";

const logs = [
  {
    id: "log-1",
    action: "invoice:create",
    actor: "demo@local.ge",
    timestamp: "2025-09-14T10:24:00+04:00",
    context: "ინვოისი #2025-004"
  },
  {
    id: "log-2",
    action: "expense:create",
    actor: "demo@local.ge",
    timestamp: "2025-09-13T15:42:00+04:00",
    context: "საშვოსტაციო საწვავის ქვითარი"
  }
];

export function AuditLogsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">აუდიტ-ლოგები</h2>
        <p className="text-sm text-ink-500">თემპერამენტული და დეტალური ისტორია ყველა მოქმედებისთვის</p>
      </header>

      <Panel>
        <table className="w-full table-fixed text-left text-sm text-ink-600">
          <thead className="text-xs uppercase tracking-[0.2em] text-ink-400">
            <tr>
              <th className="pb-3">დრო</th>
              <th className="pb-3">მოქმედება</th>
              <th className="pb-3">დეტალი</th>
              <th className="pb-3">პირი</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {logs.map((log) => (
              <tr key={log.id} className="py-3">
                <td className="py-3 text-xs text-ink-500">
                  {new Date(log.timestamp).toLocaleString("ka-GE", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="py-3 font-medium text-ink-800">{log.action}</td>
                <td className="py-3 text-ink-600">{log.context}</td>
                <td className="py-3 text-ink-500">{log.actor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
