import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ShieldCheck, UsersRound } from "lucide-react";
import { formatDateID } from "@/utils";

type AuditorItem = {
  name: string;
  roles: string[];
  iso_standards: string[];
  last_audit_start: string | null;
  last_audit_end: string | null;
  projects_count: number;
};

export const AuditorsCard = ({ data }: { data: AuditorItem[] }) => {
  return (
    <div className="grid auto-rows-fr gap-4 sm:gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
      {data?.map((a, index) => {
        const initials =
          a?.name
            ?.split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase())
            .join("") || "AU";

        return (
          <Card
            key={index}
            className="group relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur transition hover:shadow-lg hover:ring-1 hover:ring-border"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />

            <CardHeader className="flex flex-row items-start gap-3 pb-3 pt-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border bg-muted text-sm font-semibold tracking-wide ring-1 ring-border/60 group-hover:ring-primary/40">
                {initials}
              </div>

              <div className="min-w-0">
                <CardTitle
                  className="line-clamp-1 text-base font-semibold leading-tight"
                  title={a.name}
                >
                  {a.name}
                </CardTitle>

                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <UsersRound className="h-3.5 w-3.5 opacity-70" />
                    {Array.isArray(a.roles) && a.roles.length > 0
                      ? a.roles[0].replaceAll("_", " ")
                      : "—"}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    Projects:
                    <Badge className="ml-0.5 h-5 px-2">
                      {a.projects_count}
                    </Badge>
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-5">
              <div className="flex items-start gap-2">
                <UsersRound className="mt-0.5 h-4 w-4 opacity-70" />
                <div className="min-w-0">
                  <span className="mr-2 text-muted-foreground">Role:</span>
                  <div className="mt-1 flex max-h-16 flex-wrap gap-1 overflow-auto pr-1">
                    {Array.isArray(a.roles) && a.roles.length > 0 ? (
                      a.roles.map((r) => (
                        <Badge
                          key={r}
                          variant="secondary"
                          className="capitalize"
                        >
                          {r.replaceAll("_", " ")}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 opacity-70" />
                <div className="min-w-0">
                  <span className="mr-2 text-muted-foreground">ISO:</span>
                  <div className="mt-1 flex max-h-16 flex-wrap gap-1 overflow-auto pr-1">
                    {Array.isArray(a.iso_standards) &&
                    a.iso_standards.length > 0 ? (
                      a.iso_standards.map((s, i) => (
                        <Badge key={`${s}-${i}`} variant="outline" title={s}>
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 opacity-70" />
                <span className="truncate">
                  Last audit: {formatDateID(a.last_audit_start)} –{" "}
                  {formatDateID(a.last_audit_end)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
