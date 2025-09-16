import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { BankTransaction } from "../types";

export function useBankTransactions(entityId: string | undefined) {
  return useQuery({
    queryKey: ["bank-transactions", entityId],
    queryFn: async () => {
      const response = await api.get<BankTransaction[]>(`/entities/${entityId}/transactions`);
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}
