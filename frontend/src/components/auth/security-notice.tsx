import { ShieldCheck } from "lucide-react";

// Aviso de segurança exibido nas telas de autenticação.
export function SecurityNotice() {
  return (
    <p className="mt-4 flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>
        Conexão segura. Sua sessão usa cookies <strong>HTTP-Only</strong> e nunca
        guardamos as senhas das suas redes sociais. Os tokens de acesso ficam
        criptografados no servidor.
      </span>
    </p>
  );
}
