/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import React, { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { findTahapan } from "@/utils/getNormalizeTahapan";
import { getlatestProgress, getNextStep } from "@/utils/getProgressAndField";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AllProject, StandardTypes } from "@/types/projects";
// import { cx } from "@/utils";
// import { THEME } from "@/constant";
import { TrackingProgressView } from "./tracking-progress";
import { AuditCertificateCard } from "./audit-status-certificate";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  TrendingUp,
  Building,
  User,
  // Award
} from "lucide-react";

const DEFAULT_FILE_NAME = "certificate.pdf";

const getProjectStatus = (tahapan: string) => {
  if (tahapan?.includes("sertifikat") || tahapan?.includes("selesai")) {
    return {
      status: "Completed",
      variant: "default" as const,
      color: "bg-green-500",
      icon: CheckCircle,
      textColor: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    };
  }
  if (tahapan?.includes("survilance") || tahapan?.includes("sv")) {
    return {
      status: "Surveillance",
      variant: "secondary" as const,
      color: "bg-blue-500",
      icon: Clock,
      textColor: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    };
  }
  if (tahapan?.includes("audit")) {
    return {
      status: "In Audit",
      variant: "secondary" as const,
      color: "bg-orange-500",
      icon: AlertCircle,
      textColor: "text-orange-700",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
    };
  }
  return {
    status: "In Progress",
    variant: "outline" as const,
    color: "bg-gray-500",
    icon: Clock,
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  };
};

const getProgressPercentage = (tahapan: string) => {
  const progressMap: Record<string, number> = {
    survei: 10,
    audit1: 20,
    audit2: 35,
    survilance1: 50,
    survilance2: 65,
    survilance3: 80,
    survilance4: 90,
    survilance5: 95,
    sertifikat: 100,
    selesai: 100,
  };
  return progressMap[tahapan] || 0;
};

const StatusBadge = ({ tahapan }: { tahapan: string }) => {
  const statusInfo = getProjectStatus(tahapan);
  const Icon = statusInfo.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.textColor}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{statusInfo.status}</span>
    </div>
  );
};

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
    const head = src.slice(0, 24);
    const isPdf = head.startsWith("JVBERi0");
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

const openInNewTab = (href: string) => {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
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
        header: "Project Info",
        cell: ({ row }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-gray-900">
                {row?.original?.customer ?? "-"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{row?.original?.sales_person ?? "No Sales"}</span>
            </div>
          </div>
        ),
      },
      {
        header: "Standards",
        accessorKey: "iso_standards",
        cell: ({ row }) => {
          const standar = row?.original?.iso_standards;
          return Array.isArray(standar) && standar.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {standar.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
                >
                  {item ?? "-"}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">No Standards</span>
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
        header: "Status & Progress",
        cell: ({ row }) => {
          const tahapan = row?.original?.tahapan;
          const progress = getProgressPercentage(tahapan);
          const normalizedField = findTahapan(tahapan as string);

          return (
            <div className="space-y-2">
              <StatusBadge tahapan={tahapan} />
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">
                    {normalizedField?.nama_tahapan ?? "-"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            </div>
          );
        },
      },
      {
        header: "Latest Progress",
        accessorKey: "tahapan",
        accessorFn: getlatestProgress,
        id: "latest_progress",
        cell: ({ row }) => {
          const progress = getlatestProgress(row?.original);
          return (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {progress}
              </span>
            </div>
          );
        },
      },
      {
        header: "Next Step",
        accessorKey: "next_step",
        accessorFn: getNextStep,
        id: "next_step",
        cell: ({ row }) => {
          const nextStep = getNextStep(row?.original);
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">
                {nextStep}
              </span>
            </div>
          );
        },
      },
      {
        header: "Lead Time",
        accessorKey: "lead_time_finish",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {row?.original?.lead_time_finish ?? "-"}
            </span>
          </div>
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
      .map((val) => (Array.isArray(val) ? val.join(" ") : (val ?? "")))
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
    <div className="space-y-8">
      {/* Header Section - Removed to avoid duplication since it's already in the main dashboard page */}

      <DataTable
        filteredStandard={false}
        isSearch={false}
        columns={columns}
        data={dataTransform}
        uniqueStandards={uniqueStandards}
        loading={false}
        customGlobalFilter={customGlobalFilter}
        children={(rowData, maybeIdx?: number) => {
          const certificate = rowData?.sertifikat;
          const derivedIdx =
            typeof maybeIdx === "number" && !Number.isNaN(maybeIdx)
              ? maybeIdx
              : dataTransform.findIndex((d) => d === rowData);

          const progress = getProgressPercentage(rowData.tahapan);
          // const statusInfo = getProjectStatus(rowData.tahapan);
          // const StatusIcon = statusInfo.icon;
          return (
            <div className="space-y-6 p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              {/* Header Section */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {rowData.customer}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{rowData.sales_person || "Not Assigned"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge tahapan={rowData.tahapan} />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {progress}%
                    </div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left Column - Progress */}
                <div className="space-y-5">
                  {/* Detailed Tracking */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Detailed Timeline
                    </h4>
                    <div className="max-h-200 overflow-y-auto">
                      <TrackingProgressView data={rowData} />
                    </div>
                  </div>
                  {/* Current Progress */}
                  {/* <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Current Progress</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {findTahapan(rowData.tahapan)?.nama_tahapan || rowData.tahapan}
                          </span>
                          <span className="text-sm font-bold text-blue-600">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusInfo.status}</span>
                        </div>
                      </div>
                    </div> */}

                  {/* Timeline */}
                  {/* <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Timeline</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-700">Next Step</span>
                          </div>
                          <p className="text-sm text-gray-600">{getNextStep(rowData)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-700">Latest Progress</span>
                          </div>
                          <p className="text-sm text-gray-600">{getlatestProgress(rowData)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              {rowData.lead_time_finish || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div> */}
                </div>

                {/* Right Column - Standards & Certificates */}
                <div className="space-y-5">
                  {/* Standards */}
                  {/* <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-indigo-600" />
                        <h4 className="font-semibold text-gray-900">ISO Standards</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(rowData.iso_standards) && rowData.iso_standards.length > 0 ? (
                          rowData.iso_standards.map((standard, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-indigo-100 text-indigo-700 border-indigo-200 px-2.5 py-1 text-xs font-medium"
                            >
                              {standard}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No standards applied</span>
                        )}
                      </div>
                    </div> */}

                  {/* Accreditation */}
                  {/* {Array.isArray(rowData.accreditation) && rowData.accreditation.length > 0 && (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="h-4 w-4 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Accreditation</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {rowData.accreditation.map((acc, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-green-100 text-green-700 border-green-200 px-2.5 py-1 text-xs font-medium"
                            >
                              {acc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )} */}

                  {/* Certificates */}
                  <div className="p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-600" />
                        <h4 className="font-semibold text-gray-900">
                          Certificates
                        </h4>
                      </div>
                      {Array.isArray(certificate) && certificate.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-700 border-amber-200"
                        >
                          {certificate.length} files
                        </Badge>
                      )}
                    </div>
                    {((certificate as unknown as { file: string }[])?.length ??
                      0) === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No certificates available</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {(
                          certificate as unknown as {
                            name?: string;
                            standard?: string;
                            file: string;
                          }[]
                        ).map((item, index) => (
                          <AuditCertificateCard
                            key={index}
                            item={item}
                            derivedIdx={derivedIdx}
                            viewingIdx={viewingIdx}
                            downloadingIdx={downloadingIdx}
                            viewCertificate={viewCertificate}
                            downloadCertificate={downloadCertificate}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
