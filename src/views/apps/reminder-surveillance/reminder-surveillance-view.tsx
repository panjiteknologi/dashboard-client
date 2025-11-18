'use client';

import { useState } from 'react';
import { BadgeInfo, RefreshCw } from 'lucide-react';
import { cx, formatDateShortID } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { SurveillanceType } from '@/types/surveillance';
import {
  StageBadge,
  UrgencyBadge,
  getExpiryLevel,
  daysStatusText,
  StatusExpiryBadge
} from './reminder-surveillance-helpers';
import { ReminderSurveillanceCard } from './reminder-surveillance-card';
import { ReminderSurveillanceEmpty } from './reminder-surveillance-empty';
import { ReminderSurveillanceSkeleton } from './reminder-surveillance-skeleton';
import { ReminderSurveillanceFilters } from './reminder-surveillance-filters';
import {
  ReminderSurveillanceProvider,
  useReminderSurveillance
} from '@/context/surveillance-context';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { THEME } from '@/constant';
import { ReminderSurveillancePagination } from './reminder-surveillance-pagination';

export const ReminderSurveillanceView = ({
  data,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  isLoading,
  refetch,
  isFetching
}: SurveillanceType & {
  refetch?: () => void;
  isFetching?: boolean;
}) => {
  return (
    <ReminderSurveillanceProvider
      data={data}
      onResetPage={() => onPageChange(1)}
    >
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
    </ReminderSurveillanceProvider>
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
  isFetching
}: Pick<
  SurveillanceType,
  | 'pagination'
  | 'page'
  | 'limit'
  | 'onPageChange'
  | 'onLimitChange'
  | 'isLoading'
> & {
  refetch?: () => void;
  isFetching?: boolean;
}) => {
  const { filtered } = useReminderSurveillance();
  const [tab, setTab] = useState<'cards' | 'table'>('table');

  const totalPages =
    Math.max(
      1,
      pagination?.total_pages ??
        Math.ceil((pagination?.total_count ?? 0) / Math.max(1, limit))
    ) || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cx(
              'text-xl font-bold leading-tight tracking-tight',
              THEME.headerText
            )}
          >
            Reminder Surveillance
          </h1>
          <p className={cx('text-sm', THEME.subText)}>
            Pantau jadwal dan pengingat surveillance audit secara terorganisir
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
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <ReminderSurveillanceFilters onPageChange={onPageChange} />

      {isLoading || isFetching ? (
        <ReminderSurveillanceSkeleton />
      ) : filtered.length === 0 ? (
        <ReminderSurveillanceEmpty />
      ) : (
        <>
          <Tabs
            value={tab}
            onValueChange={(v: string) => setTab(v as typeof tab)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="table">List Table</TabsTrigger>
              <TabsTrigger value="cards">List Card</TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="mt-3">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((c) => (
                  <ReminderSurveillanceCard
                    key={`${c.id}-${c.surveillance_stage}`}
                    cert={c}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table" className="mt-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BadgeInfo className="h-4 w-4" />
                    Ringkasan Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">
                          No. Sertifikat
                        </TableHead>
                        <TableHead className="w-[200px]">
                          ISO Standards
                        </TableHead>
                        <TableHead>Scope</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead className="w-[130px]">
                          Tanggal Expired
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Urgency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((c) => {
                        const level = getExpiryLevel(c.days_until_expiry);

                        // Styling berdasarkan level waktu expired
                        const rowStyles = {
                          overdue: {
                            bg: 'bg-red-100',
                            border: 'border-l-8 border-l-red-600',
                            textColor: 'text-red-700',
                            dateSize: 'text-xl',
                            animation: 'animate-pulse'
                          },
                          critical: {
                            bg: 'bg-red-50',
                            border: 'border-l-6 border-l-red-500',
                            textColor: 'text-red-600',
                            dateSize: 'text-lg',
                            animation: ''
                          },
                          warning: {
                            bg: 'bg-orange-50',
                            border: 'border-l-4 border-l-orange-500',
                            textColor: 'text-orange-600',
                            dateSize: 'text-base',
                            animation: ''
                          },
                          attention: {
                            bg: 'bg-yellow-50',
                            border: 'border-l-4 border-l-yellow-500',
                            textColor: 'text-yellow-700',
                            dateSize: 'text-base',
                            animation: ''
                          },
                          safe: {
                            bg: 'hover:bg-muted/50',
                            border: '',
                            textColor: '',
                            dateSize: 'text-base',
                            animation: ''
                          }
                        };

                        const style = rowStyles[level];

                        return (
                          <TableRow
                            key={`row-${c.id}-${c.surveillance_stage}`}
                            className={cx(
                              'transition-colors',
                              style.bg,
                              style.border,
                              style.animation
                            )}
                          >
                            <TableCell className="font-semibold">
                              {c.nomor_sertifikat}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p
                                  className={cx(
                                    'font-black leading-tight',
                                    level === 'overdue'
                                      ? 'text-xl text-red-600'
                                      : level === 'critical'
                                      ? 'text-lg text-red-500'
                                      : level === 'warning'
                                      ? 'text-lg text-orange-600'
                                      : level === 'attention'
                                      ? 'text-base text-yellow-700'
                                      : 'text-base text-primary'
                                  )}
                                >
                                  {(c.iso_standards ?? [])
                                    .map((i) => i.name)
                                    .join(', ') || '-'}
                                </p>
                                {c.accreditation && (
                                  <p className="text-xs text-muted-foreground">
                                    {c.accreditation}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[250px]">
                              <p
                                className="text-sm truncate"
                                title={c.iso_reference?.scope ?? '-'}
                              >
                                {c.iso_reference?.scope ?? '-'}
                              </p>
                            </TableCell>
                            <TableCell>
                              <StageBadge stage={c.surveillance_stage} />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="space-y-1">
                                <p
                                  className={cx(
                                    'font-black',
                                    style.dateSize,
                                    style.textColor
                                  )}
                                >
                                  {formatDateShortID(c.expiry_date)}
                                </p>
                                <p
                                  className={cx(
                                    'text-xs font-bold',
                                    style.textColor || 'text-muted-foreground'
                                  )}
                                >
                                  {daysStatusText(c.days_until_expiry)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusExpiryBadge
                                status_expiry={c.status_expiry}
                              />
                            </TableCell>
                            <TableCell>
                              <UrgencyBadge level={c.urgency_level} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <ReminderSurveillancePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            limit={limit}
            onLimitChange={onLimitChange}
            filteredCount={filtered.length}
            totalCount={pagination?.total_count ?? filtered.length}
            hasPrev={page > 1}
            hasNext={
              (typeof pagination?.has_next === 'boolean'
                ? pagination.has_next
                : page < totalPages) && totalPages > 1
            }
          />
        </>
      )}
    </div>
  );
};
