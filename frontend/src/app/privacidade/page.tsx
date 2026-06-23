import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade — MídiaKit",
  description: "Como o MídiaKit coleta, usa e protege seus dados."
};

export default function PrivacidadePage() {
  const hoje = new Date().toLocaleDateString("pt-BR");
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
          <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
          <p className="mt-2 text-sm text-muted-foreground">Última atualização: {hoje}</p>

          <h2 className="mt-8 text-xl font-semibold">1. Quem somos</h2>
          <p className="mt-2 text-muted-foreground">
            O MídiaKit é uma plataforma que permite a criadores de conteúdo montar
            um mídia kit profissional, conectando suas redes sociais para exibir
            métricas públicas a marcas e agências.
          </p>

          <h2 className="mt-8 text-xl font-semibold">2. Dados que coletamos</h2>
          <p className="mt-2 text-muted-foreground">
            Coletamos: (a) dados de conta — nome, e-mail e foto de perfil, inclusive
            via login social (Google); (b) dados das redes conectadas via OAuth
            (Instagram/Meta, YouTube/Google), como nome de usuário, número de
            seguidores e métricas públicas de engajamento; (c) conteúdo que você
            adiciona ao seu mídia kit (bio, links, imagens).
          </p>

          <h2 className="mt-8 text-xl font-semibold">3. Como usamos os dados</h2>
          <p className="mt-2 text-muted-foreground">
            Usamos os dados exclusivamente para montar e exibir seu mídia kit
            público, apresentar suas métricas agregadas no painel e permitir que
            marcas entrem em contato. Não vendemos seus dados a terceiros.
          </p>

          <h2 className="mt-8 text-xl font-semibold">4. Tokens de acesso e segurança</h2>
          <p className="mt-2 text-muted-foreground">
            Os tokens de acesso das redes sociais são armazenados de forma
            criptografada (AES-256) no servidor e nunca são expostos ao navegador.
            A sessão é mantida por cookie HTTP-Only. Não solicitamos nem
            armazenamos senhas das suas redes sociais.
          </p>

          <h2 className="mt-8 text-xl font-semibold">5. Compartilhamento</h2>
          <p className="mt-2 text-muted-foreground">
            As informações do seu mídia kit que você optar por publicar ficam
            visíveis publicamente na sua página (ex.: seusite.com/seu-usuario).
            Os dados sensíveis (tokens) nunca são compartilhados.
          </p>

          <h2 className="mt-8 text-xl font-semibold">6. Seus direitos e exclusão de dados</h2>
          <p className="mt-2 text-muted-foreground">
            Você pode desconectar qualquer rede a qualquer momento pelo painel, o
            que remove os tokens correspondentes. Para excluir completamente sua
            conta e todos os dados, consulte a nossa{" "}
            <Link href="/exclusao-de-dados" className="font-medium text-primary hover:underline">
              página de Exclusão de Dados
            </Link>.
          </p>

          <h2 className="mt-8 text-xl font-semibold">7. Contato</h2>
          <p className="mt-2 text-muted-foreground">
            Dúvidas sobre privacidade: <strong>privacidade@midiakit.exemplo.com</strong>.
          </p>
        </article>
      </main>
    </div>
  );
}
