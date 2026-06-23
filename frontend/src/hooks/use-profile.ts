"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/services";
import type { MediaKitProfile } from "@/types";

export function useProfile() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getProfile()
  });

  const update = useMutation({
    mutationFn: (data: Partial<MediaKitProfile>) => api.updateProfile(data),
    onSuccess: (data) => qc.setQueryData(["profile"], data)
  });

  return { ...query, update };
}
