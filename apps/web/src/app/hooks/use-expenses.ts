import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Expense } from "../types";

export function useExpenses(entityId: string | undefined) {
  return useQuery({
    queryKey: ["expenses", entityId],
    queryFn: async () => {
      const response = await api.get<Expense[]>(`/entities/${entityId}/expenses`);
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}
