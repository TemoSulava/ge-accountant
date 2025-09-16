import { useMemo } from "react";
import { ArrowTrendingUp, Coins, PiggyBank, Receipt, FileText, LineChart, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Panel } from "../components/ui/panel";
import { EmptyState } from "../components/ui/empty-state";
import { LoadingOverlay } from "../components/ui/loading-overlay";
import { useAuth } from "../providers/auth-provider";
import { useDashboard } from "../hooks/use-dashboard";
import type { Invoice, Expense } from "../types";

function parseAmount(value: string) {
  return Number(value ?? 0);
}

function sumInvoices(invoices: Invoice[], predicate: (invoice: Invoice) => boolean) {
  return invoices.filter(predicate).reduce((sum, invoice) => sum + parseAmount(invoice.total), 0);
}

function sumExpenses(expenses: Expense[], predicate: (expense: Expense) => boolean) {
  return expenses.filter(predicate).reduce((sum, expense) => sum + parseAmount(expense.amount), 0);
}

export function DashboardPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const { data, isLoading } = useDashboard(entityId);

  const monthStart = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }, []);

  const yearStart = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  }, []);

  if (!entityId) {
    return (
      <EmptyState
        title={t("dashboard.noEntity.title")}
        description={t("dashboard.noEntity.description")}
        action={
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
          >
            {t("dashboard.noEntity.action")}
          </Link>
        }
      />
    );
  }

  if (isLoading || !data) {
    return <LoadingOverlay heading={t("dashboard.loading.title") ?? ""} message={t("dashboard.loading.copy") ?? ""} />;
  }

  const monthIncome = sumInvoices(data.invoices, (invoice) => new Date(invoice.issueDate) >= monthStart);
  const monthExpenses = sumExpenses(data.expenses, (expense) => new Date(expense.date) >= monthStart);
  const taxRate = activeEntity?.taxStatus === "SMALL_BUSINESS" ? 0.01 : 0.2;
  const taxEstimate = monthIncome * taxRate;
  const yearTurnover = sumInvoices(data.invoices, (invoice) => new Date(invoice.issueDate) >= yearStart);
  const threshold = activeEntity?.annualThreshold ?? 500000;
  const thresholdProgress = Math.min((yearTurnover / threshold) * 100, 100);

  const latestInvoices = [...data.invoices]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);
  const latestExpenses = [...data.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  const upcomingReminders = [...data.reminders]
    .filter((reminder) => !reminder.sentAt)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const metrics = [
    {
      title: t("dashboard.metrics.income"),
      value: `₾${monthIncome.toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`,
      sub: t("dashboard.metrics.incomeSub"),
      icon: ArrowTrendingUp,
      accent: "from-brand-400 to-brand-600"
    },
    {
      title: t("dashboard.metrics.expenses"),
      value: `₾${monthExpenses.toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`,
      sub: t("dashboard.metrics.expensesSub"),
      icon: Receipt,
      accent: "from-rose-300 to-rose-500"
    },
    {
      title: t("dashboard.metrics.tax"),
      value: `₾${taxEstimate.toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`,
      sub: t("dashboard.metrics.taxSub"),
      icon: Coins,
      accent: "from-amber-300 to-amber-500"
    },
    {
      title: t("dashboard.metrics.buffer"),
      value: `₾${yearTurnover.toLocaleString("ka-GE", { maximumFractionDigits: 2 })}`,
      sub: t("dashboard.metrics.bufferSub"),
      icon: PiggyBank,
      accent: "from-emerald-300 to-emerald-500"
    }
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Panel key={metric.title} className="relative overflow-hidden">
            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${metric.accent} opacity-30`} />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center gap-3 text-ink-500">
                <metric.icon className="h-5 w-5 text-brand-500" />
                <span className="text-sm font-medium">{metric.title}</span>
              </div>
              <p className="font-display text-3xl text-ink-900">{metric.value}</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-400">{metric.sub}</p>
            </div>
          </Panel>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <Panel className="xl:col-span-3">
          <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-ink-900">{t("dashboard.sections.trendTitle")}</h3>
                <p className="text-xs text-ink-500">{t("dashboard.sections.trendCopy")}</p>
              </div>
              <Link to="/reports" className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow">
                {t("dashboard.actions.viewReports")}
              </Link>
            </header>
            <div className="h-52 rounded-2xl bg-surface-muted/60" />
          </div>
        </Panel>
        <Panel className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink-900">{t("dashboard.sections.thresholdTitle")}</h3>
              <p className="text-xs text-ink-500">{t("dashboard.sections.thresholdCopy", { threshold: threshold.toLocaleString("ka-GE") })}</p>
            </div>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600">
              {thresholdProgress.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
              style={{ width: `${thresholdProgress}%` }}
            />
          </div>
          <div className="grid gap-3 text-xs text-ink-500">
            <div className="flex items-center justify-between">
              <span>{t("dashboard.threshold.incomeYtd")}</span>
              <span>₾{yearTurnover.toLocaleString("ka-GE", { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("dashboard.threshold.remaining")}</span>
              <span>₾{Math.max(threshold - yearTurnover, 0).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <header className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg text-ink-900">{t("dashboard.sections.recentInvoices")}</h3>
            <Link to="/invoices" className="text-xs font-semibold text-brand-600">
              {t("dashboard.actions.viewAll")}
            </Link>
          </header>
          {latestInvoices.length === 0 ? (
            <EmptyState
              title={t("dashboard.empty.invoicesTitle")}
              description={t("dashboard.empty.invoicesCopy")}
              action={
                <Link
                  to="/invoices/new"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600"
                >
                  {t("dashboard.actions.createInvoice")}
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-white/60 text-sm">
              {latestInvoices.map((invoice) => (
                <li key={invoice.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink-800">{invoice.number}</p>
                    <p className="text-xs text-ink-500">
                      {new Date(invoice.issueDate).toLocaleDateString("ka-GE", { dateStyle: "medium" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-ink-500">
                    <span className="font-semibold text-ink-800">
                      ₾{parseAmount(invoice.total).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}
                    </span>
                    <span className="rounded-full bg-brand-100 px-3 py-1 font-semibold text-brand-600">
                      {invoice.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel>
          <header className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg text-ink-900">{t("dashboard.sections.recentExpenses")}</h3>
            <Link to="/expenses" className="text-xs font-semibold text-brand-600">
              {t("dashboard.actions.viewAll")}
            </Link>
          </header>
          {latestExpenses.length === 0 ? (
            <EmptyState
              title={t("dashboard.empty.expensesTitle")}
              description={t("dashboard.empty.expensesCopy")}
              action={
                <Link
                  to="/expenses/new"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-400 px-4 py-2 text-xs font-semibold text-ink-600"
                >
                  {t("dashboard.actions.captureReceipt")}
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3 text-sm">
              {latestExpenses.map((expense) => (
                <li key={expense.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink-800">{expense.description ?? t("dashboard.labels.uncategorised")}</p>
                    <p className="text-xs text-ink-500">
                      {new Date(expense.date).toLocaleDateString("ka-GE", { dateStyle: "medium" })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-ink-600">
                    ₾{parseAmount(expense.amount).toLocaleString("ka-GE", { maximumFractionDigits: 2 })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink-900">{t("dashboard.sections.upcomingReminders")}</h3>
              <p className="text-xs text-ink-500">{t("dashboard.sections.upcomingRemindersCopy")}</p>
            </div>
            <Link to="/reminders" className="text-xs font-semibold text-brand-600">
              {t("dashboard.actions.manageReminders")}
            </Link>
          </header>
          {upcomingReminders.length === 0 ? (
            <EmptyState
              title={t("dashboard.empty.remindersTitle")}
              description={t("dashboard.empty.remindersCopy")}
              action={
                <Link
                  to="/reminders/new"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600"
                >
                  {t("dashboard.actions.createReminder")}
                </Link>
              }
            />
          ) : (
            <ul className="space-y-3 text-sm">
              {upcomingReminders.map((reminder) => (
                <li key={reminder.id} className="flex items-center justify-between rounded-2xl bg-surface-muted/80 px-4 py-3">
                  <div>
                    <p className="font-medium text-ink-800">{reminder.type}</p>
                    <p className="text-xs text-ink-500">
                      {new Date(reminder.dueDate).toLocaleString("ka-GE", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-ink-600">{reminder.channel}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel>
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink-900">{t("dashboard.sections.quickLinks")}</h3>
              <p className="text-xs text-ink-500">{t("dashboard.sections.quickLinksCopy")}</p>
            </div>
          </header>
          <div className="grid gap-3 text-sm">
            <Link to="/invoices" className="rounded-2xl bg-surface-muted/70 px-4 py-3 text-ink-600">
              <FileText className="mr-2 inline h-4 w-4 text-brand-500" />
              {t("dashboard.quickLinks.invoiceHistory")}
            </Link>
            <Link to="/reports" className="rounded-2xl bg-surface-muted/70 px-4 py-3 text-ink-600">
              <LineChart className="mr-2 inline h-4 w-4 text-brand-500" />
              {t("dashboard.quickLinks.financialReports")}
            </Link>
            <Link to="/audit" className="rounded-2xl bg-surface-muted/70 px-4 py-3 text-ink-600">
              <ScrollText className="mr-2 inline h-4 w-4 text-brand-500" />
              {t("dashboard.quickLinks.auditTrail")}
            </Link>
          </div>
        </Panel>
      </section>
    </div>
  );
}
