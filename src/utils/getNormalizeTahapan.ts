import { Tahapan } from "@/constant/tahapan";
import { AllProject } from "@/types/projects";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { getDataTable } from "./getProgressAndField";

const tahapan: Record<string, string> = {
  "SV 1": "surveilance1",
  "Surveillance 1": "surveilance1",

  "SV 2": "surveilance2",
  "Surveillance 2": "surveilance2",

  "SV 3": "surveilance3",
  "Surveillance 3": "surveilance3",

  "SV 4": "surveilance4",
  "Surveillance 4": "surveilance4",

  "SV 5": "surveilance5",
  "Surveillance 5": "surveilance5",

  IA: "IA",
  RC: "recertification",
  Recertification: "recertification",

  Special: "SP",
};

export function findTahapan(namaTahapan: string) {
  if (!namaTahapan) return null;

  const normalizedKode = tahapan[namaTahapan] ?? namaTahapan;

  return Tahapan.find((item) => item.kode === normalizedKode);
}

export function normalizeFieldTahapan(field: AllProject) {
  const tahapanValue = field.tahapan as string;
  const tahapanData = findTahapan(tahapanValue);

  return {
    ...field,
    tahapan: tahapanData?.id_tahapan ?? null,
    nama_tahapan: tahapanData?.nama_tahapan,
  };
}

export function getProjectStatus(tahapan: string) {
  const normalized = findTahapan(tahapan);
  const kode = normalized?.kode ?? "";

  if (["sertifikat", "selesai"].includes(kode)) {
    return {
      status: "Completed",
      variant: "default" as const,
      icon: CheckCircle,
      textColor: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    };
  }

  if (kode.startsWith("surveilance")) {
    return {
      status: "Surveillance",
      variant: "secondary" as const,
      icon: Clock,
      textColor: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    };
  }

  if (kode.includes("audit")) {
    return {
      status: "In Audit",
      variant: "secondary" as const,
      icon: AlertCircle,
      textColor: "text-orange-700",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
    };
  }

  return {
    status: "In Progress",
    variant: "outline" as const,
    icon: Clock,
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  };
}

const PROGRESS_BY_KODE: Record<string, number> = {
  survei: 10,
  audit1: 20,
  audit2: 35,
  surveilance1: 50,
  surveilance2: 65,
  surveilance3: 80,
  surveilance4: 90,
  surveilance5: 95,
  sertifikat: 100,
  selesai: 100,
};

export function getProgressPercentage(data: AllProject) {
  try {
    const normalized = findTahapan(data?.tahapan as string);
    const kode = normalized?.kode;

    if (!kode) return 0;

    const steps = getDataTable(data) || [];
    if (steps.length > 0) {
      const completed = steps.filter((s) => s.tanggalStatus?.trim()).length;

      return Math.min(Math.round((completed / steps.length) * 100), 100);
    }

    return PROGRESS_BY_KODE[kode] ?? 0;
  } catch {
    const normalized = findTahapan(data?.tahapan as string);
    return PROGRESS_BY_KODE[normalized?.kode ?? ""] ?? 0;
  }
}
