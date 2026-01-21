"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  AuditRequestCtx,
  AuditStageApi,
  DataAuditRequestType,
  normalizeSurveillanceStage,
  StageValue,
} from "@/types/audit-request";
import { dataAuditRequestServices } from "@/services/data-audit-request";
import { toast } from "sonner";

export function AuditRequestProvider({
  data,
  onResetPage,
  debounceMs = 300,
  children,
  refetch,
}: {
  data: DataAuditRequestType[];
  onResetPage?: () => void;
  debounceMs?: number;
  children: React.ReactNode;
  refetch?: () => void;
}) {
  const [qInput, setQInput] = useState("");
  const q = useDebouncedValue(qInput, debounceMs);

  const [stage, setStage] = useState<StageValue>("all");
  const [iso, setIso] = useState<string>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stageTmp, setStageTmp] = useState<StageValue>("all");
  const [isoTmp, setIsoTmp] = useState<string>("all");

  useEffect(() => {
    if (drawerOpen) {
      setStageTmp(stage);
      setIsoTmp(iso);
    }
  }, [drawerOpen, stage, iso]);

  const isoOptions = useMemo(() => {
    const s = new Set<string>();
    (data ?? []).forEach((c) =>
      c.standards?.forEach((i) => i && s.add(i as string)),
    );
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    const qlc = q.toLowerCase();

    return (data ?? []).filter((raw) => {
      const nomorSertifikat: string = raw.name ?? "";
      const partnerName: string = raw.partner_name ?? "";
      const siteAddress: string = raw.site_address ?? "";
      const note: string = raw.note ?? "";

      const isoStandardNames: string[] = Array.isArray(raw.standards)
        ? (raw.standards.filter(Boolean) as string[])
        : [];

      const searchText =
        `${nomorSertifikat} ${partnerName} ${siteAddress} ${note} ${isoStandardNames.join(
          " ",
        )}`.toLowerCase();

      const queryHit = !q || searchText.includes(qlc);

      const normalizedStage =
        normalizeSurveillanceStage(raw.audit_stage) ??
        (raw.audit_stage?.toLowerCase() as AuditStageApi | undefined) ??
        "";

      const stageSlugLc = (normalizedStage || "").toLowerCase();

      const stageHit =
        stage === "all" ||
        (stage === "s1" &&
          (stageSlugLc === "surveilance1" ||
            stageSlugLc.includes("surveillance 1"))) ||
        (stage === "s2" &&
          (stageSlugLc === "surveilance2" ||
            stageSlugLc.includes("surveillance 2")));

      const isoHit =
        iso === "all" || isoStandardNames.some((std) => std === iso);

      return queryHit && stageHit && isoHit;
    });
  }, [data, q, stage, iso]);

  const hasActiveFilters = stage !== "all" || iso !== "all";

  const setStageSafe = (v: StageValue) => {
    setStage(v);
    onResetPage?.();
  };

  const setIsoSafe = (v: string) => {
    setIso(v);
    onResetPage?.();
  };

  const clearAll = () => {
    setStage("all");
    setIso("all");
    onResetPage?.();
  };

  const applyDrawer = () => {
    setStageSafe(stageTmp);
    setIsoSafe(isoTmp);
    setDrawerOpen(false);
  };

  const resetDrawer = () => {
    setStageTmp("all");
    setIsoTmp("all");
  };

  const [selectedRequest, setSelectedRequest] =
    useState<DataAuditRequestType | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenEdit = (req: DataAuditRequestType) => {
    setSelectedRequest(req);
    setNoteDraft(req.note ?? "");
    setIsEditOpen(true);
  };

  const handleOpenDelete = (req: DataAuditRequestType) => {
    setSelectedRequest(req);
    setIsDeleteOpen(true);
  };

  const handleSubmitNote = async ({
    certificate,
  }: {
    certificate: DataAuditRequestType;
  }) => {
    if (!selectedRequest) return;
    try {
      setIsSubmitting(true);

      const res = await dataAuditRequestServices.updateDataAuditRequest({
        id: selectedRequest.id,
        note: noteDraft,
      });

      // console.log("✅ Berhasil update catatan audit request:", res);
      // console.log(certificate);
      toast.success("Berhasil menambahkan catatan", {
        description: `Catatan pada sertifikat ${
          res?.result?.data?.name ?? res?.result?.data?.name
        } ini berhasil disimpan.`,
      });

      setIsEditOpen(false);
      refetch?.();
    } catch (error) {
      console.error("❌ Gagal menambahkan catatan:", error);

      toast.error("Gagal menambahkan catatan", {
        description:
          "Terjadi kesalahan saat menambahkan catatan. Silakan coba lagi.",
      });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRequest) return;
    try {
      setIsSubmitting(true);

      const res = await dataAuditRequestServices.deleteDataAuditRequest(
        selectedRequest.id,
      );

      // ("✅ Berhasil menghapus data ini", res);

      toast.success("Berhasil menghapus data", {
        description: `Data pada sertifikat ${
          res?.result?.data?.name ?? res?.result?.data?.name
        } ini berhasil dihapus.`,
      });

      setIsDeleteOpen(false);
      refetch?.();
    } catch (error) {
      console.error("❌ Gagal menghapus data:", error);

      toast.error("Gagal menghapus data", {
        description:
          "Terjadi kesalahan saat menghapus data. Silakan coba lagi.",
      });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: AuditRequestCtx = {
    qInput,
    setQInput,
    q,
    stage,
    setStageSafe,
    iso,
    setIsoSafe,
    drawerOpen,
    setDrawerOpen,
    isoTmp,
    setIsoTmp,
    applyDrawer,
    resetDrawer,
    hasActiveFilters,
    isoOptions,
    filtered,
    clearAll,
    selectedRequest,
    noteDraft,
    setNoteDraft,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isSubmitting,
    handleOpenEdit,
    handleOpenDelete,
    handleSubmitNote,
    handleConfirmDelete,
  };

  return (
    <AuditRequestContext.Provider value={value}>
      {children}
    </AuditRequestContext.Provider>
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

const AuditRequestContext = createContext<AuditRequestCtx | null>(null);

export function useAuditRequest() {
  const ctx = useContext(AuditRequestContext);
  if (!ctx)
    throw new Error("useAuditRequest must be used within AuditRequestProvider");
  return ctx;
}
