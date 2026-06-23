import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Palette,
  Plug,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Landing page comercial (Server Component).
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">MídiaKit</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center py-24 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Seu mídia kit profissional em minutos
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Transforme suas redes em{" "}
            <span className="text-primary">propostas de marcas</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Sincronize Instagram e YouTube, monte um mídia kit elegante e
            compartilhe um único link com agências e marcas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Começar grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/joao">Ver exemplo de mídia kit</Link>
            </Button>
          </div>
        </section>

        <section className="container grid gap-6 pb-24 md:grid-cols-3">
          <Feature
            icon={<Plug className="h-5 w-5" />}
            title="Integrações automáticas"
            desc="Conecte suas redes via OAuth seguro e mantenha as métricas sempre atualizadas."
          />
          <Feature
            icon={<Palette className="h-5 w-5" />}
            title="Totalmente personalizável"
            desc="Cores, bio, banner e links de portfólio com a sua identidade visual."
          />
          <Feature
            icon={<BarChart3 className="h-5 w-5" />}
            title="Métricas que vendem"
            desc="Seguidores, engajamento e alcance apresentados de forma clara e confiável."
          />
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
          <nav className="flex gap-4">
            <Link href="/privacidade" className="hover:text-foreground hover:underline">
              Política de Privacidade
            </Link>
            <Link href="/exclusao-de-dados" className="hover:text-foreground hover:underline">
              Exclusão de Dados
            </Link>
          </nav>
          <p>© {new Date().getFullYear()} MídiaKit. MVP de demonstração.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
