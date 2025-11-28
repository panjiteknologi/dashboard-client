import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  ActionTypeCtx,
  Certificate,
  StageValue,
  SurveillanceCtx,
  UrgencyValue,
} from "@/types/surveillance";
import { dataAuditRequestServices } from "@/services/data-audit-request";
import {
  AUDIT_STAGE_CAPITALIZE,
  AUDIT_STAGE_LABELS,
  normalizeSurveillanceStage,
} from "@/types/audit-request";
import { dataCRMServices } from "@/services/data-crm";
import { toast } from "sonner";

export const AUDIT_STAGE_ORDER = [
  "surveilance1",
  "surveilance2",
  "recertification",
  "surveilance3",
  "surveilance4",
  "recertification2",
  "surveilance5",
  "surveilance6",
  "recertification3",
] as const;

export type AuditStageApi = (typeof AUDIT_STAGE_ORDER)[number];

export function getNextAuditStageForCertificate(
  certificate: Certificate | null
): AuditStageApi {
  const current = normalizeSurveillanceStage(
    certificate?.surveillance_stage ?? ""
  );

  if (!current) return AUDIT_STAGE_ORDER[0];

  const idx = AUDIT_STAGE_ORDER.indexOf(current);
  if (idx === -1) return AUDIT_STAGE_ORDER[0];

  if (idx < AUDIT_STAGE_ORDER.length - 1) {
    return AUDIT_STAGE_ORDER[idx + 1];
  }

  return AUDIT_STAGE_ORDER[idx];
}

export function ReminderSurveillanceProvider({
  data,
  onResetPage,
  debounceMs = 300,
  children,
  refetch,
}: {
  data: Certificate[];
  onResetPage?: () => void;
  debounceMs?: number;
  children: React.ReactNode;
  refetch?: () => void;
}) {
  const [qInput, setQInput] = useState("");
  const q = useDebouncedValue(qInput, debounceMs);

  const [stage, setStage] = useState<StageValue>("all");
  const [urgency, setUrgency] = useState<UrgencyValue>("all");
  const [iso, setIso] = useState<string>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stageTmp, setStageTmp] = useState<StageValue>("all");
  const [urgencyTmp, setUrgencyTmp] = useState<UrgencyValue>("all");
  const [isoTmp, setIsoTmp] = useState<string>("all");

  useEffect(() => {
    if (drawerOpen) {
      setStageTmp(stage);
      setUrgencyTmp(urgency);
      setIsoTmp(iso);
    }
  }, [drawerOpen]); // eslint-disable-line

  const isoOptions = useMemo(() => {
    const s = new Set<string>();
    (data ?? []).forEach((c) =>
      c.iso_standards?.forEach((i) => i?.name && s.add(i.name))
    );
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    const qlc = q.toLowerCase();
    return (data ?? []).filter((c) => {
      const queryHit =
        !q ||
        `${c.name} ${c.nomor_sertifikat} ${c.iso_reference?.scope ?? ""} ${(
          c.iso_standards ?? []
        )
          .map((i) => i.name)
          .join(" ")}`
          .toLowerCase()
          .includes(qlc);

      const stg = (c.surveillance_stage ?? "").toLowerCase();
      const stageHit =
        stage === "all" ||
        (stage === "s1" && stg.includes("surveillance 1")) ||
        (stage === "s2" && stg.includes("surveillance 2"));

      const urgencyHit =
        urgency === "all" || (c.urgency_level ?? "").toLowerCase() === urgency;

      const isoHit =
        iso === "all" || (c.iso_standards ?? []).some((i) => i.name === iso);

      return queryHit && stageHit && urgencyHit && isoHit;
    });
  }, [data, q, stage, urgency, iso]);

  const hasActiveFilters =
    stage !== "all" || urgency !== "all" || iso !== "all";

  const setStageSafe = (v: StageValue) => {
    setStage(v);
    onResetPage?.();
  };
  const setUrgencySafe = (v: UrgencyValue) => {
    setUrgency(v);
    onResetPage?.();
  };
  const setIsoSafe = (v: string) => {
    setIso(v);
    onResetPage?.();
  };

  const clearAll = () => {
    setStage("all");
    setUrgency("all");
    setIso("all");
    onResetPage?.();
  };

  const applyDrawer = () => {
    setStageSafe(stageTmp);
    setUrgencySafe(urgencyTmp);
    setIsoSafe(isoTmp);
    setDrawerOpen(false);
  };

  const resetDrawer = () => {
    setStageTmp("all");
    setUrgencyTmp("all");
    setIsoTmp("all");
  };

  const [actionType, setActionType] = useState<ActionTypeCtx>(null);
  const [actionCert, setActionCert] = useState<Certificate | null>(null);

  const openAction = (
    cert: Certificate,
    type: Exclude<ActionTypeCtx, null>
  ) => {
    setActionCert(cert);
    setActionType(type);
  };

  const closeAction = () => {
    setActionCert(null);
    setActionType(null);
  };

  const submitContinue = async ({
    certificate,
    requestDate,
    auditStage,
  }: {
    certificate: Certificate;
    requestDate: string;
    auditStage: AuditStageApi;
  }) => {
    try {
      const res = await dataAuditRequestServices.postDataAuditRequest({
        iso_standard_ids:
          certificate.iso_standards?.map((i) => i.name ?? i.name) ?? [],
        tgl_perkiraan_audit_selesai: requestDate,
        audit_stage: auditStage,
      });

      console.log("✅ Berhasil submit audit request:", res);

      toast.success("Berhasil mengirim data", {
        description: `Data *Lanjut* untuk sertifikat ${
          certificate.nomor_sertifikat ?? certificate.name
        } berhasil dikirim.`,
      });

      closeAction();
      refetch?.();
    } catch (error) {
      console.error("❌ Gagal submit audit request:", error);

      toast.error("Gagal mengirim data", {
        description:
          "Terjadi kesalahan saat mengirim data continue. Silakan coba lagi.",
      });
    }
  };

  const resolveAuditStageSlug = (
    certificate: Certificate | null,
    auditStage?: AuditStageApi
  ): AuditStageApi => {
    if (auditStage) return auditStage;

    const label = certificate?.surveillance_stage;
    if (label && AUDIT_STAGE_CAPITALIZE[label]) {
      return AUDIT_STAGE_CAPITALIZE[label];
    }

    return "surveilance1";
  };

  const resolveTahapanAuditLabel = (
    certificate: Certificate | null,
    slug: AuditStageApi
  ): string => {
    if (certificate?.surveillance_stage) return certificate.surveillance_stage;

    return AUDIT_STAGE_LABELS[slug] ?? "";
  };

  const submitDiscontinue = async ({
    certificate,
    auditStage,
  }: {
    certificate: Certificate;
    auditStage?: AuditStageApi;
  }) => {
    try {
      const auditStageSlug = resolveAuditStageSlug(certificate, auditStage);
      const tahapanAuditLabel = resolveTahapanAuditLabel(
        certificate,
        auditStageSlug
      );

      const res = await dataCRMServices.postDataCRM({
        iso_standard_ids:
          certificate.iso_standards?.map((i) => i.name ?? i.name) ?? [],
        accreditation: certificate?.accreditation,
        audit_stage: auditStageSlug,
        tahapan_audit: tahapanAuditLabel,
      });

      console.log("✅ Payload CRM yang akan dikirim:", res);

      toast.success("Berhasil mengirim data", {
        description: `Data *Tidak Lanjut* untuk sertifikat ${
          certificate.nomor_sertifikat ?? certificate.name
        } berhasil dikirim.`,
      });

      closeAction();
      refetch?.();
    } catch (error) {
      console.error("❌ Gagal submit audit CRM:", error);

      toast.error("Gagal mengirim data", {
        description:
          "Terjadi kesalahan saat mengirim data discontinue. Silakan coba lagi.",
      });
    }
  };

  const value: SurveillanceCtx = {
    qInput,
    setQInput,
    q,
    stage,
    setStageSafe,
    urgency,
    setUrgencySafe,
    iso,
    setIsoSafe,
    drawerOpen,
    setDrawerOpen,
    stageTmp,
    setStageTmp,
    urgencyTmp,
    setUrgencyTmp,
    isoTmp,
    setIsoTmp,
    applyDrawer,
    resetDrawer,
    hasActiveFilters,
    isoOptions,
    filtered,
    clearAll,
    actionType,
    actionCert,
    openAction,
    closeAction,
    submitContinue,
    submitDiscontinue,
  };

  return (
    <ReminderSurveillanceContext.Provider value={value}>
      {children}
    </ReminderSurveillanceContext.Provider>
  );
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const ReminderSurveillanceContext = createContext<SurveillanceCtx | null>(null);

export function useReminderSurveillance() {
  const ctx = useContext(ReminderSurveillanceContext);
  if (!ctx)
    throw new Error(
      "useReminderSurveillance must be used within ReminderSurveillanceProvider"
    );
  return ctx;
}
