"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/services";
import type { Integration } from "@/types";

export function useIntegrations() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["integrations"],
    queryFn: () => api.getIntegrations()
  });

  const connect = useMutation({
    mutationFn: (platform: Integration["platform"]) =>
      api.connectIntegration(platform),
    onSuccess: (data) => qc.setQueryData(["integrations"], data)
  });

  const disconnect = useMutation({
    mutationFn: (platform: Integration["platform"]) =>
      api.disconnectIntegration(platform),
    onSuccess: (data) => qc.setQueryData(["integrations"], data)
  });

  return { ...query, connect, disconnect };
}
