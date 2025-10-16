import { useState } from "react";
import { Eye, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

type CertItem = { name?: string; standard?: string; file: string };

const isImage = (url: string) => {
  return /\.(png|jpe?g|webp|gif|bmp|tiff|heic)$/i.test(url.split("?")[0]);
};

export const AuditCertificateCard = ({
  item,
  derivedIdx,
  viewingIdx,
  downloadingIdx,
  viewCertificate,
  downloadCertificate,
}: {
  item: CertItem;
  derivedIdx: number;
  viewingIdx: number | null;
  downloadingIdx: number | null;
  viewCertificate: (idx: number, url: string) => void;
  downloadCertificate: (idx: number, url: string) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const certificateUrl = item?.file ?? "";
  const name = item?.name || "Sertifikat";
  const standard = item?.standard || "-";
  const disabledBase = derivedIdx < 0 || !certificateUrl;

  if (!isImage(certificateUrl)) {
    return (
      <div className="group overflow-hidden rounded-xl border bg-card">
        <div className="p-3">
          <p className="truncate text-sm font-medium" title={name}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground" title={standard}>
            {standard}
          </p>
        </div>
        <div className="px-3">
          <div className="h-px w-full bg-border" />
        </div>
        <div className="flex items-center gap-2 p-3">
          <Button
            size="sm"
            onClick={() => viewCertificate(derivedIdx, certificateUrl)}
            disabled={disabledBase || viewingIdx === derivedIdx}
            title={
              !certificateUrl ? "Sertifikat belum tersedia" : "Lihat Sertifikat"
            }
          >
            {viewingIdx === derivedIdx ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Eye className="mr-1 h-4 w-4" />
            )}
            {viewingIdx === derivedIdx ? "Membuka..." : "Lihat"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCertificate(derivedIdx, certificateUrl)}
            disabled={disabledBase || downloadingIdx === derivedIdx}
            title={
              !certificateUrl
                ? "Sertifikat belum tersedia"
                : "Download (tab baru)"
            }
          >
            {downloadingIdx === derivedIdx ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1 h-4 w-4" />
            )}
            {downloadingIdx === derivedIdx ? "Menyiapkan..." : "Download"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <div className="group relative overflow-hidden rounded-xl border bg-card">
        <div className="relative aspect-[3/4] w-full bg-muted">
          {!loaded && (
            <div className="absolute inset-0 animate-pulse rounded-none bg-muted/60" />
          )}

          <Image
            src={certificateUrl}
            alt={name}
            fill
            className="object-cover"
            onLoadingComplete={() => setLoaded(true)}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-2">
            <p className="truncate text-xs font-medium text-white" title={name}>
              {name}
            </p>
            <p className="truncate text-[10px] text-white/80" title={standard}>
              {standard}
            </p>
          </div>

          <div className="absolute right-2 top-2 hidden gap-2 group-hover:flex">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                viewCertificate(derivedIdx, certificateUrl);
              }}
              disabled={disabledBase || viewingIdx === derivedIdx}
              title={
                !certificateUrl
                  ? "Sertifikat belum tersedia"
                  : "Lihat Sertifikat (tab baru)"
              }
            >
              {viewingIdx === derivedIdx ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                downloadCertificate(derivedIdx, certificateUrl);
              }}
              disabled={disabledBase || downloadingIdx === derivedIdx}
              title={!certificateUrl ? "Sertifikat belum tersedia" : "Download"}
            >
              {downloadingIdx === derivedIdx ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>

            {/* Zoom dialog trigger */}
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                title="Perbesar"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </div>
        </div>
      </div>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-sm">{name}</DialogTitle>
        </DialogHeader>
        <div className="relative mx-auto w-full max-w-[900px]">
          <Image
            src={certificateUrl}
            alt={name}
            className="mx-auto max-h-[70vh] w-auto rounded-lg border object-contain"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            onClick={() => viewCertificate(derivedIdx, certificateUrl)}
            disabled={disabledBase || viewingIdx === derivedIdx}
            title={
              !certificateUrl
                ? "Sertifikat belum tersedia"
                : "Lihat Sertifikat (tab baru)"
            }
          >
            {viewingIdx === derivedIdx ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Eye className="mr-1 h-4 w-4" />
            )}
            {viewingIdx === derivedIdx ? "Membuka..." : "Buka Tab"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCertificate(derivedIdx, certificateUrl)}
            disabled={disabledBase || downloadingIdx === derivedIdx}
            title={!certificateUrl ? "Sertifikat belum tersedia" : "Download"}
          >
            {downloadingIdx === derivedIdx ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1 h-4 w-4" />
            )}
            {downloadingIdx === derivedIdx ? "Menyiapkan..." : "Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
