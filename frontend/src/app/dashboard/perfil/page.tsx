"use client";

import { ProfileForm } from "@/components/dashboard/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";

export default function PerfilPage() {
  const { data, isLoading } = useProfile();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil do Mídia Kit</h1>
        <p className="text-muted-foreground">
          Configure bio, cores, imagens e links de portfólio da sua vitrine
          pública.
        </p>
      </div>

      {isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <ProfileForm profile={data} />
      )}
    </div>
  );
}
