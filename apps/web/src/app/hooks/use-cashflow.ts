import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface ReportPayload {
  total: number;
  items: Array<{ date: string; amount: number; description?: string }>;
}

interface ReportsResponse {
  range: { from: string; to: string };
  currency: string;
  income: ReportPayload;
  expenses: ReportPayload;
  net: number;
}

export function useProfitLoss(entityId: string | undefined, params: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ["reports", "pnl", entityId, params],
    queryFn: async () => {
      const response = await api.get<ReportsResponse>(`/entities/${entityId}/reports/pnl`, {
        params
      });
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}

interface CashflowResponse {
  range: { from: string; to: string };
  currency: string;
  inflow: ReportPayload;
  outflow: ReportPayload;
  net: number;
}

export function useCashflow(entityId: string | undefined, params: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ["reports", "cashflow", entityId, params],
    queryFn: async () => {
      const response = await api.get<CashflowResponse>(`/entities/${entityId}/reports/cashflow`, {
        params
      });
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}
