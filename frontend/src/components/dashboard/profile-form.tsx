"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { toast } from "@/components/ui/use-toast";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import { useProfile } from "@/hooks/use-profile";
import type { MediaKitProfile } from "@/types";

export function ProfileForm({ profile }: { profile: MediaKitProfile }) {
  const { update } = useProfile();

  // Imagens são gerenciadas fora do RHF (data URLs). undefined = sem alteração.
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined);
  const [bannerUrl, setBannerUrl] = React.useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location ?? "",
      brandColor: profile.brandColor,
      accentColor: profile.accentColor
    }
  });

  const brandColor = watch("brandColor");
  const accentColor = watch("accentColor");
  const imagesChanged = avatarUrl !== undefined || bannerUrl !== undefined;

  function onSubmit(values: ProfileValues) {
    const payload: Partial<MediaKitProfile> = { ...values };
    if (avatarUrl !== undefined) payload.avatarUrl = avatarUrl;
    if (bannerUrl !== undefined) payload.bannerUrl = bannerUrl;

    update.mutate(payload, {
      onSuccess: () => {
        setAvatarUrl(undefined);
        setBannerUrl(undefined);
        toast({
          variant: "success",
          title: "Perfil salvo!",
          description: "Tudo foi salvo e já aparece no seu Mídia Kit público."
        });
      },
      onError: () =>
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Não foi possível salvar. Tente novamente."
        })
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row">
          <ImageUploader
            label="Foto de perfil"
            initialUrl={profile.avatarUrl}
            aspect="square"
            onChange={(v) => setAvatarUrl(v ?? "")}
          />
          <div className="flex-1">
            <ImageUploader
              label="Banner"
              initialUrl={profile.bannerUrl}
              aspect="banner"
              onChange={(v) => setBannerUrl(v ?? "")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nome de exibição</Label>
            <Input id="displayName" {...register("displayName")} />
            {errors.displayName && (
              <p className="text-sm text-destructive">{errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} {...register("bio")} />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" placeholder="Cidade, País" {...register("location")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cores do tema</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <ColorField label="Cor principal" value={brandColor} register={register("brandColor")} error={errors.brandColor?.message} />
          <ColorField label="Cor de destaque" value={accentColor} register={register("accentColor")} error={errors.accentColor?.message} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={update.isPending || (!isDirty && !imagesChanged)}>
          {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}

function ColorField({
  label,
  value,
  register,
  error
}: {
  label: string;
  value: string;
  register: ReturnType<ReturnType<typeof useForm>["register"]>;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: value }} />
        <Input className="w-32 font-mono" {...register} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
