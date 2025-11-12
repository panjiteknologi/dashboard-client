import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cx, formatDateShortID } from "@/utils";
import { AlertTriangle, Calendar, CalendarCheck, FileText, ShieldCheck, Timer, XCircle, AlertCircle, Clock } from "lucide-react";
import {
  daysStatusText,
  humanize,
  StageBadge,
  UrgencyBadge,
  getExpiryLevel,
} from "./reminder-surveillance-helpers";
import { Badge } from "@/components/ui/badge";
import { Certificate } from "@/types/surveillance";
import { Separator } from "@/components/ui/separator";

export const ReminderSurveillanceCard = ({ cert }: { cert: Certificate }) => {
  const isoNames = (cert.iso_standards ?? []).map((i) => i.name).join(", ");
  const days = cert.days_until_expiry ?? 0;
  const level = getExpiryLevel(days);

  // Styling berdasarkan level waktu expired
  const cardStyles = {
    overdue: {
      border: "border-4 border-red-600",
      bg: "bg-red-50",
      shadow: "shadow-2xl shadow-red-500/50",
      animation: "animate-pulse",
      icon: XCircle,
      iconColor: "text-red-600",
      textColor: "text-red-600",
      labelColor: "text-red-700",
      boxBg: "bg-red-100",
      boxBorder: "border-4 border-red-600",
    },
    critical: {
      border: "border-4 border-red-500",
      bg: "bg-red-50/80",
      shadow: "shadow-xl shadow-red-400/40",
      animation: "",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      textColor: "text-red-500",
      labelColor: "text-red-600",
      boxBg: "bg-red-100/70",
      boxBorder: "border-3 border-red-500",
    },
    warning: {
      border: "border-3 border-orange-500",
      bg: "bg-orange-50/70",
      shadow: "shadow-lg shadow-orange-300/30",
      animation: "",
      icon: AlertCircle,
      iconColor: "text-orange-500",
      textColor: "text-orange-600",
      labelColor: "text-orange-700",
      boxBg: "bg-orange-100/60",
      boxBorder: "border-2 border-orange-500",
    },
    attention: {
      border: "border-2 border-yellow-500",
      bg: "bg-yellow-50/60",
      shadow: "shadow-md shadow-yellow-200/20",
      animation: "",
      icon: Clock,
      iconColor: "text-yellow-600",
      textColor: "text-yellow-700",
      labelColor: "text-yellow-800",
      boxBg: "bg-yellow-100/50",
      boxBorder: "border-2 border-yellow-400",
    },
    safe: {
      border: "border",
      bg: "bg-background",
      shadow: "hover:shadow-md",
      animation: "",
      icon: Timer,
      iconColor: "opacity-70",
      textColor: "",
      labelColor: "text-muted-foreground",
      boxBg: "bg-muted/30",
      boxBorder: "",
    },
  };

  const style = cardStyles[level];
  const IconComponent = style.icon;

  return (
    <Card
      className={cx(
        "w-full max-w-[420px] sm:max-w-[540px] md:max-w-none",
        "mx-auto overflow-hidden rounded-xl transition-all",
        style.border,
        style.bg,
        style.shadow,
        style.animation
      )}
    >
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-semibold truncate">
              {cert.nomor_sertifikat}
            </CardTitle>
            {/* ISO Standards - Diperbesar dan lebih prominent */}
            <div className="mt-2 space-y-1">
              <p className={cx("text-xs font-medium", style.labelColor)}>
                ISO Standards:
              </p>
              <p className={cx("text-xl font-black leading-tight", level !== "safe" ? style.textColor : "text-primary")}>
                {isoNames || "-"}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <UrgencyBadge level={cert.urgency_level} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4 sm:px-6">
        {/* Scope */}
        <div className="flex items-start gap-2 text-sm min-w-0">
          <ShieldCheck className="h-4 w-4 opacity-70 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Scope:</p>
            <p className="font-medium">{cert.iso_reference?.scope ?? "-"}</p>
          </div>
        </div>

        <Separator />

        {/* Expiry Date - Styling berbeda per level */}
        <div
          className={cx(
            "flex items-start gap-3 p-4 rounded-lg transition-all",
            style.boxBg,
            style.boxBorder,
            level === "overdue" && "animate-pulse"
          )}
        >
          <IconComponent
            className={cx(
              "shrink-0 mt-1",
              level === "overdue" ? "h-8 w-8" : level === "critical" ? "h-7 w-7" : level === "warning" ? "h-6 w-6" : "h-5 w-5",
              style.iconColor
            )}
          />
          <div className="min-w-0 flex-1">
            <p className={cx("text-xs font-bold uppercase tracking-wide", style.labelColor)}>
              {level === "overdue" ? "🚨 SUDAH LEWAT! 🚨" : level === "critical" ? "⚠️ SANGAT MENDESAK!" : level === "warning" ? "⚡ SEGERA PERBARUI!" : level === "attention" ? "📌 Perlu Perhatian" : "Tanggal Expired:"}
            </p>
            <p
              className={cx(
                "font-black mt-1",
                level === "overdue" ? "text-3xl" : level === "critical" ? "text-2xl" : level === "warning" ? "text-xl" : "text-lg",
                style.textColor || ""
              )}
            >
              {formatDateShortID(cert.expiry_date)}
            </p>
            {/* Days until expiry - Prominent display */}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cx(
                  "font-bold",
                  level === "overdue" ? "text-lg" : level === "critical" ? "text-base" : "text-sm",
                  style.textColor || "text-muted-foreground"
                )}
              >
                {daysStatusText(days)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional dates */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {cert.issue_date && (
            <div className="flex items-start gap-1.5">
              <CalendarCheck className="h-3.5 w-3.5 opacity-70 shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground">Issue:</p>
                <p className="font-medium">{formatDateShortID(cert.issue_date)}</p>
              </div>
            </div>
          )}
          {cert.validity_date && (
            <div className="flex items-start gap-1.5">
              <FileText className="h-3.5 w-3.5 opacity-70 shrink-0 mt-0.5" />
              <div>
                <p className="text-muted-foreground">Valid:</p>
                <p className="font-medium">{formatDateShortID(cert.validity_date)}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <StageBadge stage={cert.surveillance_stage} />
          {cert.reminder_type && (
            <Badge variant="outline" className="rounded-full">
              {humanize(cert.reminder_type)}
            </Badge>
          )}
          {cert.accreditation && (
            <Badge variant="secondary" className="rounded-full">
              {cert.accreditation}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
