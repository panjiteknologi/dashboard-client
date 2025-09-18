import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SummarySkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-3">
              <div className="h-5 w-24 rounded bg-muted" />
              <div className="mt-2 h-6 w-16 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="py-3">
            <div className="h-5 w-40 rounded bg-muted" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 8 }).map((__, j) => (
              <div key={j} className="h-7 rounded bg-muted" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
