"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/services";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook de autenticação. A sessão é mantida por cookie HTTP-Only no backend —
 * o front nunca lê/armazena o token.
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
      toast({ variant: "success", title: "Sessão iniciada com segurança" });
      router.push("/dashboard");
    }
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
      toast({ variant: "success", title: "Conta criada", description: "Sessão iniciada com segurança." });
      router.push("/dashboard");
    }
  });

  // Logout seguro: apaga a sessão no servidor (cookie HTTP-Only), limpa TODO o
  // cache em memória e força navegação com replace() — assim o botão "voltar"
  // não retorna para a área logada.
  const logout = useMutation({
    mutationFn: () => api.logout(),
    onSettled: () => {
      qc.clear();
      if (typeof window !== "undefined") {
        window.location.replace("/login?loggedout=1");
      }
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
