"use client";

import { useState, useEffect } from "react";
import { formatDateShortID } from "@/utils";
import type { Certificate } from "@/types/surveillance";
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

export type ReminderActionType = "lanjut" | "tidak" | null;

type Props = {
  open: boolean;
  type: ReminderActionType;
  certificate: Certificate | null;
  onOpenChange?: (open: boolean) => void;
  onSubmitLanjut?: (payload: {
    certificate: Certificate;
    requestDate: string;
    notes: string;
  }) => Promise<void> | void;
  onSubmitTidak?: (payload: {
    certificate: Certificate;
  }) => Promise<void> | void;
};

export const ReminderSurveillanceActionDialog = ({
  open,
  type,
  certificate,
  onOpenChange,
  onSubmitLanjut,
  onSubmitTidak,
}: Props) => {
  const [requestDate, setRequestDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setRequestDate("");
      setNotes("");
      setSubmitting(false);
    }
  }, [open, type, certificate]);

  const handleClose = () => {
    onOpenChange?.(false);
  };

  const handleSubmitLanjut = async () => {
    if (!certificate || !onSubmitLanjut) return;
    if (!requestDate) return;

    try {
      setSubmitting(true);
      await onSubmitLanjut({
        certificate,
        requestDate,
        notes,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitTidak = async () => {
    if (!certificate || !onSubmitTidak) return;

    try {
      setSubmitting(true);
      await onSubmitTidak({
        certificate,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isLanjut = type === "lanjut";
  const isTidak = type === "tidak";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isLanjut
              ? "Lanjut Proses Surveillance"
              : isTidak
              ? "Tidak Lanjut"
              : "Aksi"}
          </DialogTitle>
          <DialogDescription>
            {isLanjut
              ? "Isi tanggal request audit dan informasi pendukung untuk melanjutkan proses."
              : isTidak
              ? "Konfirmasi bahwa tidak akan melanjutkan proses audit."
              : null}
          </DialogDescription>
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
                <span className="font-medium">Stage:</span>{" "}
                {certificate.surveillance_stage ?? "-"}
              </p>
              <p>
                <span className="font-medium">Expired:</span>{" "}
                {formatDateShortID(certificate.expiry_date)}
              </p>
            </div>

            {isLanjut && (
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
              </>
            )}

            {isTidak && (
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

          {isLanjut && (
            <Button
              onClick={handleSubmitLanjut}
              disabled={!requestDate || submitting || !certificate}
              className="bg-green-500 hover:bg-green-200 cursor-pointer"
            >
              {submitting ? "Menyimpan..." : "Simpan & Lanjut"}
            </Button>
          )}

          {isTidak && (
            <Button
              variant="destructive"
              onClick={handleSubmitTidak}
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
