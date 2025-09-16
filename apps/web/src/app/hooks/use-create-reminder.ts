import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface CreateReminderPayload {
  entityId: string;
  type: string;
  dueDate: string;
  channel: string;
  payload?: Record<string, unknown>;
}

export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entityId, ...payload }: CreateReminderPayload) => {
      const response = await api.post(`/entities/${entityId}/reminders`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reminders", variables.entityId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", variables.entityId] });
    }
  });
}
