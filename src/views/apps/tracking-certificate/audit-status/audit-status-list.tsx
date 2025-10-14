/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import React, { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { findTahapan } from "@/utils/getNormalizeTahapan";
import { getlatestProgress, getNextStep } from "@/utils/getProgressAndField";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AllProject, StandardTypes } from "@/types/projects";
import { cx } from "@/utils";
import { THEME } from "@/constant";
import { TrackingProgressView } from "./tracking-progress";
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2 } from "lucide-react";

const DEFAULT_FILE_NAME = "certificate.pdf";

const useFileTools = () => {
  const filenameFromHeadersOrUrl = useCallback(
    (headers: Headers | null, url: string, fallbackType?: string) => {
      const cd = headers?.get?.("content-disposition");
      if (cd) {
        const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd);
        if (match?.[1]) return decodeURIComponent(match[1]);
      }
      try {
        const u = new URL(url);
        const last = u.pathname.split("/").filter(Boolean).pop();
        if (last && last.includes(".")) return decodeURIComponent(last);
      } catch {}
      const ext = fallbackType?.includes("pdf")
        ? "pdf"
        : fallbackType?.includes("png")
        ? "png"
        : fallbackType?.includes("jpeg") || fallbackType?.includes("jpg")
        ? "jpg"
        : "bin";
      return `certificate.${ext}`;
    },
    []
  );

  const detectMimeAndExtFromBase64 = (src: string) => {
    // data URL? ex: data:application/pdf;base64,JVBERi0...
    const dataMatch = /^data:([\w/+.-]+);base64,(.*)$/i.exec(src);
    if (dataMatch) {
      const mime = dataMatch[1] || "application/octet-stream";
      const ext = mime.includes("pdf")
        ? "pdf"
        : mime.includes("png")
        ? "png"
        : mime.includes("jpeg") || mime.includes("jpg")
        ? "jpg"
        : "bin";
      return { mime, ext, b64: dataMatch[2] };
    }
    // plain base64 (tanpa prefix) — deteksi signature sederhana
    const head = src.slice(0, 24);
    const isPdf = head.startsWith("JVBERi0"); // %PDF -> JVBERi0=
    const isPng = head.startsWith("iVBORw0KGgo");
    const isJpg = head.startsWith("/9j/");
    const mime = isPdf
      ? "application/pdf"
      : isPng
      ? "image/png"
      : isJpg
      ? "image/jpeg"
      : "application/octet-stream";
    const ext = isPdf ? "pdf" : isPng ? "png" : isJpg ? "jpg" : "bin";
    return { mime, ext, b64: src };
  };

  const base64ToBlob = (b64: string, mime: string) => {
    const binStr = atob(b64);
    const len = binStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
    return new Blob([bytes], { type: mime || "application/octet-stream" });
  };

  const getFromSource = useCallback(
    async (source: string) => {
      // HTTP(S) URL
      if (/^https?:\/\//i.test(source)) {
        const res = await fetch(source, { credentials: "include" });
        if (!res.ok)
          throw new Error(`Gagal mengambil sertifikat (${res.status})`);
        const blob = await res.blob();
        const type =
          res.headers.get("content-type") || blob.type || "application/pdf";
        const name =
          filenameFromHeadersOrUrl(res.headers, source, type) ||
          DEFAULT_FILE_NAME;
        const objectUrl = URL.createObjectURL(new Blob([blob], { type }));
        return { objectUrl, name };
      }

      // Base64 (data URL atau plain base64)
      const { mime, ext, b64 } = detectMimeAndExtFromBase64(source);
      const blob = base64ToBlob(b64, mime);
      const objectUrl = URL.createObjectURL(blob);
      const name = `certificate.${ext}`;
      return { objectUrl, name };
    },
    [filenameFromHeadersOrUrl]
  );

  return { getFromSource };
};

/** Helper anti popup-blocker: buka URL di tab baru via anchor click */
const openInNewTab = (href: string) => {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click(); // dianggap user gesture
  a.remove();
};

export const AuditStatusView = ({
  data,
  uniqueStandards,
}: {
  data: AllProject[];
  uniqueStandards: StandardTypes[] | any;
}) => {
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const { getFromSource } = useFileTools();

  const dataTransform = useMemo(() => {
    const stat = {
      surveilance1: "sv 1",
      surveilance2: "sv 2",
      surveilance3: "sv 3",
      surveilance4: "sv 4",
      surveilance5: "sv 5",
    } as const;

    return data.map((item) => ({
      ...item,
      sv: stat[item?.tahapan as keyof typeof stat] ?? item?.tahapan,
    }));
  }, [data]);

  const columns = useMemo<ColumnDef<AllProject>[]>(
    () => [
      {
        header: "Nama Perusahaan",
        accessorKey: "customer",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-blue-900">
            {row?.original?.customer ?? "-"}
          </p>
        ),
      },
      {
        header: "Nama Sales",
        accessorKey: "sales_person",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-blue-900">
            {row?.original?.sales_person ?? "-"}
          </p>
        ),
      },
      {
        header: "Standar",
        accessorKey: "iso_standards",
        cell: ({ row }) => {
          const standar = row?.original?.iso_standards;
          return Array.isArray(standar) && standar.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {standar.map((item, index) => (
                <Badge variant="outline" key={index}>
                  {item ?? "-"}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const values: string[] = row?.getValue(columnId);
          return values?.some((v) =>
            v.toLowerCase().includes(filterValue.toLowerCase())
          );
        },
      },
      {
        header: "Akreditasi",
        accessorKey: "accreditation",
        cell: ({ row }) => {
          const accreditations = row?.original?.accreditation;
          return Array.isArray(accreditations) && accreditations.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {accreditations.map((item, index) => (
                <Badge variant="outline" key={index}>
                  {item ?? "-"}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        header: "Tahapan",
        accessorKey: "tahapan",
        cell: ({ row }) => {
          const normalizedField = findTahapan(row?.original?.tahapan as string);
          return (
            <p className="text-sm font-bold text-blue-900">
              {normalizedField?.nama_tahapan ?? "-"}
            </p>
          );
        },
      },
      {
        header: "Latest Progress",
        accessorKey: "tahapan",
        accessorFn: getlatestProgress,
        id: "latest_progress",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-green-500 text-left capitalize italic">
            {getlatestProgress(row?.original)}
          </p>
        ),
      },
      {
        header: "Next Step",
        accessorKey: "next_step",
        accessorFn: getNextStep,
        id: "next_step",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-orange-600 text-left capitalize italic">
            {getNextStep(row?.original)}
          </p>
        ),
      },
      {
        header: "Lead Time Project",
        accessorKey: "lead_time_finish",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-blue-900 text-left capitalize italic">
            {row?.original?.lead_time_finish ?? "-"}
          </p>
        ),
      },
    ],
    []
  );

  const customGlobalFilter = (
    row: any,
    columnId: string,
    filterValue: string
  ) => {
    const filter = filterValue.toLowerCase();
    const flatString = Object.values(row?.original)
      .map((val) => (Array.isArray(val) ? val.join(" ") : val ?? ""))
      .join(" ")
      .toLowerCase();

    if (columnId === "next_step") {
      const next = getNextStep(row?.original);
      return next.toLowerCase().includes(filter);
    }

    if (columnId === "latest_progress") {
      const latest = getlatestProgress(row?.original);
      return latest.toLowerCase().includes(filter);
    }

    return flatString.includes(filter);
  };

  const viewCertificate = useCallback(
    async (idx: number, src?: string | null) => {
      if (!src || idx < 0) return;

      try {
        setViewingIdx(idx);
        const { objectUrl } = await getFromSource(src);
        openInNewTab(objectUrl);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      } catch (e) {
        console.error(e);
        openInNewTab(src);
      } finally {
        setViewingIdx(null);
      }
    },
    [getFromSource]
  );

  const downloadCertificate = useCallback(
    async (idx: number, src?: string | null) => {
      if (!src || idx < 0) return;

      try {
        setDownloadingIdx(idx);
        const { objectUrl, name } = await getFromSource(src);

        const html = `<!doctype html>
            <html>
            <head><meta charset="utf-8"><title>Menyiapkan unduhan…</title></head>
            <body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:16px">
              <p>Menyiapkan unduhan <strong>${
                name || DEFAULT_FILE_NAME
              }</strong>…</p>
              <a id="dl" href="${objectUrl}" download="${
          name || DEFAULT_FILE_NAME
        }">Unduh</a>
              <script>
                const a = document.getElementById('dl');
                if (a) a.click();
                setTimeout(() => { window.close(); }, 5000);
              </script>
            </body>
            </html>`;

        const pageBlob = new Blob([html], { type: "text/html" });
        const pageUrl = URL.createObjectURL(pageBlob);

        openInNewTab(pageUrl);

        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
          URL.revokeObjectURL(pageUrl);
        }, 60_000);
      } catch (e) {
        console.error(e);
        openInNewTab(src);
      } finally {
        setDownloadingIdx(null);
      }
    },
    [getFromSource]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Tracking Certificate Status
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            View and manage all tracking your certificate
          </p>
        </div>

        <DataTable
          filteredStandard={false}
          isSearch={false}
          columns={columns}
          data={dataTransform}
          uniqueStandards={uniqueStandards}
          loading={false}
          customGlobalFilter={customGlobalFilter}
          children={(rowData, maybeIdx?: number) => {
            const certificateUrl: string | undefined =
              rowData?.upload_sertifikat;

            const derivedIdx =
              typeof maybeIdx === "number" && !Number.isNaN(maybeIdx)
                ? maybeIdx
                : dataTransform.findIndex((d) => d === rowData);

            return (
              <div className="rounded-2xl border bg-card">
                <div className="flex flex-col gap-1 p-4">
                  <h2 className="text-base font-semibold leading-tight">
                    Project Status · Progress
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Pantau perjalanan sertifikasi dan langkah berikutnya
                  </p>
                </div>

                <div className="px-4">
                  <div className="h-px w-full bg-border" />
                </div>

                <div className="p-4">
                  <div className="rounded-xl border bg-muted/30 py-6">
                    <TrackingProgressView data={rowData} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-start gap-2">
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() =>
                        viewCertificate(derivedIdx, certificateUrl)
                      }
                      disabled={
                        derivedIdx < 0 ||
                        !certificateUrl ||
                        viewingIdx === derivedIdx
                      }
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
                      {viewingIdx === derivedIdx
                        ? "Membuka..."
                        : "Lihat Sertifikat"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        downloadCertificate(derivedIdx, certificateUrl)
                      }
                      disabled={
                        derivedIdx < 0 ||
                        !certificateUrl ||
                        downloadingIdx === derivedIdx
                      }
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
                      {downloadingIdx === derivedIdx
                        ? "Menyiapkan..."
                        : "Download"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
