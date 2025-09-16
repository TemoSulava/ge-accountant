import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../lib/api";
import { setAccessToken, getAccessToken, getStoredUser, setStoredUser } from "../../lib/session";
import type { AuthResponse, ProfileResponse, EntityRequest, EntitySummary, UserProfile } from "../types";

interface AuthContextValue {
  user: UserProfile | null;
  entities: EntitySummary[];
  activeEntity: EntitySummary | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; locale?: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  createEntity: (payload: EntityRequest) => Promise<EntitySummary>;
  selectEntity: (entityId: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser<UserProfile>());
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [activeEntity, setActiveEntity] = useState<EntitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const bootstrap = useCallback(async () => {
    try {
      setLoading(true);
      const me = await api.get<ProfileResponse>("/auth/me");
      setUser(me.data.user);
      setStoredUser(me.data.user);
      const entityRes = await api.get<EntitySummary[]>("/entities");
      setEntities(entityRes.data);
      setActiveEntity((current) => {
        if (current) {
          const updated = entityRes.data.find((item) => item.id === current.id);
          if (updated) return updated;
        }
        return entityRes.data[0] ?? null;
      });
    } catch (error) {
      setAccessToken(null);
      setStoredUser(null);
      setUser(null);
      setEntities([]);
      setActiveEntity(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post<AuthResponse>("/auth/login", { email, password });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setStoredUser(response.data.user);
      await bootstrap();
      navigate(location.state?.from ?? "/", { replace: true });
    },
    [bootstrap, navigate, location.state]
  );

  const register = useCallback(
    async (payload: { email: string; password: string; locale?: string; firstName?: string; lastName?: string }) => {
      const response = await api.post<AuthResponse>("/auth/register", payload);
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setStoredUser(response.data.user);
      setEntities([]);
      setActiveEntity(null);
      navigate("/onboarding", { replace: true });
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setStoredUser(null);
    setUser(null);
    setEntities([]);
    setActiveEntity(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const createEntity = useCallback(
    async (payload: EntityRequest) => {
      if (!user) throw new Error("Unauthorized");
      const response = await api.post<EntitySummary>("/entities", payload);
      setEntities((prev) => [...prev, response.data]);
      setActiveEntity(response.data);
      await bootstrap();
      navigate("/", { replace: true });
      return response.data;
    },
    [bootstrap, navigate, user]
  );

  const selectEntity = useCallback(
    (entityId: string) => {
      const entity = entities.find((item) => item.id === entityId) ?? null;
      setActiveEntity(entity);
    },
    [entities]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, entities, activeEntity, loading, login, register, logout, createEntity, selectEntity }),
    [user, entities, activeEntity, loading, login, register, logout, createEntity, selectEntity]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
