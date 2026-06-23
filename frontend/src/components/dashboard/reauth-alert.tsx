import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Alerta visual exibido na Visão Geral quando uma integração exige reautenticação. */
export function ReauthAlert() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-900">
            Uma integração precisa de reautenticação
          </p>
          <p className="text-sm text-amber-700">
            Reconecte para manter suas métricas atualizadas no Mídia Kit.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" asChild className="border-amber-300">
        <Link href="/dashboard/integracoes">Resolver agora</Link>
      </Button>
    </div>
  );
}
