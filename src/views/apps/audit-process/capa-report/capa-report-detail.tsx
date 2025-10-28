/* eslint-disable @next/next/no-img-element */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Eye, Loader2 } from "lucide-react";
import { CapaTypes } from "@/types/projects";
import { useDataReportDetailQuery } from "@/hooks/use-report-detail";
import { useCallback, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { formatDateID } from "@/utils/formatDate";

const useFileTools = () => {
  const detectMimeAndExtFromBase64 = (src: string) => {
    if (!src) return { mime: "application/octet-stream", ext: "bin", b64: "" };

    const clean = src.trim().replace(/\s/g, "");
    const prefixMatch = /^data:([\w/+.-]+);base64,(.*)$/i.exec(clean);
    if (prefixMatch) {
      return { mime: prefixMatch[1], ext: prefixMatch[1].split("/")[1], b64: prefixMatch[2] };
    }

    const head = clean.substring(0, 20);

    if (head.startsWith("SlZCRVJ") || head.startsWith("JVBER")) {
      return { mime: "application/pdf", ext: "pdf", b64: clean };
    }
    if (head.startsWith("iVBOR")) return { mime: "image/png", ext: "png", b64: clean };
    if (head.startsWith("/9j/")) return { mime: "image/jpeg", ext: "jpg", b64: clean };
    if (head.startsWith("R0lGOD")) return { mime: "image/gif", ext: "gif", b64: clean };
    if (head.startsWith("UEsDB")) {
      // Bisa xlsx atau xlsm — keduanya ZIP-based
      return {
        mime: "application/vnd.ms-excel.sheet.macroEnabled.12",
        ext: "xlsm",
        b64: clean,
      };
    }

    return { mime: "application/octet-stream", ext: "bin", b64: clean };
  };

  const base64ToBlob = useCallback((b64: string, mime: string) => {
    try {
      let cleanB64 = b64.replace(/^data:[\w/+.-]+;base64,/, "").trim();
      cleanB64 = cleanB64.replace(/[^A-Za-z0-9+/=]/g, "").replace(/-/g, "+").replace(/_/g, "/");
      while (cleanB64.length % 4 !== 0) cleanB64 += "=";

      const binary = atob(cleanB64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return new Blob([bytes], { type: mime || "application/octet-stream" });
    } catch (err) {
      console.error("❌ base64ToBlob error:", err);
      throw new Error("Invalid Base64 data");
    }
  }, []);

  const getFromSource = useCallback(
    async (src: string, label: string) => {
      try {
        const fullSrc = src.trim();
        const { mime, ext, b64 } = detectMimeAndExtFromBase64(fullSrc);
        const blob = base64ToBlob(b64, mime);
        const objectUrl = URL.createObjectURL(blob);
        return { objectUrl, mime, ext, b64 };
      } catch (error) {
        console.error("❌ getFromSource error:", error);
        throw error;
      }
    },
    [base64ToBlob]
  );

  return { getFromSource, detectMimeAndExtFromBase64 };
};

export const CapaReportDetail = ({ data }: { data: CapaTypes }) => {
  const [viewingKey, setViewingKey] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ url: string; mime: string; label: string } | null>(null);

  const { getFromSource, detectMimeAndExtFromBase64 } = useFileTools();
  const { data: reportDetail, isLoading } = useDataReportDetailQuery(
    { id: data.id as number },
    { enabled: !!data.id }
  );

  const detailData = useMemo(() => {
    const details = reportDetail?.data || reportDetail || {};
    return { ...data, ...details };
  }, [data, reportDetail]);

  const getFileIcon = useCallback((mime: string) => {
    if (mime === "application/pdf") return "📄";
    if (mime.includes("spreadsheet") || mime.includes("excel")) return "📊";
    if (mime.includes("word") || mime.includes("document")) return "📝";
    if (mime.includes("image")) return "🖼️";
    return "📎";
  }, []);

  const viewDocument = useCallback(
  async (docKey: string, src: string, label: string) => {
    if (!src) return;
    setViewingKey(docKey);

    try {
      const { objectUrl, mime, b64 } = await getFromSource(src, label);

      if (
        mime.includes("spreadsheet") ||
        mime.includes("excel") ||
        mime.includes("macroEnabled")
      ) {
        // 🔹 XLSX & XLSM Viewer Fix
        const workbook = XLSX.read(
          Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
          { type: "array" }
        );
        const html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
        setPreviewHtml(html);
      } else {
        setPreviewData({ url: objectUrl, mime, label });
      }
    } catch (error) {
      console.error("❌ viewDocument error:", error);
      alert("Gagal menampilkan dokumen. Silakan unduh saja.");
    } finally {
      setViewingKey(null);
    }
  },
  [getFromSource]
);

  const downloadDocument = useCallback(
    async (docKey: string, src: string, label: string) => {
      if (!src) return;
      setDownloadingKey(docKey);

      try {
        const { objectUrl, ext } = await getFromSource(src, label);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = `${label}.${ext || "file"}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.error("❌ downloadDocument error:", error);
        alert("Failed to download document.");
      } finally {
        setDownloadingKey(null);
      }
    },
    [getFromSource]
  );


  return (
    <Collapsible defaultOpen>
      <div className="flex items-center gap-x-3 px-4 py-2 border-b bg-muted">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleTrigger asChild>
          <div className="text-left flex-grow cursor-pointer">
            <p className="font-semibold text-base break-words">
              {detailData.document_no} -{" "}
              {typeof detailData.customer === "object"
                ? detailData.customer.name
                : detailData.customer}
            </p>
            <p className="text-sm text-muted-foreground break-words">
              {detailData.standards?.join(", ") || "No standards"}
            </p>
          </div>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="bg-white p-4 text-sm space-y-4 max-h-[400px] overflow-auto rounded-b-md shadow-inner">
        {isLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p><strong>Reference:</strong> {detailData.reference?.name || detailData.reference || "-"}</p>
                <p><strong>Plan Ref:</strong> {detailData.plan_reference?.name || detailData.plan_reference || "-"}</p>
                <p><strong>Sales Order:</strong> {detailData.sales_order_id?.name || "-"}</p>
                <p><strong>Status:</strong> {detailData.status || "-"}</p>
              </div>
              <div>
                <p><strong>Stage:</strong> {detailData.audit_stage || "-"}</p>
                <p><strong>Total Employee:</strong> {detailData.total_emp || "-"}</p>
                <p><strong>Boundaries:</strong> {detailData.boundaries || "-"}</p>
                <p><strong>Finding Type:</strong> {detailData.finding_type || "-"}</p>
              </div>
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <p><strong>Audit Date Start:</strong> {detailData.audit_date_start || "-"}</p>
                </div>
                <div>
                    <p><strong>Audit Date End:</strong> {detailData.audit_date_end || "-"}</p>
                </div>
            </div> */}

            <div className="space-y-1 mb-4">
                <p><strong>Scope:</strong></p>
                <p className="text-muted-foreground">{Array.isArray(detailData.scope) ? detailData.scope.join(', ') : detailData.scope || "-"}</p>
            </div>
            
            {/* Raw Data for Debugging */}
            {/* <Collapsible>
              <CollapsibleTrigger className="text-blue-600 text-xs hover:underline">Show Raw Data</CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="bg-gray-100 p-2 rounded-md text-xs mt-2 overflow-auto">
                  {JSON.stringify(detailData, null, 2)}
                </pre>
              </CollapsibleContent>
            </Collapsible> */}

            {/* Findings Section */}
            <div className="mt-4">
              <strong>Findings:</strong>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">OFI</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Minor</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Major</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Closing Date</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    <tr>
                      <td className="px-4 py-3">{detailData.finding_ofi}</td>
                      <td className="px-4 py-3">{detailData.finding_minor}</td>
                      <td className="px-4 py-3">{detailData.finding_major}</td>
                      <td className="px-4 py-3">{formatDateID(detailData.closing_finding_date)}</td>
                      <td className="px-4 py-3">{detailData.finding_status || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4">
              <strong>Document Audit: {detailData.audit_document?.status_file_report == "benar" ? "Selesai":"Draft"}</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {[
                  { label: "Audit Plan", url: detailData.audit_document?.audit_plan, key: "audit_plan", status: detailData.document_status?.audit_plan },
                  { label: "Attendance Sheet", url: detailData.audit_document?.attendance_sheet, key: "attendance_sheet", status: detailData.document_status?.attendance_sheet },
                  { label: "Audit Report", url: detailData.audit_document?.audit_report, key: "audit_report", status: detailData.document_status?.audit_report },
                  { label: "Close Findings", url: detailData.audit_document?.close_findings, key: "close_findings", status: detailData.document_status?.close_findings },
                ].map((doc) => {
                  if (!doc.url) {
                    return (
                      <div key={doc.key} className="border rounded-lg p-3 bg-gray-50 text-center text-gray-400 italic">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-sm text-left">{doc.label}</p>
                            {doc.status && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{doc.status}</span>}
                        </div>
                        <p>No file</p>
                      </div>
                    );
                  }

                  const { mime } = detectMimeAndExtFromBase64(doc.url);
                  const isImage = mime.startsWith("image/");
                  const dataUrl = `data:${mime};base64,${doc.url}`;
                  const isViewing = viewingKey === doc.key;
                  const isDownloading = downloadingKey === doc.key;

                  return (
                    <div key={doc.key} className="border rounded-lg p-3 bg-gray-50 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{doc.label}</p>
                        {doc.status && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">{doc.status}</span>}
                      </div>

                      {isImage ? (
                        <div className="w-full h-32 flex items-center justify-center bg-white border rounded overflow-hidden">
                          <img src={dataUrl} alt={doc.label} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-full h-32 flex flex-col items-center justify-center bg-white border rounded text-center text-xs">
                          <div className="text-3xl mb-1">{getFileIcon(mime)}</div>
                          <p>{mime}</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-2 w-full">
                        <button
                          onClick={() => viewDocument(doc.key, doc.url, doc.label)}
                          disabled={isViewing || isDownloading}
                          className="flex-1 text-blue-600 text-xs flex items-center justify-center gap-1 hover:bg-blue-50 py-1.5 px-2 rounded disabled:opacity-50"
                        >
                          {isViewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                          {isViewing ? "Opening..." : "Preview"}
                        </button>
                        <button
                          onClick={() => downloadDocument(doc.key, doc.url, doc.label)}
                          disabled={isViewing || isDownloading}
                          className="flex-1 text-green-600 text-xs flex items-center justify-center gap-1 hover:bg-green-50 py-1.5 px-2 rounded disabled:opacity-50"
                        >
                          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          {isDownloading ? "Downloading..." : "Download"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CollapsibleContent>

      {/* POPUP HTML (EXCEL PREVIEW) */}
      {previewHtml && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg w-[90%] h-[90%] p-4 overflow-auto relative">
            <button
              onClick={() => setPreviewHtml(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              ✕
            </button>
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      )}

      {/* POPUP IFRAME (PDF/DOCX PREVIEW) */}
      {previewData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg w-[90%] h-[90%] relative overflow-hidden">
            <button
              onClick={() => setPreviewData(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              ✕
            </button>
            <iframe src={previewData.url} className="w-full h-full border-none" />
          </div>
        </div>
      )}
    </Collapsible>
  );
};
