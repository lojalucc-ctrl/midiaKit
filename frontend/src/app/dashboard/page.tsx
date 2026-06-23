"use client";

import { Users, Activity, Eye, Plug } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ReauthAlert } from "@/components/dashboard/reauth-alert";
import { StatBlock } from "@/components/mediakit/stat-block";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCompact, formatPercent } from "@/lib/utils";
import { useMetrics } from "@/hooks/use-metrics";

export default function DashboardOverviewPage() {
  const { data, isLoading } = useMetrics();

  if (isLoading) return <OverviewSkeleton />;
  if (!data) return null;

  const hasNetworks = data.metrics.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">
          Métricas agregadas das suas redes sincronizadas.
        </p>
      </div>

      {data.needsReauth && <ReauthAlert />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total de seguidores"
          value={formatCompact(data.totalFollowers)}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          label="Engajamento médio"
          value={formatPercent(data.avgEngagementRate)}
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          label="Views médias"
          value={formatCompact(data.totalAvgViews)}
          icon={<Eye className="h-5 w-5" />}
        />
        <MetricCard
          label="Redes conectadas"
          value={String(data.connectedNetworks)}
          icon={<Plug className="h-5 w-5" />}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Desempenho por rede</h2>
        {hasNetworks ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.metrics.map((m) => (
              <StatBlock key={m.platform} metric={m} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Plug className="h-6 w-6" />}
            title="Nenhuma rede conectada ainda"
            description="Conecte suas redes sociais para ver suas métricas agregadas aqui."
            action={
              <Button asChild>
                <Link href="/dashboard/integracoes">Conectar agora</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
