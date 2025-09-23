import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cx, formatDateShortID } from "@/utils";
import { Calendar, ShieldCheck, Timer } from "lucide-react";
import {
  daysStatusText,
  humanize,
  StageBadge,
  UrgencyBadge,
} from "./reminder-surveillance-helpers";
import { Badge } from "@/components/ui/badge";
import { Certificate } from "@/types/surveillance";

export const ReminderSurveillanceCard = ({ cert }: { cert: Certificate }) => {
  const isoNames = (cert.iso_standards ?? []).map((i) => i.name).join(", ");
  const overdue = (cert.days_until_expiry ?? 0) < 0;
  const days = cert.days_until_expiry ?? 0;

  return (
    <Card
      className="
        w-full max-w-[420px] sm:max-w-[540px] md:max-w-none
        mx-auto overflow-hidden rounded-xl hover:shadow-md transition-shadow
      "
    >
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <CardTitle className="text-base truncate">
              {cert.nomor_sertifikat}
            </CardTitle>
            <p className="text-xs text-muted-foreground truncate">{isoNames}</p>
          </div>
          <div className="shrink-0">
            <UrgencyBadge level={cert.urgency_level} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-4 sm:px-6">
        <div className="flex items-center gap-2 text-sm min-w-0">
          <ShieldCheck className="h-4 w-4 opacity-70 shrink-0" />
          <span className="truncate">{cert.iso_reference?.scope ?? "-"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 opacity-70 shrink-0" />
          <span>
            Expiry:{" "}
            <span className="font-medium">
              {formatDateShortID(cert.expiry_date)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Timer
            className={cx("h-4 w-4 shrink-0", overdue && "text-destructive")}
          />
          <span
            className={cx(
              "truncate",
              overdue && "text-destructive font-medium"
            )}
          >
            {daysStatusText(days)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <StageBadge stage={cert.surveillance_stage} />
          {cert.reminder_type && (
            <Badge variant="outline" className="rounded-full">
              {humanize(cert.reminder_type)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
