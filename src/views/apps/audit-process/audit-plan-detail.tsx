import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { PlanTypes } from "@/types/projects";

export const AuditPlanDetail = ({ data }: { data: PlanTypes }) => {
  return (
    <Collapsible>
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted">
        <div>
          <p className="font-semibold text-base break-words">
            {data?.document_no || "-"} - {data?.customer || "-"}
          </p>
          <p className="text-sm text-muted-foreground break-words">
            {data?.standards?.join(", ") || "No standards"}
          </p>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="bg-white p-4 text-sm space-y-6 max-h-[600px] overflow-auto rounded-b-md shadow-inner whitespace-normal break-words">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p>
              <strong>Contract Number:</strong> {data?.contract_number || "-"}
            </p>
            <p>
              <strong>Contract Date:</strong> {data?.contract_date || "-"}
            </p>
            <p>
              <strong>Reference:</strong> {data?.reference || "-"}
            </p>
            <p>
              <strong>Scope:</strong> {data?.scope || "-"}
            </p>
            <p>
              <strong>Boundaries:</strong> {data?.boundaries || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Contact Person:</strong> {data?.contact_person || "-"}
            </p>
            <p>
              <strong>No Telepon:</strong> {data?.contact_phone || "-"}
            </p>
            <p>
              <strong>IAF Code Existing:</strong> {data?.iaf_code || "-"}
            </p>
            <p>
              <strong>Certification Type:</strong>{" "}
              {data?.certification_type || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p>
              <strong>Audit Stage:</strong> {data?.audit_stage || "-"}
            </p>
            <p>
              <strong>Audit Start:</strong> {data?.audit_start || "-"}
            </p>
            <p>
              <strong>Audit End:</strong> {data?.audit_end || "-"}
            </p>
            <p>
              <strong>Metode Audit:</strong> {data?.audit_method || "-"}
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <strong>Lead Auditor:</strong> {data?.lead_auditor || "-"}
            </p>
            <p>
              <strong>Technical Expert:</strong> {data?.technical_expert || "-"}
            </p>
            <p>
              <strong>Auditor 1:</strong> {data?.auditor1 || "-"}
            </p>
            <p>
              <strong>Auditor 2:</strong> {data?.auditor2 || "-"}
            </p>
            <p>
              <strong>Auditor 3:</strong> {data?.auditor3 || "-"}
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
