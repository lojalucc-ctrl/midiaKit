"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";

// Defesa em profundidade (além do middleware): se a verificação de sessão
// (/auth/me) falhar, redireciona para o login. Cobre o caso de cookie presente
// porém inválido/expirado e cenários cross-domain onde o middleware não enxerga
// o cookie do backend.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user && typeof window !== "undefined") {
      window.location.replace("/login?expired=1");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        Verificando sua sessão…
      </div>
    );
  }
  if (!user) return null;

  return <>{children}</>;
}
