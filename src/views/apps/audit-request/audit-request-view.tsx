"use client";

import { Fragment, useState } from "react";
import { BadgeInfo, Edit, RefreshCw, Trash } from "lucide-react";
import { cx, formatDateShortID } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SurveillanceType } from "@/types/surveillance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { THEME } from "@/constant";
import { AuditRequestPagination } from "./audit-request-pagination";
import {
  AuditRequestProvider,
  useAuditRequest,
} from "@/context/audit-request-context";
import { getExpiryLevel, StageBadge } from "./audit-request-helpers";
import { AuditRequestFilters } from "./audit-request-filters";
import { AuditRequestSkeleton } from "./audit-request-skeleton";
import { AuditRequestEmpty } from "./audit-request-empty";
import {
  AUDIT_STAGE_ORDER,
  AuditRequestType,
  AuditStageApi,
  getStageLabelAuditRequest,
} from "@/types/audit-request";

export const AuditRequestView = ({
  data,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  isLoading,
  refetch,
  isFetching,
}: AuditRequestType & {
  refetch?: () => void;
  isFetching?: boolean;
}) => {
  return (
    <AuditRequestProvider data={data} onResetPage={() => onPageChange(1)}>
      <InnerView
        pagination={pagination}
        page={page}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        isLoading={isLoading}
        refetch={refetch}
        isFetching={isFetching}
      />
    </AuditRequestProvider>
  );
};

const InnerView = ({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  isLoading,
  refetch,
  isFetching,
}: Pick<
  SurveillanceType,
  | "pagination"
  | "page"
  | "limit"
  | "onPageChange"
  | "onLimitChange"
  | "isLoading"
> & {
  refetch?: () => void;
  isFetching?: boolean;
}) => {
  const { filtered } = useAuditRequest();

  const [tab, setTab] = useState<AuditStageApi>(AUDIT_STAGE_ORDER[0]);

  const MAX_VISIBLE_TABS = 6;
  const visibleStages = AUDIT_STAGE_ORDER.slice(0, MAX_VISIBLE_TABS);
  const overflowStages = AUDIT_STAGE_ORDER.slice(MAX_VISIBLE_TABS);

  const isCurrentInOverflow = overflowStages.includes(tab);

  const totalPages =
    Math.max(
      1,
      pagination?.total_pages ??
        Math.ceil((pagination?.total_count ?? 0) / Math.max(1, limit))
    ) || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Audit Request
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Pantau jadwal dan pengingat audit request secara terorganisir
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          aria-label="Refresh"
          onClick={() => refetch?.()}
          disabled={isFetching}
          title="Refresh data"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <AuditRequestFilters onPageChange={onPageChange} />

      <Tabs
        value={tab}
        onValueChange={(v: string) => {
          setTab(v as AuditStageApi);
          onPageChange(1);
        }}
        className="w-full"
      >
        <div className="flex w-full items-center gap-2 overflow-x-auto md:overflow-visible">
          <TabsList
            className="
              flex max-w-full gap-2 overflow-x-auto
              md:w-auto md:justify-start
            "
          >
            {visibleStages.map((stg) => (
              <TabsTrigger key={stg} value={stg} className="flex-shrink-0">
                {getStageLabelAuditRequest(stg)}
              </TabsTrigger>
            ))}
          </TabsList>

          {overflowStages.length > 0 && (
            <Select
              value={isCurrentInOverflow ? tab : ""}
              onValueChange={(v) => {
                setTab(v as AuditStageApi);
                onPageChange(1);
              }}
            >
              <SelectTrigger className="w-[170px] shrink-0">
                <SelectValue placeholder="Stage lainnya" />
              </SelectTrigger>
              <SelectContent>
                {overflowStages.map((stg) => (
                  <SelectItem key={stg} value={stg}>
                    {getStageLabelAuditRequest(stg)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {AUDIT_STAGE_ORDER.map((stage) => {
          const filteredByStage = filtered.filter(
            (c) => c.audit_stage === stage
          );

          return (
            <Fragment key={stage}>
              <TabsContent value={stage} className="mt-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BadgeInfo className="h-4 w-4" />
                      Table List
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading || isFetching ? (
                      <AuditRequestSkeleton />
                    ) : filteredByStage.length === 0 ? (
                      <AuditRequestEmpty />
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">
                              No. Sertifikat
                            </TableHead>
                            <TableHead className="w-[180px]">
                              ISO Standards
                            </TableHead>
                            <TableHead className="w-[180px]">Stage</TableHead>
                            <TableHead className="w-[180px]">
                              Tanggal Expired
                            </TableHead>
                            <TableHead className="text-center w-[180px]">
                              Aksi
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredByStage.map((c) => {
                            const today = new Date();
                            const todayStart = new Date(
                              today.getFullYear(),
                              today.getMonth(),
                              today.getDate()
                            );

                            let daysUntilExpiry = 0;
                            if (c.tgl_perkiraan_audit_selesai) {
                              const expiry = new Date(
                                c.tgl_perkiraan_audit_selesai
                              );
                              const expiryStart = new Date(
                                expiry.getFullYear(),
                                expiry.getMonth(),
                                expiry.getDate()
                              );
                              const diffMs =
                                expiryStart.getTime() - todayStart.getTime();
                              daysUntilExpiry = Math.ceil(
                                diffMs / (1000 * 60 * 60 * 24)
                              );
                            }

                            const level = getExpiryLevel(daysUntilExpiry);

                            const rowStyles = {
                              overdue: {
                                bg: "bg-red-100",
                                border: "border-l-8 border-l-red-600",
                                textColor: "text-red-700",
                                dateSize: "text-xl",
                                animation: "animate-pulse",
                              },
                              critical: {
                                bg: "bg-red-50",
                                border: "border-l-6 border-l-red-500",
                                textColor: "text-red-600",
                                dateSize: "text-lg",
                                animation: "",
                              },
                              warning: {
                                bg: "bg-orange-50",
                                border: "border-l-4 border-l-orange-500",
                                textColor: "text-orange-600",
                                dateSize: "text-base",
                                animation: "",
                              },
                              attention: {
                                bg: "bg-yellow-50",
                                border: "border-l-4 border-l-yellow-500",
                                textColor: "text-yellow-700",
                                dateSize: "text-base",
                                animation: "",
                              },
                              safe: {
                                bg: "hover:bg-muted/50",
                                border: "",
                                textColor: "",
                                dateSize: "text-base",
                                animation: "",
                              },
                            } as const;

                            const style = rowStyles[level];

                            return (
                              <TableRow
                                key={`row-${c.id}-${c.audit_stage}`}
                                className={cx(
                                  "transition-colors",
                                  style.bg,
                                  style.border,
                                  style.animation
                                )}
                              >
                                <TableCell className="font-semibold">
                                  {c.name}
                                </TableCell>

                                <TableCell>
                                  <div className="space-y-1">
                                    <p
                                      className={cx(
                                        "font-black leading-tight",
                                        level === "overdue"
                                          ? "text-xl text-red-600"
                                          : level === "critical"
                                          ? "text-lg text-red-500"
                                          : level === "warning"
                                          ? "text-lg text-orange-600"
                                          : level === "attention"
                                          ? "text-base text-yellow-700"
                                          : "text-base text-primary"
                                      )}
                                    >
                                      {(c.standards ?? [])
                                        .map((i) => i)
                                        .join(", ") || "-"}
                                    </p>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <StageBadge stage={c.audit_stage} />
                                </TableCell>

                                <TableCell className="whitespace-nowrap">
                                  <p
                                    className={cx(
                                      "font-black",
                                      style.dateSize,
                                      style.textColor // merah/kuning sesuai level
                                    )}
                                  >
                                    {formatDateShortID(
                                      c.tgl_perkiraan_audit_selesai
                                    )}
                                  </p>
                                </TableCell>

                                <TableCell>
                                  <div className="flex justify-center items-center gap-1">
                                    <div className="rounded-full shadow-sm hover:shadow-md transition-all flex items-centerfocus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer bg-green-500 hover:bg-green-200 hover:text-black">
                                      <Button
                                        size="sm"
                                        className="items-center justify-center flex"
                                      >
                                        <Edit className="mr-1.5 h-4 w-4" />
                                      </Button>
                                    </div>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="align-center items-center flex rounded-full border-muted-foreground/30
                hover:bg-destructive/10 hover:text-destructive
                focus-visible:ring-2 focus-visible:ring-destructive/40 cursor-pointer"
                                    >
                                      <Trash className="mr-1.5 h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Fragment>
          );
        })}
      </Tabs>

      <AuditRequestPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
        filteredCount={filtered.length}
        totalCount={pagination?.total_count ?? filtered.length}
        hasPrev={page > 1}
        hasNext={
          (typeof pagination?.has_next === "boolean"
            ? pagination.has_next
            : page < totalPages) && totalPages > 1
        }
      />
    </div>
  );
};
