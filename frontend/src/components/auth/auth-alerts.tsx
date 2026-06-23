"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

// Mostra alertas ao chegar no login/registro via redirecionamentos de segurança.
function AuthAlertsInner() {
  const params = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const expired = params.get("expired");
    const loggedout = params.get("loggedout");
    const error = params.get("error");

    if (loggedout) {
      toast({
        variant: "success",
        title: "Você saiu com segurança",
        description: "Sua sessão foi encerrada e as credenciais foram apagadas deste dispositivo."
      });
    } else if (expired) {
      toast({
        variant: "destructive",
        title: "Sessão encerrada",
        description: "Faça login novamente para continuar."
      });
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Não foi possível autenticar",
        description: decodeURIComponent(error)
      });
    }
    if (expired || loggedout || error) {
      router.replace(window.location.pathname);
    }
  }, [params, router]);

  return null;
}

export function AuthAlerts() {
  return (
    <React.Suspense fallback={null}>
      <AuthAlertsInner />
    </React.Suspense>
  );
}
