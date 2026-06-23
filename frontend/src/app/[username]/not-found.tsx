import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Mídia Kit não encontrado</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        O perfil que você procura não existe ou ainda não foi publicado.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Voltar à página inicial</Link>
      </Button>
    </div>
  );
}
