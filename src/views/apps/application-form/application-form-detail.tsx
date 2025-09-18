/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Collapsible } from "@/components/ui/collapsible";
import { Mail, Globe, Phone } from "lucide-react";
import {
  ApplicationFormDetailType,
  RowApplicationFormType,
} from "@/types/projects";
import { useISOSectionQuery } from "@/hooks/use-data-iso";

type DetailData = RowApplicationFormType &
  ApplicationFormDetailType & {
    id?: number;
    available_sections?: string[];
  };

export const ApplicationFormDetail = ({ data }: { data: DetailData }) => {
  const [open] = React.useState(true);

  const yesNo = (v?: string) =>
    (v ?? "").toString().trim().toUpperCase() || "-";

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatLabel = (val?: string) =>
    val ? val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "-";

  const mailOrDash = (v?: string) =>
    v ? (
      <a href={`mailto:${v}`} className="underline underline-offset-2">
        <span className="inline-flex items-center gap-1">
          <Mail className="w-3.5 h-3.5" />
          {v}
        </span>
      </a>
    ) : (
      "-"
    );

  const telOrDash = (v?: string) =>
    v ? (
      <a href={`tel:${v}`} className="underline underline-offset-2">
        <span className="inline-flex items-center gap-1">
          <Phone className="w-3.5 h-3.5" />
          {v}
        </span>
      </a>
    ) : (
      "-"
    );

  const webOrDash = (v?: string) =>
    v ? (
      <a
        href={/^https?:\/\//i.test(v) ? v : `https://${v}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        <span className="inline-flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" />
          {v}
        </span>
      </a>
    ) : (
      "-"
    );

  const toNameList = (val: unknown): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val
        .map((v) => {
          if (
            typeof v === "string" ||
            typeof v === "number" ||
            typeof v === "boolean"
          )
            return String(v);
          if (v && typeof v === "object") {
            const anyV = v as Record<string, unknown>;
            if (typeof anyV.name === "string") return anyV.name;
            if (typeof anyV.code === "string") return anyV.code;
            if (typeof anyV.value === "string") return anyV.value;
          }
          return undefined;
        })
        .filter(Boolean) as string[];
    }
    if (typeof val === "object") {
      const anyV = val as Record<string, unknown>;
      if (typeof anyV.name === "string") return [anyV.name];
      if (typeof anyV.code === "string") return [anyV.code];
      if (typeof anyV.value === "string") return [anyV.value];
    }
    return [];
  };

  const toText = (val: unknown): string => {
    if (val == null || val === "") return "-";
    if (
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean"
    )
      return String(val);
    if (Array.isArray(val)) return toNameList(val).join(", ");
    if (typeof val === "object") {
      const anyV = val as Record<string, unknown>;
      if (typeof anyV.name === "string") return anyV.name;
      if (typeof anyV.code === "string") return anyV.code;
      if (typeof anyV.value === "string") return anyV.value;
      try {
        return JSON.stringify(anyV);
      } catch {
        return "-";
      }
    }
    return "-";
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <section className="rounded-lg border bg-white">
      <div className="px-4 py-3 border-b bg-slate-50/70">
        <h3 className="text-xs md:text-sm font-semibold tracking-wide text-slate-700 uppercase">
          {title}
        </h3>
      </div>
      <div className="p-3 md:p-4">
        <dl className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-6">
          {children}
        </dl>
      </div>
    </section>
  );

  const Field: React.FC<{
    label: string;
    value?: React.ReactNode;
    hidden?: boolean;
  }> = ({ label, value, hidden }) =>
    hidden ? null : (
      <div className="py-2 md:py-2.5 border-b last:border-b-0 md:border-b-0">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-start">
          <dt className="sm:col-span-4 text-xs md:text-sm text-muted-foreground">
            {label}
          </dt>
          <dd className="sm:col-span-8 sm:border-l sm:pl-4 text-sm whitespace-pre-wrap break-words">
            {value ?? "-"}
          </dd>
        </div>
      </div>
    );

  const sections = data.available_sections ?? [
    "general",
    "scope",
    "standards",
    "declaration",
    "integrated_audit",
    "additional_info",
  ];

  const has = (name: string) => sections.includes(name);

  const { data: generalRes, isLoading: loadingGeneral } = useISOSectionQuery(
    data.id,
    "general",
    open && !!data.id && has("general")
  );
  const { data: scopeRes, isLoading: loadingScope } = useISOSectionQuery(
    data.id,
    "scope",
    open && !!data.id && has("scope")
  );
  const { data: standardsRes, isLoading: loadingStandards } =
    useISOSectionQuery(
      data.id,
      "standards",
      open && !!data.id && has("standards")
    );
  const { data: declarationRes, isLoading: loadingDeclaration } =
    useISOSectionQuery(
      data.id,
      "declaration",
      open && !!data.id && has("declaration")
    );
  const { data: integratedRes, isLoading: loadingIntegrated } =
    useISOSectionQuery(
      data.id,
      "integrated_audit",
      open && !!data.id && has("integrated_audit")
    );
  const { data: additionalRes, isLoading: loadingAdditional } =
    useISOSectionQuery(
      data.id,
      "additional_info",
      open && !!data.id && has("additional_info")
    );

  const g = { ...(data as any), ...(generalRes?.data ?? {}) };
  const s = { ...(data as any), ...(scopeRes?.data ?? {}) };
  const ms = { ...(data as any), ...(standardsRes?.data ?? {}) };
  const dcl = { ...(data as any), ...(declarationRes?.data ?? {}) };
  const ia = { ...(data as any), ...(integratedRes?.data ?? {}) };
  const add = { ...(data as any), ...(additionalRes?.data ?? {}) };

  const standardsList = toNameList(
    (ms as any).standards ?? (ms as any).iso_standard_ids ?? data.standards
  );
  const segments = toNameList(dcl.segment_id ?? dcl.segment);
  const integrated = ia.integrated_audit ?? ia.integreted_audit ?? "";

  const auditStageText = toText(ms.audit_stage ?? data.audit_stage);
  const auditStageFormatted =
    auditStageText !== "-" ? formatLabel(auditStageText) : "-";

  return (
    <Collapsible open={open} className="space-y-4">
      {has("general") && (
        <Section title="General Company Information">
          <Field label="Document No" value={toText(g.document_no)} />
          <Field label="Company Name" value={toText(g.customer_name)} />
          <Field label="Office Address" value={toText(g.office_address)} />
          <Field
            label="Invoicing Address"
            value={toText(g.invoicing_address)}
          />
          <Field label="Contact Person" value={toText(g.contact_person)} />
          <Field
            label="Telephone"
            value={telOrDash(
              toText(g.contact_phone) !== "-"
                ? String(g.contact_phone)
                : undefined
            )}
          />
          <Field label="Position" value={toText(g.position)} />
          <Field label="Fax" value={toText(g.fax)} />
          <Field
            label="Email"
            value={mailOrDash(
              toText(g.email) !== "-" ? String(g.email) : undefined
            )}
          />
          <Field
            label="Website"
            value={webOrDash(
              toText(g.website) !== "-" ? String(g.website) : undefined
            )}
          />
          <Field
            label="Issued Date"
            value={formatDate(
              toText(g.issued_date) !== "-" ? String(g.issued_date) : undefined
            )}
          />
          <Field label="Sale Order" value={toText(g.sale_order)} />
          {loadingGeneral && (
            <div className="col-span-2 text-xs text-muted-foreground pt-2">
              Loading general…
            </div>
          )}
        </Section>
      )}

      {has("scope") && (
        <Section title="Scope and Boundaries">
          <Field label="Scope" value={toText(s.scope)} />
          <Field label="Boundaries" value={toText(s.boundaries)} />
          {loadingScope && (
            <div className="col-span-2 text-xs text-muted-foreground pt-2">
              Loading scope…
            </div>
          )}
        </Section>
      )}

      {has("standards") && (
        <Section title="Management system standard(s)">
          <Field
            label="Standards"
            value={
              standardsList.length ? (
                <div className="flex flex-wrap gap-1">
                  {standardsList.map((std, i) => (
                    <span
                      key={`${std}-${i}`}
                      className="text-[10px] md:text-xs px-2 py-0.5 border rounded-full bg-slate-100"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              ) : (
                "-"
              )
            }
          />
          <Field label="Audit Stage" value={auditStageFormatted} />
          <Field label="Certification Type" value={toText(ms.certification)} />
          <Field label="Number of Site" value={toText(ms.number_of_site)} />
          <Field label="Remarks" value={toText(ms.remarks)} />
          <Field label="Attachment" value={toText(ms.attachment)} />
          {loadingStandards && (
            <div className="col-span-2 text-xs text-muted-foreground pt-2">
              Loading standards…
            </div>
          )}
        </Section>
      )}

      {has("declaration") && (
        <Section title="Declaration">
          <Field
            label="Segment"
            value={
              segments.length ? (
                <div className="flex flex-wrap gap-1">
                  {segments.map((seg, i) => (
                    <span
                      key={`${seg}-${i}`}
                      className="text-[10px] md:text-xs px-2 py-0.5 border rounded-full bg-slate-100"
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              ) : (
                "-"
              )
            }
          />
          <Field label="Category" value={toText(dcl.category)} />
          <Field label="Declaration" value={toText(dcl.declaration)} />
          <Field label="Signature" value={toText(dcl.signature)} />
          <Field label="Sales Person" value={toText(dcl.sales_person)} />
          <Field
            label="Created By"
            value={toText(dcl.created_by_full ?? dcl.created_by)}
          />
          <Field label="Akomodasi by Hotel" value={toText(dcl.hotel_by)} />
          <Field label="Transport By" value={toText(dcl.transport_by)} />
          {loadingDeclaration && (
            <div className="col-span-2 text-xs text-muted-foreground pt-2">
              Loading declaration…
            </div>
          )}
        </Section>
      )}

      {has("integrated_audit") && (
        <Section title="Integrated Audit">
          <Field label="Integrated Audit" value={yesNo(integrated)} />
          {loadingIntegrated && (
            <div className="col-span-2 text-xs text-muted-foreground pt-2">
              Loading integrated audit…
            </div>
          )}
        </Section>
      )}

      {has("additional_info") && (
        <Section title="Associate">
          <Field label="Associate" value={toText(add.assciate)} />
          <Field
            label="Associative Name"
            value={toText(add.associative_name)}
          />
          <Field label="Email" value={toText(add.email)} />
          <Field label="Fax" value={toText(add.fax)} />
          {loadingAdditional && (
            <div className="col-span-2 text-xs text-muted-foreground pt-2">
              Loading additional info…
            </div>
          )}
        </Section>
      )}
    </Collapsible>
  );
};
