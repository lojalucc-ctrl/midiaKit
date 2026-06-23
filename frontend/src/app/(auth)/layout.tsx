import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AuthAlerts } from "@/components/auth/auth-alerts";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <RedirectIfAuthed />
      <AuthAlerts />
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">MídiaKit</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
