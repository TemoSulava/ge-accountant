import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { TaxPeriod } from "../types";

export function useTaxPeriods(entityId: string | undefined) {
  return useQuery({
    queryKey: ["tax-periods", entityId],
    queryFn: async () => {
      const response = await api.get<TaxPeriod[]>(`/entities/${entityId}/tax/periods`);
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}
