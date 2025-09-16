import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface ClosePayload {
  entityId: string;
  periodStart?: string;
  periodEnd?: string;
}

export function useCloseTaxPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityId, periodStart, periodEnd }: ClosePayload) => {
      const response = await api.post(`/entities/${entityId}/tax/close`, {
        periodStart,
        periodEnd
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tax-periods", variables.entityId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", variables.entityId] });
    }
  });
}
