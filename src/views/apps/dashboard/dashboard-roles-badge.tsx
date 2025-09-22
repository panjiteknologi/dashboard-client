import { Badge } from "@/components/ui/badge";
import { DashboardRoleLabel } from "@/constant";

export const DashboardRoleBadges = ({ roles }: { roles: string[] }) => {
  if (!Array.isArray(roles) || roles.length === 0)
    return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <Badge
          key={r}
          variant="secondary"
          className="rounded-full px-2 py-0.5 text-[11px]"
        >
          {DashboardRoleLabel[r] ?? r}
        </Badge>
      ))}
    </div>
  );
};
