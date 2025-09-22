import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Size = "sm" | "md";

const sizeClass = {
  sm: { card: "p-3", icon: "h-7 w-7", title: "h-2 w-16", value: "h-4 w-20" },
  md: { card: "p-5", icon: "h-9 w-9", title: "h-3 w-20", value: "h-5 w-24" },
};

export const CardSkeleton = ({
  size = "md",
  className,
}: {
  size?: Size;
  className?: string;
}) => {
  const s = sizeClass[size];
  return (
    <Card className={cn("border bg-card", className)}>
      <CardContent className={cn("flex items-center gap-3", s.card)}>
        <div className={cn("rounded-md bg-muted", s.icon)} />
        <div className="flex flex-col gap-2">
          <div className={cn("rounded bg-muted", s.title)} />
          <div className={cn("rounded bg-muted", s.value)} />
        </div>
      </CardContent>
    </Card>
  );
};

export const TableSkeleton = () => (
  <div className="overflow-x-auto rounded-2xl border">
    <div className="divide-y">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-3 p-3">
          {Array.from({ length: 5 }).map((__, j) => (
            <div
              key={j}
              className="h-4 w-full animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);
