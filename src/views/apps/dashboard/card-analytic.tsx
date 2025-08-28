import { Card } from "@/components/ui/card";
import { DataAnalytics } from "./chart-view";
import { TrendingDown, TrendingUp, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface CardAnalyticProps {
  title: string;
  count: number;
  data: DataAnalytics;
  moreData?: boolean;
  dataRunning?: number;
  dataDone?: number;
}

function formatNumber(num: number) {
  return num.toLocaleString("id-ID");
}

export default function CardAnalyticView({
  title,
  count,
  data,
  moreData,
  dataRunning,
  dataDone,
}: CardAnalyticProps) {
  const labelChip =
    data.gap < 0
      ? `Turun ${Math.abs(data.gap)} dari`
      : data.gap > 0
      ? `Naik ${data.gap} dari`
      : `Sama dengan`;

  const Icon =
    data.gap < 0 ? TrendingDown : data.gap > 0 ? TrendingUp : MoveRight;

  const chipColor =
    data.gap < 0
      ? "bg-red-100 text-red-700"
      : data.gap > 0
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <Card className="p-4 shadow-sm rounded-xl border text-xs">
      <div className="flex justify-between items-start">
        <Label className="font-medium text-gray-500">{title}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <h4 className="text-xs font-semibold text-inherit">
          {formatNumber(count)}
        </h4>
        <div
          className={`w-50 flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${chipColor}`}
        >
          <Icon className={cn("w-4 h-4 mr-1", chipColor)} />
          <Label className="text-xs">{labelChip}</Label>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <div>
            Audit minggu ini:{" "}
            <span className="text-blue-600 font-semibold">
              {data.countAuditThisWeek}
            </span>
          </div>
          <div>
            Audit minggu lalu:{" "}
            <span className="text-blue-600 font-semibold">
              {data.countAuditLastWeek}
            </span>
          </div>
        </div>
        {moreData && (
          <div>
            <div>
              Audit berjalan:{" "}
              <span className="text-blue-600 font-semibold">{dataRunning}</span>
            </div>
            <div>
              Audit selesai:{" "}
              <span className="text-green-600 font-semibold">{dataDone}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
