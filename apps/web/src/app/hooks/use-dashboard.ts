import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Invoice, Expense, Reminder, TaxPeriod } from "../types";

interface DashboardData {
  invoices: Invoice[];
  expenses: Expense[];
  reminders: Reminder[];
  taxPeriods: TaxPeriod[];
}

async function fetchDashboard(entityId: string): Promise<DashboardData> {
  const [invoicesRes, expensesRes, remindersRes, taxRes] = await Promise.all([
    api.get<Invoice[]>(`/entities/${entityId}/invoices`),
    api.get<Expense[]>(`/entities/${entityId}/expenses`),
    api.get<Reminder[]>(`/entities/${entityId}/reminders`),
    api.get<TaxPeriod[]>(`/entities/${entityId}/tax/periods`)
  ]);

  return {
    invoices: invoicesRes.data,
    expenses: expensesRes.data,
    reminders: remindersRes.data,
    taxPeriods: taxRes.data
  };
}

export function useDashboard(entityId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", entityId],
    queryFn: () => fetchDashboard(entityId as string),
    enabled: Boolean(entityId),
    staleTime: 60_000
  });
}
