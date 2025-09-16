import { ChangeEvent, useMemo, useRef, useState } from "react";
import { Upload, CheckCircle2, ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/auth-provider";
import { useBankImport } from "../hooks/use-bank-import";
import { useBankTransactions } from "../hooks/use-bank-transactions";
import { Panel } from "../components/ui/panel";
import { Dropzone } from "../components/ui/dropzone";
import { Button } from "../components/ui/button";
import { BankAnalyticsPanel } from "../components/bank-analytics-panel";
import type { BankTransaction } from "../types";

const mappingFields = ["date", "amount", "debit", "credit", "description", "counterparty"] as const;

export function BankImportPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const [bank, setBank] = useState<"BOG" | "TBC" | "OTHER">("BOG");
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useBankImport();
  const transactionsQuery = useBankTransactions(entityId);

  const handleFile = (newFile: File) => {
    setFile(newFile);
    setStatusMessage(null);
  };

  const onDropzoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      handleFile(newFile);
    }
  };

  const onSubmit = async () => {
    if (!file || !entityId) return;
    try {
      setStatusMessage(null);
      await importMutation.mutateAsync({ entityId, bank, mapping, file });
      setStatusMessage(t("bankImport.success"));
      setFile(null);
      setMapping({});
    } catch (error) {
      setStatusMessage(t("bankImport.error"));
    }
  };

  const preview = useMemo(() => transactionsQuery.data?.slice(0, 8) ?? [], [transactionsQuery.data]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">{t("bankImport.title")}</h2>
        <p className="text-sm text-ink-500">{t("bankImport.subtitle")}</p>
      </header>

      <Panel className="grid gap-8 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-600">
            <span className="font-semibold">{t("bankImport.bankLabel")}</span>
            {(["BOG", "TBC", "OTHER"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setBank(item)}
                className={
                  bank === item
                    ? "rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
                    : "rounded-full border border-white/60 px-4 py-2 text-xs font-semibold text-ink-500 hover:text-ink-800"
                }
              >
                {t(`bankImport.banks.${item.toLowerCase()}`)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={onDropzoneChange}
            />
            <Dropzone
              icon={<Upload className="h-6 w-6" />}
              hint={t("bankImport.dropzone.hint")}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? file.name : t("bankImport.dropzone.title")}
            </Dropzone>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mappingFields.map((field) => (
              <div key={field} className="flex flex-col gap-2 text-sm">
                <label className="font-medium text-ink-700">
                  {t(`bankImport.mapping.${field}`)}
                </label>
                <input
                  className="rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  placeholder={t("bankImport.mapping.placeholder")}
                  value={mapping[field] ?? ""}
                  onChange={(event) => setMapping((prev) => ({ ...prev, [field]: event.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-xs text-ink-500">
            <span className="font-semibold text-ink-700">{t("bankImport.hints.title")}</span>
            <ul className="list-disc space-y-1 pl-5">
              <li>{t("bankImport.hints.supported")}</li>
              <li>{t("bankImport.hints.rules")}</li>
              <li>{t("bankImport.hints.preview")}</li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <Button size="lg" disabled={!file || importMutation.isPending} onClick={onSubmit}>
              {importMutation.isPending ? t("bankImport.buttons.importing") : t("bankImport.buttons.import")}
            </Button>
            {statusMessage && <span className="text-xs font-semibold text-brand-600">{statusMessage}</span>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <ListFilter className="h-4 w-4" />
            <span>{t("bankImport.preview.title")}</span>
            <span className="text-xs text-ink-400">{transactionsQuery.data?.length ?? 0} {t("bankImport.preview.count")}</span>
          </div>
          <div className="rounded-2xl bg-surface-muted/80 p-4 text-xs text-ink-600">
            {transactionsQuery.isLoading ? (
              <p>{t("bankImport.preview.loading")}</p>
            ) : preview.length === 0 ? (
              <p>{t("bankImport.preview.empty")}</p>
            ) : (
              <ul className="space-y-3">
                {preview.map((transaction: BankTransaction) => (
                  <li key={transaction.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-ink-800">{transaction.description}</p>
                      <p className="text-xs text-ink-500">
                        {new Date(transaction.date).toLocaleDateString("ka-GE", { dateStyle: "medium" })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-ink-700">
                      ?{Number(transaction.amount ?? 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 text-xs text-brand-600">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              {t("bankImport.rules.title")}
            </div>
            <p className="mt-2">
              {t("bankImport.rules.copy")}
            </p>
          </div>
        </div>
      </Panel>

      <BankAnalyticsPanel />
    </div>
  );
}
