import { AllProject } from "@/types/projects";
import { normalizeFieldTahapan } from "./getNormalizeTahapan";
import {
  FileCheck,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

export type StepRow = {
  tahapan: string;
  tanggalStatus: string;
  catatan: string;
  leadTime: string;
  icon?: LucideIcon;
  category?: string;
  color?: string;
};

type StepMeta = {
  icon: LucideIcon;
  category: string;
  color: string;
};

const STEP_META: Record<string, StepMeta> = {
  // COMMON
  "Aplication Form or Request": {
    icon: FileCheck,
    category: "Application",
    color: "bg-blue-500",
  },
  Kontrak: {
    icon: FileCheck,
    category: "Contract",
    color: "bg-purple-500",
  },
  "Pengiriman Draft Sertifikat": {
    icon: FileCheck,
    category: "Draft",
    color: "bg-yellow-500",
  },
   "Persetujuan Draft Sertifikat Klien": {
    icon: FileCheck,
    category: "Draft",
    color: "bg-yellow-500",
  },
  "Persetujuan Draft Sertifikat": {
    icon: CheckCircle,
    category: "Draft Approval",
    color: "bg-lime-500",
  },
  "Kirim Sertifikat": {
    icon: Award,
    category: "Issuance",
    color: "bg-emerald-500",
  },

  // INITIAL AUDIT – ST SATU (ISPO & ISO)
  "Review Penugasan ST Satu": {
    icon: Award,
    category: "Assignment",
    color: "bg-indigo-500",
  },
  "Pengajuan Notifikasi ST Satu": {
    icon: Calendar,
    category: "Notification",
    color: "bg-pink-500",
  },
  "Pengiriman Notifikasi ST Satu": {
    icon: Calendar,
    category: "Notification",
    color: "bg-pink-500",
  },
  "Persetujuan Notifikasi ST Satu": {
    icon: CheckCircle,
    category: "Approval",
    color: "bg-green-500",
  },
  "Pengiriman Audit Plan ST Satu": {
    icon: Calendar,
    category: "Planning",
    color: "bg-rose-500",
  },
  "Pelaksanaan Audit ST Satu": {
    icon: CheckCircle,
    category: "Audit",
    color: "bg-orange-500",
  },
  "Penyelesaian CAPA ST Satu": {
    icon: AlertCircle,
    category: "Resolution",
    color: "bg-amber-500",
  },
  "Proses Review ST Satu": {
    icon: AlertCircle,
    category: "Review",
    color: "bg-sky-500",
  },
  "Pengambilan Keputusan ST Satu": {
    icon: Award,
    category: "Decision",
    color: "bg-teal-500",
  },

  // SURVEILLANCE / ST DUA (VERSI LENGKAP)
  "Review Penugasan ST Dua": {
    icon: Award,
    category: "Assignment",
    color: "bg-indigo-500",
  },
  "Pengajuan Notifikasi ST Dua": {
    icon: Calendar,
    category: "Notification",
    color: "bg-pink-500",
  },
  "Pengiriman Notifikasi ST Dua": {
    icon: Calendar,
    category: "Notification",
    color: "bg-pink-500",
  },
  "Persetujuan Notifikasi ST Dua": {
    icon: CheckCircle,
    category: "Approval",
    color: "bg-green-500",
  },
  "Pengiriman Audit Plan ST Dua": {
    icon: Calendar,
    category: "Planning",
    color: "bg-rose-500",
  },
  "Pelaksanaan Audit ST Dua": {
    icon: CheckCircle,
    category: "Audit",
    color: "bg-orange-500",
  },
  "Penyelesaian CAPA ST Dua": {
    icon: AlertCircle,
    category: "Resolution",
    color: "bg-amber-500",
  },
  "Proses Review ST Dua": {
    icon: AlertCircle,
    category: "Review",
    color: "bg-sky-500",
  },
  "Pengambilan Keputusan ST Dua": {
    icon: Award,
    category: "Decision",
    color: "bg-teal-500",
  },

  // SURVEILLANCE / GENERIC (ISPO & ISO)
  "Review Penugasan": {
    icon: Award,
    category: "Assignment",
    color: "bg-indigo-500",
  },
  "Pengiriman Notifikasi": {
    icon: Calendar,
    category: "Notification",
    color: "bg-pink-500",
  },
  "Persetujuan Notifikasi": {
    icon: CheckCircle,
    category: "Approval",
    color: "bg-green-500",
  },
  "Pengiriman Audit Plan": {
    icon: Calendar,
    category: "Planning",
    color: "bg-rose-500",
  },
  "Pelaksanaan Audit": {
    icon: CheckCircle,
    category: "Audit",
    color: "bg-orange-500",
  },
  "Penyelesaian CAPA": {
    icon: AlertCircle,
    category: "Resolution",
    color: "bg-amber-500",
  },
  "Proses Review": {
    icon: AlertCircle,
    category: "Review",
    color: "bg-sky-500",
  },
  "Pengambilan Keputusan": {
    icon: Award,
    category: "Decision",
    color: "bg-teal-500",
  },
};

function attachMeta(
  row: Omit<StepRow, "icon" | "category" | "color">
): StepRow {
  const { tahapan } = row;

  let meta = STEP_META[tahapan];

  // dynamic tahapan: "Pengajuan ke X", "Persetujuan ke X"
  if (!meta) {
    if (tahapan.startsWith("Pengajuan ke ")) {
      meta = {
        icon: Award,
        category: "Submission",
        color: "bg-lime-500",
      };
    } else if (tahapan.startsWith("Persetujuan ke ")) {
      meta = {
        icon: CheckCircle,
        category: "Approval",
        color: "bg-green-500",
      };
    }
  }

  return {
    ...row,
    ...meta,
  };
}

function getFieldAuditISPO(field: AllProject): StepRow[] {
  return [
    attachMeta({
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.tgl_aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Review Penugasan ST Satu",
      tanggalStatus: field?.tgl_review_penugasan_st_satu || "",
      catatan: field?.note_tgl_review_penugasan_st_satu || "",
      leadTime: field?.lead_time_aplication_form_to_review_penugasan || "",
    }),
    attachMeta({
      tahapan: "Kontrak",
      tanggalStatus: field?.tgl_kontrak || "",
      catatan: field?.note_tgl_kontrak || "",
      leadTime: field?.lead_time_tgl_kontrak || "",
    }),
    attachMeta({
      tahapan: "Pengajuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_pengiriman_notif_st_satu || "",
      catatan: field?.note_tgl_pengiriman_notif_st_satu || "",
      leadTime:
        field?.lead_time_review_penugasan_to_pengiriman_notifikasi_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Persetujuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_persetujuan_notif_st_satu || "",
      catatan: field?.note_tgl_persetujuan_notif_st_satu || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengiriman Audit Plan ST Satu",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_satu || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_notifikasi_st_satu_to_pengiriman_audit_plan_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Pelaksanaan Audit ST Satu",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_satu || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_audit_plan_st_satu_to_pelaksanaan_audit_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Penyelesaian CAPA ST Satu",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_satu || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_satu || "",
      leadTime:
        field?.lead_time_pelaksanaan_audit_st_satu_to_penyelesaian_capa_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Proses Review ST Satu",
      tanggalStatus: field?.tgl_proses_review_tahap_satu || "",
      catatan: field?.note_tgl_proses_review_tahap_satu || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengambilan Keputusan ST Satu",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_satu || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_satu || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Review Penugasan ST Dua",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengajuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Persetujuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengiriman Audit Plan ST Dua",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pelaksanaan Audit ST Dua",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Penyelesaian CAPA ST Dua",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Proses Review ST Dua",
      tanggalStatus: field?.tgl_proses_review_tahap_dua || "",
      catatan: field?.note_tgl_proses_review_tahap_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengambilan Keputusan ST Dua",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_dua || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    }),
    attachMeta({
      tahapan: "Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    }),
  ];
}

function getFieldAuditISO(field: AllProject): StepRow[] {
  return [
    attachMeta({
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.tgl_aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime:
        field?.lead_time_tgl_aplication_form_to_tgl_review_penugasan_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Review Penugasan ST Satu",
      tanggalStatus: field?.tgl_review_penugasan_st_satu || "",
      catatan: field?.note_tgl_review_penugasan_st_satu || "",
      leadTime:
        field?.lead_time_tgl_review_penugasan_st_satu_to_tgl_kontrak || "",
    }),
    attachMeta({
      tahapan: "Kontrak",
      tanggalStatus: field?.tgl_kontrak || "",
      catatan: field?.note_tgl_kontrak || "",
      leadTime:
        field?.lead_time_tgl_kontrak_to_tgl_pengiriman_notif_st_satu || "",
    }),
    attachMeta({
      tahapan: "Pengiriman Notifikasi ST Satu",
      tanggalStatus: field?.tgl_pengiriman_notif_st_satu || "",
      catatan: field?.note_tgl_pengiriman_notif_st_satu || "",
      leadTime:
        field?.lead_time_review_penugasan_to_pengiriman_notifikasi_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Pengiriman Audit Plan ST Satu",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_satu || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_satu || "",
      leadTime:
        field?.lead_time_tgl_pengiriman_audit_plan_st_satu_to_tgl_pelaksanaan_audit_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Pelaksanaan Audit ST Satu",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_satu || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_audit_plan_st_satu_to_pelaksanaan_audit_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Penyelesaian CAPA ST Satu",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_satu || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_satu || "",
      leadTime:
        field?.lead_time_tgl_pelaksanaan_audit_st_satu_to_tgl_penyelesaian_capa_st_satu ||
        "",
    }),
    attachMeta({
      tahapan: "Persetujuan Draft Sertifikat Klien",
      tanggalStatus: field?.tgl_peersetujaun_draft_sertifikat || "",
      catatan: field?.note_tgl_peersetujaun_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tgl_peersetujaun_draft_sertifikat_to_tgl_pengajuan || "",
    }),
    // attachMeta({
    //   tahapan: "Pengiriman Draft Sertifikat",
    //   tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
    //   catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
    //   leadTime:
    //     field?.lead_time_tgl_pengiriman_draft_sertifikat_to_tgl_pengajuan || "",
    // }),
    // attachMeta({
    //   tahapan: "Pengajuan ke " + (field?.nama_akreditasi || "KAN"),
    //   tanggalStatus: field?.tgl_pengajuan || "",
    //   catatan: field?.note_tgl_pengajuan || "",
    //   leadTime: field?.lead_time_tgl_pengajuan_to_tgl_persetujuan || "",
    // }),
    attachMeta({
      tahapan: "Persetujuan ke " + (field?.nama_akreditasi || "KAN"),
      tanggalStatus: field?.tgl_persetujuan || "",
      catatan: field?.note_tgl_persetujuan || "",
      leadTime: field?.lead_time_tgl_persetujuan_to_tgl_kirim_sertifikat || "",
    }),
    attachMeta({
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    }),
  ];
}

function getFieldISPO(field: AllProject): StepRow[] {
  return [
    attachMeta({
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.tgl_aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Review Penugasan",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengiriman Notifikasi",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Persetujuan Notifikasi",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengiriman Audit Plan",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pelaksanaan Audit",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Penyelesaian CAPA",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Proses Review",
      tanggalStatus: field?.tgl_proses_review_tahap_dua || "",
      catatan: field?.note_tgl_proses_review_tahap_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengambilan Keputusan",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_dua || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_dua || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    }),
    attachMeta({
      tahapan: "Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    }),
    attachMeta({
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    }),
  ];
}

function getFieldISO(field: AllProject): StepRow[] {
  return [
    attachMeta({
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.tgl_aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime:
        field?.lead_time_tgl_aplication_form_to_tgl_review_penugasan || "",
    }),
    attachMeta({
      tahapan: "Review Penugasan",
      tanggalStatus: field?.tgl_review_penugasan || "",
      catatan: field?.note_tgl_review_penugasan || "",
      leadTime:
        field?.lead_time_tgl_review_penugasan_to_tgl_pengiriman_notif || "",
    }),
    attachMeta({
      tahapan: "Pengiriman Notifikasi",
      tanggalStatus: field?.tgl_pengiriman_notif || "",
      catatan: field?.note_tgl_pengiriman_notif || "",
      leadTime:
        field?.lead_time_tgl_pengiriman_notif_to_tgl_pengiriman_audit_plan ||
        "",
    }),
    attachMeta({
      tahapan: "Pengiriman Audit Plan",
      tanggalStatus: field?.tgl_pengiriman_audit_plan || "",
      catatan: field?.note_tgl_pengiriman_audit_plan || "",
      leadTime:
        field?.lead_time_tgl_pengiriman_audit_plan_to_tgl_pelaksanaan_audit ||
        "",
    }),
    attachMeta({
      tahapan: "Pelaksanaan Audit",
      tanggalStatus: field?.tgl_pelaksanaan_audit || "",
      catatan: field?.note_tgl_pelaksanaan_audit || "",
      leadTime:
        field?.lead_time_tgl_pelaksanaan_audit_to_tgl_penyelesaian_capa || "",
    }),
    attachMeta({
      tahapan: "Penyelesaian CAPA",
      tanggalStatus: field?.tgl_penyelesaian_capa || "",
      catatan: field?.note_tgl_penyelesaian_capa || "",
      leadTime:
        field?.lead_time_tgl_penyelesaian_capa_to_tgl_pengiriman_draft_sertifikat ||
        "",
    }),
    attachMeta({
      tahapan: "Persetujuan Draft Sertifikat Klien",
      tanggalStatus: field?.tgl_peersetujaun_draft_sertifikat || "",
      catatan: field?.note_tgl_peersetujaun_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tgl_peersetujaun_draft_sertifikat_to_tgl_pengajuan || "",
    }),
    // attachMeta({
    //   tahapan: "Pengiriman Draft Sertifikat",
    //   tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
    //   catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
    //   leadTime:
    //     field?.lead_time_tgl_pengiriman_draft_sertifikat_to_tgl_pengajuan || "",
    // }),
    // attachMeta({
    //   tahapan: "Pengajuan ke " + (field?.nama_akreditasi || "KAN"),
    //   tanggalStatus: field?.tgl_pengajuan || "",
    //   catatan: field?.note_tgl_pengajuan || "",
    //   leadTime: field?.lead_time_tgl_pengajuan_to_tgl_persetujuan || "",
    // }),
    attachMeta({
      tahapan: "Persetujuan ke " + (field?.nama_akreditasi || "KAN"),
      tanggalStatus: field?.tgl_persetujuan || "",
      catatan: field?.note_tgl_persetujuan || "",
      leadTime: field?.lead_time_tgl_persetujuan_to_tgl_kirim_sertifikat || "",
    }),
    attachMeta({
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    }),
  ];
}

export function getlatestProgress(field: AllProject): string {
  const normalizedField = normalizeFieldTahapan(field);
  const step = Number(normalizedField?.tahapan ?? 0);

  const latestProgressAuditISPO = getFieldAuditISPO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus).getTime() -
        new Date(a.tanggalStatus).getTime()
    )[0];

  const latestProgressAuditISO = getFieldAuditISO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus).getTime() -
        new Date(a.tanggalStatus).getTime()
    )[0];

  const latestProgressISPO = getFieldISPO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus).getTime() -
        new Date(a.tanggalStatus).getTime()
    )[0];

  const latestProgressISO = getFieldISO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus).getTime() -
        new Date(a.tanggalStatus).getTime()
    )[0];

  if (typeof window !== "undefined" && window.location?.pathname === "/ispo") {
    if (latestProgressAuditISPO && (step === 1 || step === 7)) {
      return latestProgressAuditISPO.tahapan ?? "";
    }
    if (latestProgressISPO && step > 1) {
      return latestProgressISPO.tahapan ?? "";
    }
  } else {
    if (latestProgressAuditISO && step === 1) {
      return latestProgressAuditISO.tahapan ?? "";
    }
    if (latestProgressISO && step > 1) {
      return latestProgressISO.tahapan ?? "";
    }
  }

  return "";
}

export function getDataTable(field: AllProject): StepRow[] | null {
  const normalizedField = normalizeFieldTahapan(field);
  const step = Number(normalizedField?.tahapan ?? 0);

  if (typeof window !== "undefined" && window.location?.pathname === "/ispo") {
    if (step === 1 || step === 7) {
      return getFieldAuditISPO(field);
    }
    if (step > 1 && step <= 6) {
      return getFieldISPO(field);
    }
  } else {
    if (step === 1) {
      return getFieldAuditISO(field);
    }
    if (step > 1) {
      return getFieldISO(field);
    }
  }

  return null;
}

export function getNextStep(field: AllProject): string {
  const normalizedField = normalizeFieldTahapan(field);
  const step = Number(normalizedField?.tahapan ?? 0);

  const latest = `${getlatestProgress(field)}`;

  if (typeof window !== "undefined" && window.location?.pathname === "/ispo") {
    if (step === 1 || step === 7) {
      const auditISPO = getFieldAuditISPO(field);
      const indexInitialAudit =
        auditISPO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexInitialAudit > auditISPO.length - 1;

      return isDone ? "DONE" : (auditISPO[indexInitialAudit]?.tahapan ?? "");
    }

    if (step > 1) {
      const survISPO = getFieldISPO(field);
      const indexSurveillance =
        survISPO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexSurveillance > survISPO.length - 1;

      return isDone ? "DONE" : (survISPO[indexSurveillance]?.tahapan ?? "");
    }
  } else {
    if (step === 1) {
      const auditISO = getFieldAuditISO(field);
      const indexInitialAudit =
        auditISO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexInitialAudit > auditISO.length - 1;

      return isDone ? "DONE" : (auditISO[indexInitialAudit]?.tahapan ?? "");
    }
    if (step > 1) {
      const survISO = getFieldISO(field);
      const indexSurveillance =
        survISO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexSurveillance > survISO.length - 1;

      return isDone ? "DONE" : (survISO[indexSurveillance]?.tahapan ?? "");
    }
  }

  return "";
}
