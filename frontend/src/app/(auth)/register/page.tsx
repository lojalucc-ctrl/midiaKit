"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";
import { SecurityNotice } from "@/components/auth/security-notice";
import { registerSchema, type RegisterValues } from "@/lib/validations";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>
          Comece a montar o seu mídia kit profissional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleButton />

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">ou</span>
          <Separator className="flex-1" />
        </div>

        <form
          onSubmit={handleSubmit((v) =>
            registerUser.mutate({
              name: v.name,
              email: v.email,
              password: v.password
            })
          )}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Seu nome" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@exemplo.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={registerUser.isPending}
          >
            {registerUser.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Criar conta
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
        <SecurityNotice />
      </CardContent>
    </Card>
  );
}
