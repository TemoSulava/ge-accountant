import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface ImportPayload {
  entityId: string;
  bank: "BOG" | "TBC" | "OTHER";
  mapping?: Record<string, string>;
  file: File;
}

export function useBankImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityId, bank, mapping, file }: ImportPayload) => {
      const formData = new FormData();
      formData.append("bank", bank);
      if (mapping) {
        Object.entries(mapping).forEach(([key, value]) => {
          if (value) {
            formData.append(`mapping[${key}]`, value);
          }
        });
      }
      formData.append("file", file);

      const response = await api.post(`/entities/${entityId}/bank/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bank-transactions", variables.entityId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", variables.entityId] });
    }
  });
}
