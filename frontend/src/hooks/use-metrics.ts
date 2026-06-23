"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/services";

/** Visão geral agregada das métricas das redes sincronizadas. */
export function useMetrics() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => api.getOverview(),
    staleTime: 60_000
  });
}
