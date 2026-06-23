import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatBlock } from "@/components/mediakit/stat-block";
import { RequestQuoteButton } from "@/components/mediakit/request-quote-button";
import { api } from "@/lib/services";

// Rota pública do Mídia Kit. Majoritariamente Server Component: os dados são
// buscados no servidor, então a página chega pronta (HTML/CSS) ao visitante,
// garantindo carregamento rápido e bom SEO (seção 4.1 do spec).

// Sempre buscar dados frescos (reflete alterações de perfil na hora).
export const dynamic = "force-dynamic";

type Props = { params: { username: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const kit = await api.getPublicMediaKit(params.username);
  if (!kit) return { title: "Mídia Kit não encontrado" };
  return {
    title: `${kit.profile.displayName} — Mídia Kit`,
    description: kit.profile.bio,
    openGraph: {
      title: `${kit.profile.displayName} — Mídia Kit`,
      description: kit.profile.bio,
      images: kit.profile.bannerUrl ? [kit.profile.bannerUrl] : []
    }
  };
}

export default async function PublicMediaKitPage({ params }: Props) {
  const kit = await api.getPublicMediaKit(params.username);
  if (!kit) notFound();

  const { profile, metrics, contactEmail } = kit;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Banner */}
      <div className="relative h-48 w-full sm:h-64">
        {profile.bannerUrl && (
          <Image
            src={profile.bannerUrl}
            alt={`Banner de ${profile.displayName}`}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 40%, ${profile.brandColor}22 100%)`
          }}
        />
      </div>

      <div className="container -mt-16 max-w-3xl">
        {/* Cabeçalho do perfil */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
            <div
              className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-md"
              style={{ borderColor: profile.brandColor }}
            >
              {profile.avatarUrl && (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  fill
                  unoptimized
                  sizes="112px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="mt-4 sm:ml-6 sm:mt-0">
              <h1 className="text-2xl font-bold tracking-tight">
                {profile.displayName}
              </h1>
              {profile.location && (
                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </p>
              )}
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {profile.categories.map((c) => (
                  <Badge
                    key={c}
                    variant="outline"
                    style={{ borderColor: profile.accentColor, color: profile.accentColor }}
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-muted-foreground sm:text-left">
            {profile.bio}
          </p>

          <div className="mt-6 flex justify-center sm:justify-start">
            <RequestQuoteButton
              username={profile.username}
              brandColor={profile.brandColor}
              contactEmail={contactEmail}
            />
          </div>
        </div>

        {/* Métricas */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Audiência</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((m) => (
              <StatBlock key={m.platform} metric={m} />
            ))}
          </div>
        </section>

        {/* Links de portfólio */}
        {profile.links.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Portfólio</h2>
            <div className="space-y-2">
              {profile.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {link.label}
                  <span style={{ color: profile.accentColor }}>→</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
