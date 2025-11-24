import { AllProject } from "@/types/projects";
import { normalizeFieldTahapan } from "./getNormalizeTahapan";

function getFieldAuditISPO(field: AllProject) {
  return [
    {
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Review Penugasan ST Satu",
      tanggalStatus: field?.tgl_review_penugasan_st_satu || "",
      catatan: field?.note_tgl_review_penugasan_st_satu || "",
      leadTime: field?.lead_time_aplication_form_to_review_penugasan || "",
    },
    {
      tahapan: "Kontrak",
      tanggalStatus: field?.tgl_kontrak || "",
      catatan: field?.note_tgl_kontrak || "",
      leadTime: field?.lead_time_tgl_kontrak || "",
    },
    {
      tahapan: "Pengajuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_pengiriman_notif_st_satu || "",
      catatan: field?.note_tgl_pengiriman_notif_st_satu || "",
      leadTime:
        field?.lead_time_review_penugasan_to_pengiriman_notifikasi_st_satu ||
        "",
    },
    {
      tahapan: "Persetujuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_persetujuan_notif_st_satu || "",
      catatan: field?.note_tgl_persetujuan_notif_st_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Audit Plan ST Satu",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_satu || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_notifikasi_st_satu_to_pengiriman_audit_plan_st_satu ||
        "",
    },
    {
      tahapan: "Pelaksanaan Audit ST Satu",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_satu || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_audit_plan_st_satu_to_pelaksanaan_audit_st_satu ||
        "",
    },
    {
      tahapan: "Penyelesaian CAPA ST Satu",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_satu || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_satu || "",
      leadTime:
        field?.lead_time_pelaksanaan_audit_st_satu_to_penyelesaian_capa_st_satu ||
        "",
    },
    {
      tahapan: "Proses Review ST Satu",
      tanggalStatus: field?.tgl_proses_review_tahap_satu || "",
      catatan: field?.note_tgl_proses_review_tahap_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Pengambilan Keputusan ST Satu",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_satu || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Review Penugasan ST Dua",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengajuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Persetujuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Audit Plan ST Dua",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pelaksanaan Audit ST Dua",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Penyelesaian CAPA ST Dua",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Proses Review ST Dua",
      tanggalStatus: field?.tgl_proses_review_tahap_dua || "",
      catatan: field?.note_tgl_proses_review_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengambilan Keputusan ST Dua",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_dua || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

function getFieldAuditISO(field: AllProject) {
  return [
    {
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Review Penugasan ST Satu",
      tanggalStatus: field?.tgl_review_penugasan_st_satu || "",
      catatan: field?.note_tgl_review_penugasan_st_satu || "",
      leadTime: field?.lead_time_aplication_form_to_review_penugasan || "",
    },
    {
      tahapan: "Kontrak",
      tanggalStatus: field?.tgl_kontrak || "",
      catatan: field?.note_tgl_kontrak || "",
      leadTime: field?.lead_time_tgl_kontrak || "",
    },
    {
      tahapan: "Pengiriman Notifikasi ST Satu",
      tanggalStatus: field?.tgl_pengiriman_notif_st_satu || "",
      catatan: field?.note_tgl_pengiriman_notif_st_satu || "",
      leadTime:
        field?.lead_time_review_penugasan_to_pengiriman_notifikasi_st_satu ||
        "",
    },
    {
      tahapan: "Persetujuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_persetujuan_notif_st_satu || "",
      catatan: field?.note_tgl_persetujuan_notif_st_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Audit Plan ST Satu",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_satu || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_satu || "",
      leadTime: field?.lead_time_tgl_pengiriman_audit_plan_st_satu || "",
    },
    {
      tahapan: "Pelaksanaan Audit ST Satu",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_satu || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_audit_plan_st_satu_to_pelaksanaan_audit_st_satu ||
        "",
    },
    {
      tahapan: "Penyelesaian CAPA ST Satu",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_satu || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_satu || "",
      leadTime:
        field?.lead_time_pelaksanaan_audit_st_satu_to_penyelesaian_capa_st_satu ||
        "",
    },
    {
      tahapan: "Review Penugasan ST Dua",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Notifikasi ST Dua",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Persetujuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Audit Plan ST Dua",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pelaksanaan Audit ST Dua",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Penyelesaian CAPA ST Dua",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Pengajuan ke " + (field?.nama_akreditasi || "KAN"),
      tanggalStatus: field?.tgl_pengajuan_ke_kan || "",
      catatan: field?.note_tgl_pengajuan_ke_kan || "",
      leadTime: field?.lead_time_tgl_pengajuan_ke_kan || "",
    },
    {
      tahapan: "Persetujuan ke " + (field?.nama_akreditasi || "KAN"),
      tanggalStatus: field?.tgl_persetujuan_kan || "",
      catatan: field?.note_tgl_persetujuan_kan || "",
      leadTime: field?.lead_time_tgl_persetujuan_kan || "",
    },
    {
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

function getFieldISPO(field: AllProject) {
  return [
    {
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Review Penugasan",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Notifikasi",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Persetujuan Notifikasi",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Audit Plan",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pelaksanaan Audit",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Penyelesaian CAPA",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Proses Review",
      tanggalStatus: field?.tgl_proses_review_tahap_dua || "",
      catatan: field?.note_tgl_proses_review_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengambilan Keputusan",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_dua || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

function getFieldISO(field: AllProject) {
  return [
    {
      tahapan: "Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Review Penugasan",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Notifikasi",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Persetujuan Notifikasi",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Audit Plan",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pelaksanaan Audit",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Penyelesaian CAPA",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Pengajuan ke " + (field?.nama_akreditasi || "KAN"),
      tanggalStatus: field?.tgl_pengajuan_ke_kan || "",
      catatan: field?.note_tgl_pengajuan_ke_kan || "",
      leadTime: field?.lead_time_tgl_pengajuan_ke_kan || "",
    },
    {
      tahapan: "Persetujuan ke " + (field?.nama_akreditasi || "KAN"),
      tanggalStatus: field?.tgl_persetujuan_kan || "",
      catatan: field?.note_tgl_persetujuan_kan || "",
      leadTime: field?.lead_time_tgl_persetujuan_kan || "",
    },
    {
      tahapan: "Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

export function getlatestProgress(field: AllProject) {
  const normalizedField = normalizeFieldTahapan(field);
  const step = Number(normalizedField?.tahapan ?? 0); // ✅ hindari null

  const latestProgressAuditISPO = getFieldAuditISPO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus as string).getTime() -
        new Date(a.tanggalStatus as string).getTime()
    )[0];

  const latestProgressAuditISO = getFieldAuditISO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus as string).getTime() -
        new Date(a.tanggalStatus as string).getTime()
    )[0];

  const latestProgressISPO = getFieldISPO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus as string).getTime() -
        new Date(a.tanggalStatus as string).getTime()
    )[0];

  const latestProgressISO = getFieldISO(field)
    .filter((item) => item.tanggalStatus)
    .sort(
      (a, b) =>
        new Date(b.tanggalStatus as string).getTime() -
        new Date(a.tanggalStatus as string).getTime()
    )[0];

  if (typeof window !== "undefined" && window.location?.pathname === "/ispo") {
    if (latestProgressAuditISPO && (step === 1 || step === 7)) {
      return latestProgressAuditISPO.tahapan?.replace("", "") ?? "";
    }
    if (latestProgressISPO && step > 1) {
      return latestProgressISPO.tahapan?.replace("", "") ?? "";
    }
  } else {
    if (latestProgressAuditISO && step === 1) {
      return latestProgressAuditISO.tahapan?.replace("", "") ?? "";
    }
    if (latestProgressISO && step > 1) {
      return latestProgressISO.tahapan?.replace("", "") ?? "";
    }
  }

  return "";
}

export function getDataTable(field: AllProject) {
  const normalizedField = normalizeFieldTahapan(field);
  const step = Number(normalizedField?.tahapan ?? 0); // ✅ hindari null

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

export function getNextStep(field: AllProject) {
  const normalizedField = normalizeFieldTahapan(field);
  const step = Number(normalizedField?.tahapan ?? 0); // ✅ hindari null

  const latest = `${getlatestProgress(field)}`;

  if (typeof window !== "undefined" && window.location?.pathname === "/ispo") {
    if (step === 1 || step === 7) {
      const auditISPO = getFieldAuditISPO(field);
      const indexInitialAudit =
        auditISPO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexInitialAudit > auditISPO.length - 1;

      return isDone
        ? "DONE"
        : auditISPO[indexInitialAudit]?.tahapan?.replace("", "");
    }

    if (step > 1) {
      const survISPO = getFieldISPO(field); // ✅ bugfix: jangan pass normalizedField
      const indexSurveillance =
        survISPO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexSurveillance > survISPO.length - 1;

      return isDone
        ? "DONE"
        : survISPO[indexSurveillance]?.tahapan?.replace("", "");
    }
  } else {
    if (step === 1) {
      const auditISO = getFieldAuditISO(field);
      const indexInitialAudit =
        auditISO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexInitialAudit > auditISO.length - 1;

      return isDone
        ? "DONE"
        : auditISO[indexInitialAudit]?.tahapan?.replace("", "");
    }
    if (step > 1) {
      const survISO = getFieldISO(field);
      const indexSurveillance =
        survISO.findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexSurveillance > survISO.length - 1;

      return isDone
        ? "DONE"
        : survISO[indexSurveillance]?.tahapan?.replace("", "");
    }
  }

  return "";
}
