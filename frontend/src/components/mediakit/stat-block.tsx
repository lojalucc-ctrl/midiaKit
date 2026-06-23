import { formatCompact, formatPercent } from "@/lib/utils";
import { PlatformIcon, platformLabel } from "@/components/social-meta";
import type { SocialMetrics } from "@/types";

/** Bloco de métricas de uma rede no mídia kit público (Server Component). */
export function StatBlock({ metric }: { metric: SocialMetrics }) {
  return (
    <div className="rounded-xl border bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <PlatformIcon platform={metric.platform} className="h-5 w-5" />
        <div>
          <p className="font-semibold leading-tight">
            {platformLabel[metric.platform]}
          </p>
          <p className="text-xs text-muted-foreground">{metric.handle}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat value={formatCompact(metric.followers)} label="Seguidores" />
        <Stat value={formatPercent(metric.engagementRate)} label="Engajamento" />
        <Stat
          value={metric.avgViews ? formatCompact(metric.avgViews) : "—"}
          label="Views médias"
        />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-xl font-bold tracking-tight">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
