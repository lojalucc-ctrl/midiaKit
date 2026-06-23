"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";

// Se o usuário já está autenticado, não deve ver login/registro -> manda ao painel.
// Também trata restauração via bfcache (evento pageshow persisted) recarregando.
export function RedirectIfAuthed() {
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && user && typeof window !== "undefined") {
      window.location.replace("/dashboard");
    }
  }, [user, isLoading]);

  React.useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) window.location.reload();
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
