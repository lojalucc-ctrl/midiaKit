"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/services";
import { toast } from "@/components/ui/use-toast";

function msg(error: unknown): string {
  return error instanceof Error ? error.message : "Tente novamente.";
}

/**
 * Autenticação. Sessão por cookie HTTP-Only no backend — o front nunca
 * lê/armazena o token.
 */
export function useAuth() {
  const router = useRouter();
  const qc = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: () => api.getCurrentUser(),
    retry: false,
    staleTime: 30_000
  });

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: ({ user }) => {
      qc.setQueryData(["current-user"], user);
      toast({ variant: "success", title: "Login efetuado", description: "Bem-vindo de volta!" });
      router.push("/dashboard");
    },
    onError: (error) =>
      toast({ variant: "destructive", title: "Não foi possível entrar", description: msg(error) })
  });

  const register = useMutation({
    mutationFn: ({
      name,
      email,
      password
    }: {
      name: string;
      email: string;
      password: string;
    }) => api.register(name, email, password),
    onSuccess: ({ user }) => {
      qc.setQueryData(["current-user"], user);
      toast({
        variant: "success",
        title: "Conta criada com sucesso!",
        description: "Você já está conectado."
      });
      router.push("/dashboard");
    },
    onError: (error) =>
      toast({ variant: "destructive", title: "Não foi possível criar a conta", description: msg(error) })
  });

  // Logout seguro: encerra a sessão no servidor (apaga o cookie), limpa o cache
  // e navega com replace().
  const logout = useMutation({
    mutationFn: () => api.logout(),
    onSettled: () => {
      qc.clear();
      if (typeof window !== "undefined") window.location.replace("/login?loggedout=1");
    }
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login,
    register,
    logout
  };
}
