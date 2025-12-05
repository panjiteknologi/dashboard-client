/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { formatDateShortID } from "@/utils";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AUDIT_STAGE_LABELS,
  AUDIT_STAGE_ORDER,
  AuditStageApi,
} from "@/types/audit-request";
import { AuditRequestSurveillanceDialogProps } from "@/types/surveillance";
import { getNextAuditStageForCertificate } from "@/context/surveillance-context";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export const ReminderSurveillanceActionDialog = ({
  open,
  type,
  certificate,
  onOpenChange,
  onSubmitContinue,
  onSubmitDiscontinue,
}: AuditRequestSurveillanceDialogProps) => {
  const [requestDate, setRequestDate] = useState(""); // string: "YYYY-MM-DD" (lokal)
  const [requestDateObj, setRequestDateObj] = useState<Date | undefined>(); // untuk display
  const [submitting, setSubmitting] = useState(false);
  const [auditStage, setAuditStage] = useState<AuditStageApi | "">("");

  const [pickerYear, setPickerYear] = useState<number | undefined>();
  const [pickerMonth, setPickerMonth] = useState<number | undefined>(); // 0-11

  const isContinue = type === "continue";
  const isDiscontinue = type === "discontinue";

  const MONTH_OPTIONS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const today = new Date();
  const CURRENT_YEAR = today.getFullYear();
  const CURRENT_MONTH = today.getMonth();

  const toYMD = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getLastDayDate = (year: number, month: number) =>
    new Date(year, month + 1, 0);

  const normalizeToLastDayString = (
    dateObj?: Date,
    fallbackStr?: string
  ): string => {
    if (dateObj)
      return toYMD(getLastDayDate(dateObj.getFullYear(), dateObj.getMonth()));

    if (fallbackStr) {
      const tmp = new Date(fallbackStr);
      if (!isNaN(tmp.getTime())) {
        return toYMD(getLastDayDate(tmp.getFullYear(), tmp.getMonth()));
      }
    }

    return "";
  };

  const updateFromPicker = (year: number, month: number) => {
    if (
      year < CURRENT_YEAR ||
      (year === CURRENT_YEAR && month < CURRENT_MONTH)
    ) {
      return;
    }

    const lastDayDate = getLastDayDate(year, month);
    setRequestDateObj(lastDayDate);
    setRequestDate(toYMD(lastDayDate));
  };

  useEffect(() => {
    if (!open) {
      setRequestDate("");
      setRequestDateObj(undefined);
      setPickerYear(undefined);
      setPickerMonth(undefined);
      setSubmitting(false);
      setAuditStage("");
    }
  }, [open, type, certificate]);

  useEffect(() => {
    if (open && isContinue && certificate) {
      const next = getNextAuditStageForCertificate(certificate);
      setAuditStage(next);

      if (!requestDate) {
        const defaultDate = getLastDayDate(CURRENT_YEAR, CURRENT_MONTH);

        setRequestDateObj(defaultDate);
        setRequestDate(toYMD(defaultDate));
        setPickerYear(defaultDate.getFullYear());
        setPickerMonth(defaultDate.getMonth());
      } else {
        const parsed = new Date(requestDate);
        if (!isNaN(parsed.getTime())) {
          setRequestDateObj(parsed);
          setPickerYear(parsed.getFullYear());
          setPickerMonth(parsed.getMonth());
        }
      }
    }
  }, [open, isContinue, certificate]);

  const handleClose = () => {
    onOpenChange?.(false);
  };

  const handleSubmitContinues = async () => {
    if (!certificate || !onSubmitContinue) return;
    if (!auditStage) return;

    const normalizedRequestDate = normalizeToLastDayString(
      requestDateObj,
      requestDate
    );
    if (!normalizedRequestDate) return;

    try {
      setSubmitting(true);
      await onSubmitContinue({
        certificate,
        requestDate: normalizedRequestDate,
        auditStage: auditStage as AuditStageApi,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDiscontinue = async () => {
    if (!certificate || !onSubmitDiscontinue) return;

    try {
      setSubmitting(true);
      await onSubmitDiscontinue({
        certificate,
        requestDate,
        auditStage: auditStage as AuditStageApi,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isContinue
              ? "Lanjut Proses Surveillance"
              : isDiscontinue
              ? "Tidak Lanjut"
              : "Aksi"}
          </DialogTitle>
          <DialogDescription>
            {isContinue
              ? "Isi tanggal request audit, pilih stage berikutnya, dan informasi pendukung untuk melanjutkan proses."
              : isDiscontinue
              ? "Konfirmasi bahwa tidak akan melanjutkan proses audit."
              : null}
          </DialogDescription>

          <div>
            <p className="text-red-500 font-bold text-xs">
              Notes: Selesai mengajukan audit request maka data yang di request
              akan masuk ke menu Audit Request. Silakan lihat menu Audit
              Request.
            </p>
          </div>
        </DialogHeader>

        {certificate && (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-xs space-y-1">
              <p className="font-semibold">
                {certificate.nomor_sertifikat ?? "-"}
              </p>
              <p>
                <span className="font-medium">Nama:</span>{" "}
                {certificate.name ?? "-"}
              </p>
              <p>
                <span className="font-medium">ISO:</span>{" "}
                {(certificate.iso_standards ?? [])
                  .map((i) => i.name)
                  .join(", ") || "-"}
              </p>
              <p>
                <span className="font-medium">Stage sekarang:</span>{" "}
                {certificate.surveillance_stage ?? "-"}
              </p>
              <p>
                <span className="font-medium">Expired:</span>{" "}
                {formatDateShortID(certificate.expiry_date)}
              </p>
            </div>

            {isContinue && (
              <>
                <div className="space-y-2">
                  <Label>Tanggal Request Audit</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !requestDateObj && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {requestDateObj && requestDate
                          ? formatDateShortID(requestDate)
                          : "Pilih bulan & tahun (tanggal otomatis akhir bulan)"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-[320px] p-3 rounded-lg border bg-background shadow-md space-y-3"
                      align="start"
                    >
                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground">
                          Pilih <span className="font-semibold">bulan</span> dan{" "}
                          <span className="font-semibold">tahun</span>. Sistem
                          akan menggunakan{" "}
                          <span className="font-semibold">
                            tanggal terakhir
                          </span>{" "}
                          di bulan tersebut.
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Bulan sebelum{" "}
                          <span className="font-semibold">bulan berjalan</span>{" "}
                          tidak dapat dipilih.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Tahun</Label>
                          <Select
                            value={
                              pickerYear !== undefined
                                ? String(pickerYear)
                                : undefined
                            }
                            onValueChange={(val) => {
                              const year = parseInt(val, 10);
                              setPickerYear(year);
                              if (pickerMonth !== undefined) {
                                updateFromPicker(year, pickerMonth);
                              }
                            }}
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Pilih tahun" />
                            </SelectTrigger>
                            <SelectContent>
                              {YEAR_OPTIONS.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Bulan</Label>
                          <Select
                            value={
                              pickerMonth !== undefined
                                ? String(pickerMonth)
                                : undefined
                            }
                            onValueChange={(val) => {
                              const month = parseInt(val, 10);
                              setPickerMonth(month);

                              const yearToUse =
                                pickerYear !== undefined
                                  ? pickerYear
                                  : CURRENT_YEAR;

                              // kalau year belum dipilih, set dulu ke minimal (current year)
                              if (pickerYear === undefined) {
                                setPickerYear(yearToUse);
                              }

                              updateFromPicker(yearToUse, month);
                            }}
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Pilih bulan" />
                            </SelectTrigger>
                            <SelectContent>
                              {MONTH_OPTIONS.map((label, idx) => {
                                const yearForCheck =
                                  pickerYear !== undefined
                                    ? pickerYear
                                    : CURRENT_YEAR;

                                const isDisabled =
                                  yearForCheck < CURRENT_YEAR ||
                                  (yearForCheck === CURRENT_YEAR &&
                                    idx < CURRENT_MONTH);

                                return (
                                  <SelectItem
                                    key={idx}
                                    value={String(idx)}
                                    disabled={isDisabled}
                                  >
                                    {label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {requestDateObj && (
                        <div className="mt-1 rounded-md bg-muted/60 px-2 py-1.5 text-[11px]">
                          <span className="text-muted-foreground">
                            Tanggal perkiraan audit:
                          </span>{" "}
                          <span className="font-semibold">
                            {formatDateShortID(requestDate)}
                          </span>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>

                  <p className="text-[11px] text-muted-foreground mt-1">
                    Sistem akan mengirim audit request pada tanggal akhir bulan
                    yang dipilih (minimal bulan berjalan).
                  </p>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="nextStage">Auditor</Label>
                  <Select
                    value={auditStage}
                    onValueChange={(val) => setAuditStage(val as AuditStageApi)}
                  >
                    <SelectTrigger id="nextStage" className="w-full">
                      <SelectValue placeholder="Pilih stage berikutnya" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIT_STAGE_ORDER.map((s) => (
                        <SelectItem key={s} value={s}>
                          {AUDIT_STAGE_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="nextStage">Stage Berikutnya</Label>
                  <Select
                    value={auditStage}
                    onValueChange={(val) => setAuditStage(val as AuditStageApi)}
                  >
                    <SelectTrigger id="nextStage" className="w-full">
                      <SelectValue placeholder="Pilih stage berikutnya" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIT_STAGE_ORDER.map((s) => (
                        <SelectItem key={s} value={s}>
                          {AUDIT_STAGE_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {isDiscontinue && (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
                Sertifikat akan kami suspend jika{" "}
                <span className="font-semibold text-destructive">
                  Tidak Lanjut
                </span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Batal
          </Button>

          {isContinue && (
            <Button
              onClick={handleSubmitContinues}
              disabled={!certificate || !auditStage || submitting}
              className="bg-green-500 hover:bg-green-200 cursor-pointer"
            >
              {submitting ? "Menyimpan..." : "Simpan & Lanjut"}
            </Button>
          )}

          {isDiscontinue && (
            <Button
              variant="destructive"
              onClick={handleSubmitDiscontinue}
              disabled={submitting || !certificate}
              className="bg-red-500 hover:bg-red-200 cursor-pointer"
            >
              {submitting ? "Memproses..." : "Ya, Tidak Lanjut."}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
