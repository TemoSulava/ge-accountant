import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Invoice } from "../types";

export function useInvoices(entityId: string | undefined) {
  return useQuery({
    queryKey: ["invoices", entityId],
    queryFn: async () => {
      const response = await api.get<Invoice[]>(`/entities/${entityId}/invoices`);
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}
