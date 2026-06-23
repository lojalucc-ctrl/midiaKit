"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, Link2, Link2Off } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlatformIcon, platformLabel } from "@/components/social-meta";
import { toast } from "@/components/ui/use-toast";
import { useIntegrations } from "@/hooks/use-integrations";
import { api } from "@/lib/services";
import { openOAuthPopup } from "@/lib/oauth-popup";
import type { Integration } from "@/types";

const providerLabel: Record<Integration["provider"], string> = {
  google: "Google OAuth",
  meta: "Meta OAuth"
};

export function IntegrationCard({ integration }: { integration: Integration }) {
  const { connect, disconnect } = useIntegrations();
  const qc = useQueryClient();
  const [busy, setBusy] = React.useState(false);
  const working = busy || connect.isPending || disconnect.isPending;

  // Conecta: se houver OAuth real, abre o consentimento numa POPUP. Ao concluir,
  // o backend fecha a janela e avisa o app, que atualiza os dados sem sair da tela.
  async function handleConnect() {
    try {
      setBusy(true);
      const { url } = await api.getAuthorizeUrl(integration.platform);

      if (url) {
        const result = await openOAuthPopup(url);
        if (result.status === "connected") {
          await qc.invalidateQueries({ queryKey: ["integrations"] });
          await qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
          toast({
            variant: "success",
            title: "Conta conectada!",
            description: `${platformLabel[integration.platform]} sincronizado com sucesso.`
          });
        } else if (result.status === "error") {
          toast({
            variant: "destructive",
            title: "Não foi possível conectar",
            description: result.message || "Tente novamente."
          });
        }
        // status "closed": usuário fechou a janela — não faz nada.
        setBusy(false);
        return;
      }

      // Sem OAuth real (ex.: tiktok): conexão simulada.
      setBusy(false);
      connect.mutate(integration.platform, {
        onSuccess: () =>
          toast({
            variant: "success",
            title: "Conectado!",
            description: `${platformLabel[integration.platform]} sincronizado.`
          }),
        onError: () =>
          toast({ variant: "destructive", title: "Falha ao conectar" })
      });
    } catch {
      setBusy(false);
      toast({
        variant: "destructive",
        title: "Falha ao iniciar conexão",
        description: "Verifique se o backend está rodando."
      });
    }
  }

  function handleDisconnect() {
    disconnect.mutate(integration.platform, {
      onSuccess: () =>
        toast({
          title: "Desconectado",
          description: `${platformLabel[integration.platform]} foi removido e o token apagado.`
        })
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <PlatformIcon platform={integration.platform} className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{platformLabel[integration.platform]}</p>
              <StatusBadge status={integration.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {integration.handle ?? "Não conectado"} ·{" "}
              {providerLabel[integration.provider]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {integration.status === "connected" && (
            <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={working}>
              {disconnect.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link2Off className="h-4 w-4" />
              )}
              Desconectar
            </Button>
          )}
          {integration.status === "needs_reauth" && (
            <Button size="sm" onClick={handleConnect} disabled={working}>
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Reautenticar
            </Button>
          )}
          {integration.status === "disconnected" && (
            <Button size="sm" onClick={handleConnect} disabled={working}>
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              Conectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Integration["status"] }) {
  if (status === "connected") return <Badge variant="success">Conectado</Badge>;
  if (status === "needs_reauth") return <Badge variant="warning">Requer reautenticação</Badge>;
  return <Badge variant="secondary">Desconectado</Badge>;
}
