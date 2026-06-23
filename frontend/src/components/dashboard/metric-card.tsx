import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
  icon
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
