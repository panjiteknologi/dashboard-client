import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Size = "sm" | "md";

const sizeClass = {
  sm: {
    card: "p-3",
    gap: "gap-2",
    title: "text-[10px] font-medium tracking-wide text-muted-foreground",
    value: "text-xl font-semibold leading-none",
    iconWrap: "size-7 rounded-md",
    icon: "size-4",
  },
  md: {
    card: "p-5",
    gap: "gap-3",
    title: "text-xs font-medium text-muted-foreground",
    value: "text-2xl font-semibold",
    iconWrap: "size-9 rounded-lg",
    icon: "size-5",
  },
};

export function DashboardCard({
  title,
  value,
  icon: Icon,
  tooltip,
  size = "md",
  className,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tooltip?: string;
  size?: Size;
  className?: string;
}) {
  const s = sizeClass[size];

  const content = (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card transition-all",
        "hover:shadow-lg hover:border-primary/40",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <CardContent className={cn("flex items-center", s.card, s.gap)}>
        <div
          className={cn(
            "flex items-center justify-center bg-muted",
            s.iconWrap
          )}
        >
          <Icon className={cn(s.icon)} />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className={cn(s.title)}>{title}</div>
          <div className={cn(s.value, "truncate")}>{value}</div>
        </div>
      </CardContent>
    </Card>
  );

  if (!tooltip) return content;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
