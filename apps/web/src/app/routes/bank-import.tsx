import { Upload } from "lucide-react";
import { Panel } from "../components/ui/panel";
import { EmptyState } from "../components/ui/empty-state";

export function BankImportPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">ბანკის CSV იმპორტი</h2>
        <p className="text-sm text-ink-500">BOG/TBC ფორმატები, წესები და ავტომატური კატეგორიზაცია</p>
      </header>

      <Panel>
        <EmptyState
          title="გადაათრიეთ CSV ფაილი"
          description="აირჩიეთ საბანკო შაბლონი, მიანიჭეთ სვეტები და მიიღეთ წინასწარი ნახვა."
          icon={<Upload className="h-6 w-6" />}
          action={
            <a
              href="/bank-import/new"
              className="inline-flex items-center gap-2 rounded-full border border-ink-400 px-4 py-2 text-xs font-semibold text-ink-600"
            >
              აირჩიე ფაილი
            </a>
          }
        />
      </Panel>
    </div>
  );
}
