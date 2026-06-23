import { prisma } from "../src/config/prisma";
import { hashPassword } from "../src/utils/password";
import { encrypt } from "../src/utils/crypto";

// Popula o banco com um criador de exemplo (usuário: joao@exemplo.com / senha: 123456).
async function main() {
  const email = "joao@exemplo.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Seed já aplicado. Pulando.");
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: await hashPassword("123456"),
      profile: {
        create: {
          usernameUrl: "joao",
          displayName: "João Silva",
          bio: "Criador de conteúdo sobre tecnologia, lifestyle e produtividade.",
          avatarUrl: "https://i.pravatar.cc/240?img=12",
          bannerUrl:
            "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1600&q=80",
          brandColor: "#6d28d9",
          accentColor: "#db2777",
          location: "São Paulo, Brasil",
          categories: ["Tecnologia", "Lifestyle", "Produtividade"],
          links: [
            { id: "l1", label: "Portfólio de campanhas", url: "https://exemplo.com/portfolio" },
            { id: "l2", label: "Mídia Kit em PDF", url: "https://exemplo.com/mediakit.pdf" }
          ]
        }
      }
    }
  });

  const ig = await prisma.oAuthConnection.create({
    data: {
      userId: user.id,
      provider: "instagram",
      accountId: "acct_instagram",
      accessTokenEncrypted: encrypt("seed-token-instagram"),
      refreshTokenEncrypted: encrypt("seed-refresh-instagram"),
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    }
  });
  await prisma.metricsSnapshot.create({
    data: {
      connectionId: ig.id,
      rawData: { followers: 184500, engagementRate: 4.7, avgViews: 62000, avgLikes: 8700, monthlyGrowth: 3.1 }
    }
  });

  const yt = await prisma.oAuthConnection.create({
    data: {
      userId: user.id,
      provider: "youtube",
      accountId: "acct_youtube",
      accessTokenEncrypted: encrypt("seed-token-youtube"),
      // Conexão expirada para demonstrar o alerta de reautenticação.
      tokenExpiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  });
  await prisma.metricsSnapshot.create({
    data: {
      connectionId: yt.id,
      rawData: { followers: 92300, engagementRate: 6.2, avgViews: 41000, avgLikes: 3500, monthlyGrowth: 2.4 }
    }
  });

  console.log("✅ Seed aplicado: usuário joao@exemplo.com / senha 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
