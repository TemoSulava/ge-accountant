import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Reminder } from "../types";

export function useReminders(entityId: string | undefined) {
  return useQuery({
    queryKey: ["reminders", entityId],
    queryFn: async () => {
      const response = await api.get<Reminder[]>(`/entities/${entityId}/reminders`);
      return response.data;
    },
    enabled: Boolean(entityId)
  });
}
