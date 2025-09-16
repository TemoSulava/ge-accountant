import { Plus, Search } from "lucide-react";
import { Panel } from "../components/ui/panel";
import { EmptyState } from "../components/ui/empty-state";

export function InvoicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink-900">ინვოისები</h2>
          <p className="text-sm text-ink-500">გადახდის სტატუსები, PDF და ელ. გაგზავნა</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-sm text-ink-500">
            <Search className="h-4 w-4" />
            <input
              className="w-44 bg-transparent text-sm text-ink-600 placeholder:text-ink-400 focus:outline-none"
              placeholder="კლიენტი, ნომერი, თანხა"
            />
          </div>
          <a
            href="/invoices/new"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
          >
            <Plus className="h-4 w-4" />
            ახალი ინვოისი
          </a>
        </div>
      </div>

      <Panel className="p-0">
        <div className="grid gap-6 p-6">
          <header className="grid gap-2">
            <h3 className="text-sm font-semibold text-ink-700">ღია ინვოისები</h3>
            <p className="text-xs text-ink-500">მიჰყევით ბალანსს და გადაიყვანეთ გადახდები ავტომატურად CSV-დან</p>
          </header>
          <EmptyState
            title="ჯერ არ გაქვთ ინვოისი ამ პერიოდში"
            description="დაიწყეთ პირველი ინვოისით - მოარგეთ ლოგო, გამოიყენეთ ორბილინგურობა, გაგზავნეთ ბმული პირდაპირ კლინეტს."
            action={
              <a
                href="/invoices/new"
                className="inline-flex items-center gap-2 rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600"
              >
                შექმენი ინვოისი
              </a>
            }
          />
        </div>
      </Panel>
    </div>
  );
}
