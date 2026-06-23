import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Deploy separado (front na Vercel, backend no Render): o cookie de sessão fica
// no domínio do backend, então o middleware do front NÃO consegue lê-lo. Por
// isso a proteção de rota é feita no cliente (AuthGuard + RedirectIfAuthed, que
// chamam /auth/me no backend). Aqui só aplicamos no-store para evitar que o
// botão "voltar" reexiba páginas autenticadas a partir do cache (bfcache).
function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export function middleware(_req: NextRequest) {
  return noStore(NextResponse.next());
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"]
};
