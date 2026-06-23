import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Zero layout shift: tipografia carregada via next/font (seção 5 do spec).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "MídiaKit — Plataforma de Mídia Kit para Criadores",
  description:
    "Crie um mídia kit profissional, sincronize suas redes e receba propostas de marcas."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
