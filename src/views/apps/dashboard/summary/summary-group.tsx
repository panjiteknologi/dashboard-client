import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SummaryGroup = ({
  title,
  items,
  icon,
}: {
  title: string;
  items: { label: string; value: number }[];
  icon: React.ReactNode;
}) => {
  const nf = new Intl.NumberFormat("id-ID");

  return (
    <Card className="rounded-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((it, i) => (
          <div
            key={`${it.label}-${i}`}
            className="flex items-center justify-between rounded-md border bg-muted/40 px-2 py-1.5 text-xs"
          >
            <span className="truncate pr-2">{it.label}</span>
            <span className="font-semibold">{nf.format(it.value)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
