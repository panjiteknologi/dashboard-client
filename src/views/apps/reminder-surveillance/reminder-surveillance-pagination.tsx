import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIMIT_OPTIONS = [10, 25, 50, 100] as const;
type LimitOption = (typeof LIMIT_OPTIONS)[number];

export type ReminderSurveillancePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  limit: number;
  onLimitChange: (n: LimitOption) => void;
  filteredCount: number;
  totalCount: number;
  hasPrev?: boolean;
  hasNext?: boolean;
};

export const ReminderSurveillancePagination = ({
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  filteredCount,
  totalCount,
  hasPrev,
  hasNext,
}: ReminderSurveillancePaginationProps) => {
  const prevDisabled = hasPrev ?? page <= 1;
  const nextDisabled = hasNext ?? !(page < totalPages && totalPages > 1);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 pb-4">
      <div className="text-sm text-muted-foreground">
        Menampilkan <span className="font-medium">{filteredCount}</span> dari{" "}
        <span className="font-medium">{totalCount}</span> data (hal. {page}/
        {totalPages})
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={String(limit)}
          onValueChange={(v) => {
            const n = parseInt(v, 10) as LimitOption;
            onLimitChange(n);
            onPageChange(1);
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={prevDisabled}
        >
          Prev
        </Button>
        <Button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={nextDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
