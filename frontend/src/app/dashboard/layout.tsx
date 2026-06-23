import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AuthGuard } from "@/components/dashboard/auth-guard";

// Sempre dinâmico: nunca servir a área logada de cache estático.
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
