import { FileWarning } from "lucide-react";

export const DashboardEmpty = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border p-10 text-center">
    <FileWarning className="mb-3 h-8 w-8 text-muted-foreground" />
    <p className="font-medium">{title}</p>
    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
  </div>
);
