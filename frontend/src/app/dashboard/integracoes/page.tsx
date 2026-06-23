"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { IntegrationCard } from "@/components/dashboard/integration-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIntegrations } from "@/hooks/use-integrations";

function IntegracoesContent() {
  const { data, isLoading } = useIntegrations();
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();

  // Trata o retorno do OAuth (?connected=instagram ou ?error=...).
  React.useEffect(() => {
    const connected = params.get("connected");
    const error = params.get("error");
    if (connected) {
      toast({
        variant: "success",
        title: "Conta conectada!",
        description: `${connected} sincronizado com sucesso.`
      });
      qc.invalidateQueries({ queryKey: ["integrations"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
      router.replace("/dashboard/integracoes");
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Não foi possível conectar",
        description: decodeURIComponent(error)
      });
      router.replace("/dashboard/integracoes");
    }
  }, [params, qc, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte suas redes via OAuth seguro (Google / Meta). Os tokens ficam
          protegidos no backend — nunca no navegador.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold">Suas credenciais estão protegidas</p>
          <p className="text-emerald-800">
            Autenticamos via OAuth oficial e guardamos os tokens criptografados
            (AES-256). Não temos acesso à sua senha. Você pode revogar qualquer
            conexão a qualquer momento clicando em “Desconectar”.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((integration) => (
            <IntegrationCard key={integration.platform} integration={integration} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function IntegracoesPage() {
  return (
    <React.Suspense fallback={null}>
      <IntegracoesContent />
    </React.Suspense>
  );
}
