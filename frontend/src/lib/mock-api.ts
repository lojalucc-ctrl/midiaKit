// Camada de dados mockada usada pelo MVP. Cada função simula latência de rede
// e devolve dados de `mock-data.ts`. Troque o corpo destas funções por chamadas
// a `apiFetch` (lib/api.ts) quando o backend estiver pronto — as assinaturas
// e os tipos de retorno permanecem idênticos, então os hooks não mudam.

import type {
  AuthResponse,
  DashboardOverview,
  Integration,
  MediaKitProfile,
  PublicMediaKit,
  QuoteRequest,
  User
} from "@/types";
import {
  mockIntegrations,
  mockOverview,
  mockProfile,
  mockUser,
  publicMediaKits
} from "@/lib/mock-data";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// Estado em memória (apenas para a sessão atual do MVP).
let integrationsState: Integration[] = [...mockIntegrations];
let profileState: MediaKitProfile = { ...mockProfile };

export const mockApi = {
  async login(_email: string, _password: string): Promise<AuthResponse> {
    await delay();
    return { user: mockUser };
  },

  async loginWithGoogle(): Promise<AuthResponse> {
    await delay(400);
    return { user: mockUser };
  },

  async register(
    name: string,
    email: string,
    _password?: string
  ): Promise<AuthResponse> {
    await delay();
    return {
      user: { ...mockUser, name, email, username: name.split(" ")[0].toLowerCase() }
    };
  },

  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUser;
  },

  async logout(): Promise<void> {
    await delay(100);
  },

  async changePassword(_currentPassword: string | undefined, _newPassword: string): Promise<{ ok: true }> {
    await delay(400);
    return { ok: true };
  },

  async getOverview(): Promise<DashboardOverview> {
    await delay();
    return mockOverview;
  },

  async getIntegrations(): Promise<Integration[]> {
    await delay();
    return integrationsState;
  },

  async getAuthorizeUrl(
    _platform: Integration["platform"]
  ): Promise<{ url: string | null }> {
    await delay(150);
    // No mock não há OAuth real; o card faz a conexão simulada.
    return { url: null };
  },

  async connectIntegration(platform: Integration["platform"]): Promise<Integration[]> {
    await delay(900);
    integrationsState = integrationsState.map((i) =>
      i.platform === platform
        ? { ...i, status: "connected", connectedAt: new Date().toISOString() }
        : i
    );
    return integrationsState;
  },

  async disconnectIntegration(
    platform: Integration["platform"]
  ): Promise<Integration[]> {
    await delay(500);
    integrationsState = integrationsState.map((i) =>
      i.platform === platform ? { ...i, status: "disconnected" } : i
    );
    return integrationsState;
  },

  async getProfile(): Promise<MediaKitProfile> {
    await delay();
    return profileState;
  },

  async updateProfile(data: Partial<MediaKitProfile>): Promise<MediaKitProfile> {
    await delay(700);
    profileState = { ...profileState, ...data };
    return profileState;
  },

  async getPublicMediaKit(username: string): Promise<PublicMediaKit | null> {
    await delay(200);
    return publicMediaKits[username] ?? null;
  },

  async requestQuote(
    _username: string,
    _data: QuoteRequest
  ): Promise<{ ok: true }> {
    await delay(800);
    return { ok: true };
  }
};
