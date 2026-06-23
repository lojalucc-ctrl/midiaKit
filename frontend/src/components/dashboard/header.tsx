"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, LogOut, Loader2, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <p className="text-sm text-muted-foreground">Bem-vindo de volta,</p>
        <p className="font-semibold">{user?.name ?? "Criador"}</p>
      </div>
      <div className="flex items-center gap-3">
        {user?.username && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${user.username}`} target="_blank">
              Ver Mídia Kit
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                Encerrar sessão?
              </DialogTitle>
              <DialogDescription>
                Por segurança, ao sair encerramos sua sessão neste dispositivo e
                apagamos as credenciais em cache. Você precisará entrar novamente
                para acessar o painel — o botão “voltar” não reabrirá sua conta.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={logout.isPending}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                {logout.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Sair com segurança
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Avatar>
          <AvatarImage src={user?.avatarUrl} alt={user?.name ?? ""} />
          <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
