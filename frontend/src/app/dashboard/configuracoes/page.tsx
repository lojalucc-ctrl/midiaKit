"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, KeyRound, Save } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { api } from "@/lib/services";

const pwSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "Mínimo de 6 caracteres"),
    confirm: z.string()
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"]
  });
type PwValues = z.infer<typeof pwSchema>;

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const { data: profile, update } = useProfile();
  const qc = useQueryClient();
  const [avatar, setAvatar] = React.useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<PwValues>({ resolver: zodResolver(pwSchema) });

  const changePw = useMutation({
    mutationFn: (v: PwValues) => api.changePassword(v.currentPassword, v.newPassword),
    onSuccess: () => {
      toast({ variant: "success", title: "Senha alterada", description: "Sua nova senha já está valendo." });
      reset();
    },
    onError: (e) => {
      const m = e instanceof Error ? e.message : "Tente novamente.";
      // Erro relacionado à senha atual -> destaca no campo.
      if (/atual/i.test(m)) {
        setError("currentPassword", { type: "server", message: m });
      }
      toast({ variant: "destructive", title: "Não foi possível alterar a senha", description: m });
    }
  });

  function saveAvatar() {
    if (avatar === undefined) return;
    update.mutate(
      { avatarUrl: avatar },
      {
        onSuccess: () => {
          setAvatar(undefined);
          qc.invalidateQueries({ queryKey: ["current-user"] });
          toast({ variant: "success", title: "Foto da conta atualizada" });
        },
        onError: () => toast({ variant: "destructive", title: "Erro ao salvar a foto" })
      }
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações da conta</h1>
        <p className="text-muted-foreground">Gerencie seu acesso e os dados da conta.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
          <CardDescription>E-mail: {user?.email ?? "—"}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <ImageUploader
            label="Foto da conta"
            initialUrl={profile?.avatarUrl}
            aspect="square"
            onChange={(v) => setAvatar(v ?? "")}
          />
          <Button onClick={saveAvatar} disabled={avatar === undefined || update.isPending}>
            {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar foto
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Alterar senha
          </CardTitle>
          <CardDescription>
            Se você entrou com Google e ainda não tem senha, pode definir uma aqui
            (deixe a senha atual em branco).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((v) => changePw.mutate(v))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <PasswordInput id="currentPassword" {...register("currentPassword")} />
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <PasswordInput id="newPassword" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar nova senha</Label>
              <PasswordInput id="confirm" {...register("confirm")} />
              {errors.confirm && (
                <p className="text-sm text-destructive">{errors.confirm.message}</p>
              )}
            </div>
            <Button type="submit" disabled={changePw.isPending}>
              {changePw.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Alterar senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
