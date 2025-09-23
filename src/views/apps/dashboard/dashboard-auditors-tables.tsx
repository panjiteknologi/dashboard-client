/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatNumberID } from "@/utils";
import { TableSkeleton } from "./dashboard-skeleton";
import { DashboardEmpty } from "./dashboard-empty";
import { DashboardRoleBadges } from "./dashboard-roles-badge";

export const DashboardAuditorsTable = ({
  loading,
  data,
}: {
  loading: boolean;
  data: any[];
}) => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-0">
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table className="[&_th]:whitespace-nowrap">
              <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <TableRow>
                  <TableHead className="w-[28%]">Nama</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead className="text-right"># Proyek</TableHead>
                  <TableHead>Terakhir Audit</TableHead>
                  <TableHead>Standar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <DashboardEmpty title="Tidak ada auditor sesuai filter" />
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((a: any, idx: number) => (
                    <TableRow
                      key={a.id}
                      className={idx % 2 === 1 ? "bg-muted/30" : ""}
                    >
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>
                        <DashboardRoleBadges roles={a.roles} />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumberID(a.projects_count)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm leading-tight">
                          <div>{a.last_audit_start ?? "—"}</div>
                          <div className="text-muted-foreground">
                            s/d {a.last_audit_end ?? "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(a.iso_standards ?? []).map((s: string) => (
                            <Badge
                              key={s}
                              variant="outline"
                              className="rounded-full"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
