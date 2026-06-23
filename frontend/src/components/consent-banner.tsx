"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "mk_consent_v1";

type Choice = "accepted" | "rejected";

// Banner de consentimento (LGPD/GDPR-friendly): não bloqueia a navegação,
// oferece Aceitar e Rejeitar com igual destaque, lembra a escolha e traz os
// links de Política de Privacidade e Exclusão de Dados.
export function ConsentBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(choice: Choice) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() })
      );
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de privacidade e cookies"
      className="fixed inset-x-0 bottom-0 z-[200] p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border bg-background p-4 shadow-lg sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Sua privacidade</p>
            <p className="mt-1">
              Usamos cookies <strong>essenciais</strong> para autenticação (sessão)
              e dados das suas redes apenas para montar seu mídia kit. Não vendemos
              seus dados. Você controla suas conexões e pode excluí-las quando quiser.
              Saiba mais na{" "}
              <Link href="/privacidade" className="font-medium text-primary hover:underline">
                Política de Privacidade
              </Link>{" "}
              e em{" "}
              <Link href="/exclusao-de-dados" className="font-medium text-primary hover:underline">
                Exclusão de Dados
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={() => decide("rejected")}
            aria-label="Fechar"
            className="ml-auto rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => decide("rejected")}>
            Rejeitar não essenciais
          </Button>
          <Button onClick={() => decide("accepted")}>Aceitar</Button>
        </div>
      </div>
    </div>
  );
}
