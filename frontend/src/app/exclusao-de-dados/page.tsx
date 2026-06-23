import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Exclusão de Dados — MídiaKit",
  description: "Como solicitar a exclusão dos seus dados do MídiaKit."
};

export default function ExclusaoDeDadosPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">MídiaKit</span>
        </Link>
      </header>

      <main className="container max-w-3xl pb-20">
        <article className="rounded-2xl border bg-background p-8 leading-relaxed">
          <h1 className="text-3xl font-bold tracking-tight">Exclusão de Dados do Usuário</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Instruções para remover seus dados do MídiaKit.
          </p>

          <p className="mt-6 text-muted-foreground">
            Você tem o direito de excluir os dados associados à sua conta no
            MídiaKit, incluindo as informações obtidas das redes sociais conectadas
            (Instagram/Meta e Google/YouTube).
          </p>

          <h2 className="mt-8 text-xl font-semibold">Opção 1 — Desconectar uma rede</h2>
          <p className="mt-2 text-muted-foreground">
            Acesse <strong>Painel → Integrações</strong> e clique em
            “Desconectar” na rede desejada. Isso remove imediatamente os tokens de
            acesso e as métricas armazenadas daquela rede.
          </p>

          <h2 className="mt-8 text-xl font-semibold">Opção 2 — Excluir toda a conta e dados</h2>
          <p className="mt-2 text-muted-foreground">
            Para apagar permanentemente sua conta e todos os dados (perfil, métricas
            e tokens), envie um e-mail para{" "}
            <strong>exclusao@midiakit.exemplo.com</strong> a partir do e-mail
            cadastrado, com o assunto <em>“Excluir meus dados”</em>. Processaremos a
            solicitação em até <strong>30 dias</strong> e confirmaremos por e-mail.
          </p>

          <h2 className="mt-8 text-xl font-semibold">O que é removido</h2>
          <p className="mt-2 text-muted-foreground">
            Dados de conta (nome, e-mail, foto), perfil do mídia kit (bio, links,
            imagens), conexões OAuth e tokens criptografados, e todos os snapshots
            de métricas coletados.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Veja também a nossa{" "}
            <Link href="/privacidade" className="font-medium text-primary hover:underline">
              Política de Privacidade
            </Link>.
          </p>
        </article>
      </main>
    </div>
  );
}
