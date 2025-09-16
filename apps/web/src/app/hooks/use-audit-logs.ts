import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { AuditLog } from "../types";

export function useAuditLogs(entityId: string | undefined, params: { from?: string; to?: string; limit?: number }) {
  return useQuery({
    queryKey: ["audit", entityId, params],
    queryFn: async () => {
      const response = await api.get<AuditLog[]>(`/entities/${entityId}/audit-logs`, {
        params
      });
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}
