"use client";

import * as React from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { ApiError } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, staleTime: 30_000, retry: false }
        },
        // Alerta global de sessão expirada: qualquer 401 dentro da área logada
        // notifica o usuário e o leva ao login com a sessão limpa.
        queryCache: new QueryCache({
          onError: (error) => {
            if (
              error instanceof ApiError &&
              error.status === 401 &&
              typeof window !== "undefined" &&
              window.location.pathname.startsWith("/dashboard")
            ) {
              toast({
                variant: "destructive",
                title: "Sessão expirada",
                description: "Por segurança, faça login novamente."
              });
              window.location.replace("/login?expired=1");
            }
          }
        })
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
