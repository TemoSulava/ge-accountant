import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface PayPayload {
  entityId: string;
  taxPeriodId: string;
  paidAt?: string;
}

export function usePayTaxPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taxPeriodId, paidAt }: PayPayload) => {
      const response = await api.patch(`/tax/periods/${taxPeriodId}/pay`, {
        paidAt
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tax-periods", variables.entityId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", variables.entityId] });
    }
  });
}
