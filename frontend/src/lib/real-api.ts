// Implementação REAL da camada de dados, conversando com o Back-End (Express).
import { apiFetch } from "@/lib/api";
import type {
  AuthResponse,
  DashboardOverview,
  Integration,
  MediaKitProfile,
  PublicMediaKit,
  QuoteRequest,
  User
} from "@/types";

export const realApi = {
  login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  // OAuth do Google é feito por redirect no GoogleButton; mantido por compatibilidade.
  loginWithGoogle(): Promise<AuthResponse> {
    if (typeof window !== "undefined") {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
      window.location.href = `${base}/auth/google`;
    }
    return new Promise(() => {});
  },

  register(name: string, email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });
  },

  getCurrentUser(): Promise<User> {
    return apiFetch<User>("/auth/me");
  },

  logout(): Promise<void> {
    return apiFetch<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
  },

  getOverview(): Promise<DashboardOverview> {
    return apiFetch<DashboardOverview>("/dashboard/overview");
  },

  getIntegrations(): Promise<Integration[]> {
    return apiFetch<Integration[]>("/integrations");
  },

  // Inicia o OAuth real (retorna { url } quando há fluxo OAuth; senão null).
  getAuthorizeUrl(platform: Integration["platform"]): Promise<{ url: string | null }> {
    return apiFetch<{ url: string | null }>(`/integrations/${platform}/authorize-url`);
  },

  connectIntegration(platform: Integration["platform"]): Promise<Integration[]> {
    return apiFetch<Integration[]>(`/integrations/${platform}/connect`, {
      method: "POST",
      body: JSON.stringify({})
    });
  },

  disconnectIntegration(platform: Integration["platform"]): Promise<Integration[]> {
    return apiFetch<Integration[]>(`/integrations/${platform}`, { method: "DELETE" });
  },

  getProfile(): Promise<MediaKitProfile> {
    return apiFetch<MediaKitProfile>("/profile");
  },

  updateProfile(data: Partial<MediaKitProfile>): Promise<MediaKitProfile> {
    return apiFetch<MediaKitProfile>("/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  async getPublicMediaKit(username: string): Promise<PublicMediaKit | null> {
    try {
      return await apiFetch<PublicMediaKit>(`/public/${username}`, { cache: "no-store" });
    } catch {
      return null;
    }
  },

  requestQuote(username: string, data: QuoteRequest): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/public/${username}/quote`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
};
