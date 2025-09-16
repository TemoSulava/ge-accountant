import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { setAccessToken } from "../../lib/session";
import type { AuthResponse } from "../types";

export function useAuthMutations() {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    }
  });

  const register = useMutation({
    mutationFn: async (payload: { email: string; password: string; locale?: string; firstName?: string; lastName?: string }) => {
      const response = await api.post<AuthResponse>("/auth/register", payload);
      return response.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    }
  });

  return { login, register };
}
