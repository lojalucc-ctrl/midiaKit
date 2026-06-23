// Cliente HTTP. O backend (Express) roda em outro domínio (Render).
// Defina NEXT_PUBLIC_API_URL com a URL do backend (ex.: https://midiakit-backend.onrender.com).
// - Navegador: usa NEXT_PUBLIC_API_URL (cookies cross-site via SameSite=None).
// - Server Components: usa API_INTERNAL_URL (ou NEXT_PUBLIC_API_URL) — URL absoluta.
const CLIENT_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
const SERVER_BASE =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export const API_URL = typeof window === "undefined" ? SERVER_BASE : CLIENT_BASE;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) }
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      /* sem corpo JSON */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
