import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted/20">
      <Skeleton className="h-48 w-full rounded-none sm:h-64" />
      <div className="container -mt-16 max-w-3xl">
        <div className="rounded-2xl border bg-background p-8">
          <div className="flex items-end gap-6">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="mt-6 h-16 w-full" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
