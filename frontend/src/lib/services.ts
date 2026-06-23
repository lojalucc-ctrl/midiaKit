// Ponto único de acesso a dados. Alterna entre Back-End real e camada mock
// via NEXT_PUBLIC_USE_MOCK ("1" = mock). Padrão: real.
import { mockApi } from "@/lib/mock-api";
import { realApi } from "@/lib/real-api";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";

export const api = useMock ? mockApi : realApi;
