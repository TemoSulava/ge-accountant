import { CloudUpload, FolderKanban } from "lucide-react";
import { Panel } from "../components/ui/panel";
import { EmptyState } from "../components/ui/empty-state";

export function ExpensesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink-900">ხარჯები</h2>
          <p className="text-sm text-ink-500">შეინახეთ ქვითრები, გამოიყენეთ OCR და კატეგორიები</p>
        </div>
        <a
          href="/expenses/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
        >
          <CloudUpload className="h-4 w-4" />
          აქციე ქვითარი მონაცემად
        </a>
      </div>

      <Panel>
        <EmptyState
          title="სცადეთ სწრაფი იმპორტი"
          description="გადაიღეთ ქვითარი ან ატვირთეთ PDF/PNG. OCR ავტომატურად ამოიცნობს თანხასა და მომწოდებელს."
          icon={<FolderKanban className="h-6 w-6" />}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600">
                ფოტო / PDF
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-ink-400 px-4 py-2 text-xs font-semibold text-ink-600">
                შექმენი ხელით
              </button>
            </div>
          }
        />
      </Panel>
    </div>
  );
}
