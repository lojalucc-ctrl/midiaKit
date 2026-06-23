import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Estado vazio padrão (seção 4.2 do spec). Usado quando ainda não há dados,
 * ex.: usuário não conectou o Instagram. Recebe uma ilustração/ícone sutil,
 * título, descrição e uma ação (ex.: "Conectar Instagram Agora").
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
