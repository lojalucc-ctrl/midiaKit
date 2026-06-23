import dotenv from "dotenv";

// Em produção (Render/Vercel) as variáveis já vêm do ambiente — não há .env.
// Carregamos o .env apenas em desenvolvimento.
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

const backendUrl = process.env.BACKEND_PUBLIC_URL ?? "http://localhost:3333";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3333),
  backendUrl,
  databaseUrl: required("DATABASE_URL", "postgresql://localhost:5432/postgres"),
  jwtSecret: required("JWT_SECRET", "sua-chave-super-secreta"),
  encryptionKey: required("ENCRYPTION_KEY", "chave-32-bytes-para-aes-aaaaaaaa"),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  cookieDomain: process.env.COOKIE_DOMAIN ?? "localhost",
  isProd: (process.env.NODE_ENV ?? "development") === "production",
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      graphVersion: "v23.0"
    },
    meta: {
      clientId: process.env.META_CLIENT_ID ?? "",
      clientSecret: process.env.META_CLIENT_SECRET ?? "",
      graphVersion: process.env.META_GRAPH_VERSION ?? "v23.0"
    }
  }
};
