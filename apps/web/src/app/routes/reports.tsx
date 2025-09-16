import { Panel } from "../components/ui/panel";

export function ReportsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">მოხსენებები</h2>
        <p className="text-sm text-ink-500">P&L და Cashflow ვიზუალიზაციები, CSV ექსპორტი</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink-900">გრუნცხეულის P&L</h3>
              <p className="text-xs text-ink-500">ინდი. მეწარმის შემოსავალი და ხარჯები</p>
            </div>
            <a className="text-xs font-semibold text-brand-600" href="/reports/pnl">ნახე დეტალურად</a>
          </header>
          <div className="h-48 rounded-2xl bg-surface-muted/70" />
        </Panel>
        <Panel>
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink-900">ფულადი ნაკადები</h3>
              <p className="text-xs text-ink-500">ინფლოუ/აუტფლოუ კორპორატიული ანგარიშიდან</p>
            </div>
            <a className="text-xs font-semibold text-brand-600" href="/reports/cashflow">ნახე დეტალურად</a>
          </header>
          <div className="h-48 rounded-2xl bg-surface-muted/70" />
        </Panel>
      </div>
    </div>
  );
}
