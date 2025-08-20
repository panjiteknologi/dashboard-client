import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Eye } from "lucide-react";
import { CapaTypes, LogNote } from "@/types/projects";

export const CapaReportDetail = ({ data }: { data: CapaTypes }) => {
  return (
    <Collapsible>
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted">
        <div>
          <p className="font-semibold text-base break-words">
            {data.document_no} - {data.customer}
          </p>
          <p className="text-sm text-muted-foreground break-words">
            {data.standards?.join(", ") || "No standards"}
          </p>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="bg-white p-4 text-sm space-y-4 max-h-[400px] overflow-auto rounded-b-md shadow-inner whitespace-normal break-words">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p>
              <strong>Reference:</strong> {data.reference}
            </p>
            <p>
              <strong>Plan Ref:</strong> {data.plan_reference || "-"}
            </p>
            <p>
              <strong>Sales Order:</strong> {data.sales_order || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Total Employee:</strong> {data.total_employee || "-"}
            </p>
            <p>
              <strong>Boundaries:</strong> {data.boundaries || "-"}
            </p>
            <p>
              <strong>Finding Type:</strong> {data.finding_type || "-"}
            </p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <p>
              <strong>Scope:</strong> {data.scope || "-"}
            </p>
            <p>
              <strong>Audit Stage:</strong> {data.audit_stage || "-"}
            </p>
            <p>
              <strong>Status:</strong> {data.status || "-"}
            </p>
          </div>
        </div>
        <div>
          <strong>Document Audit:</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {[
              { label: "Audit Plan", url: data.document_audit?.audit_plan },
              {
                label: "Attendance Sheet",
                url: data.document_audit?.attendance_sheet,
              },
              { label: "Audit Report", url: data.document_audit?.audit_report },
              {
                label: "Close Findings",
                url: data.document_audit?.close_findings,
              },
            ].map((doc, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 flex flex-col items-start bg-gray-50 shadow-sm"
              >
                <p className="font-medium text-sm mb-2">{doc.label}</p>

                {doc.url ? (
                  <>
                    {/\.(jpe?g|png|gif|webp)$/i.test(doc.url) ? (
                      <img
                        src={doc.url}
                        alt={doc.label}
                        className="w-full h-32 object-cover rounded mb-2 border"
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-white border rounded text-gray-400 text-xs italic">
                        File tersedia
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </a>
                      <a
                        href={doc.url}
                        download
                        className="text-green-600 text-xs flex items-center gap-1 hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 italic text-sm">No file</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
