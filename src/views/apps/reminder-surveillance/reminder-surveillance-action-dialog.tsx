"use client";

import { useState, useEffect } from "react";
import { formatDateShortID } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const ReminderSurveillanceActionDialog = ({
  open,
  type,
  certificate,
  onOpenChange,
  onSubmitContinue,
  onSubmitDiscontinue,
}: AuditRequestSurveillanceDialogProps) => {
  const [requestDate, setRequestDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [auditStage, setAuditStage] = useState<AuditStageApi | "">("");

  const isContinue = type === "continue";
  const isDiscontinue = type === "discontinue";

  useEffect(() => {
    if (!open) {
      setRequestDate("");
      setSubmitting(false);
      setAuditStage("");
    }
  }, [open, type, certificate]);

  useEffect(() => {
    if (open && isContinue && certificate) {
      const next = getNextAuditStageForCertificate(certificate);
      setAuditStage(next);
    }
  }, [open, isContinue, certificate]);

  const handleClose = () => {
    onOpenChange?.(false);
  };

  const handleSubmitContinues = async () => {
    if (!certificate || !onSubmitContinue) return;
    if (!requestDate || !auditStage) return;

    try {
      setSubmitting(true);
      await onSubmitContinue({
        certificate,
        requestDate,
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
                  <Label htmlFor="requestDate">Tanggal Request Audit</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                  />
                </div>

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
              disabled={
                !requestDate || !certificate || !auditStage || submitting
              }
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
