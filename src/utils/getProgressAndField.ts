import { AllProject } from "../types/Project";
import { normalizeFieldTahapan } from "./getNormalizeTahapan";

function getFieldAuditISPO(field: AllProject) {
  return [
    {
      tahapan: "Tanggal Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Review Penugasan ST Satu",
      tanggalStatus: field?.tgl_review_penugasan_st_satu || "",
      catatan: field?.note_tgl_review_penugasan_st_satu || "",
      leadTime: field?.lead_time_aplication_form_to_review_penugasan || "",
    },
    {
      tahapan: "Tanggal Kontrak",
      tanggalStatus: field?.tgl_kontrak || "",
      catatan: field?.note_tgl_kontrak || "",
      leadTime: field?.lead_time_tgl_kontrak || "",
    },
    {
      tahapan: "Tanggal Pengajuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_pengiriman_notif_st_satu || "",
      catatan: field?.note_tgl_pengiriman_notif_st_satu || "",
      leadTime:
        field?.lead_time_review_penugasan_to_pengiriman_notifikasi_st_satu ||
        "",
    },
    {
      tahapan: "Tanggal Persetujuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_persetujuan_notif_st_satu || "",
      catatan: field?.note_tgl_persetujuan_notif_st_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Audit Plan ST Satu",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_satu || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_notifikasi_st_satu_to_pengiriman_audit_plan_st_satu ||
        "",
    },
    {
      tahapan: "Tanggal Pelaksanaan Audit ST Satu",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_satu || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_audit_plan_st_satu_to_pelaksanaan_audit_st_satu ||
        "",
    },
    {
      tahapan: "Tanggal Penyelesaian CAPA ST Satu",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_satu || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_satu || "",
      leadTime:
        field?.lead_time_pelaksanaan_audit_st_satu_to_penyelesaian_capa_st_satu ||
        "",
    },
    {
      tahapan: "Tanggal Proses Review ST Satu",
      tanggalStatus: field?.tgl_proses_review_tahap_satu || "",
      catatan: field?.note_tgl_proses_review_tahap_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengambilan Keputusan ST Satu",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_satu || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Review Penugasan ST Dua",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengajuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Persetujuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Audit Plan ST Dua",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pelaksanaan Audit ST Dua",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Penyelesaian CAPA ST Dua",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Proses Review ST Dua",
      tanggalStatus: field?.tgl_proses_review_tahap_dua || "",
      catatan: field?.note_tgl_proses_review_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengambilan Keputusan ST Dua",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_dua || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Tanggal Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

function getFieldAuditISO(field: AllProject) {
  return [
    {
      tahapan: "Tanggal Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Review Penugasan ST Satu",
      tanggalStatus: field?.tgl_review_penugasan_st_satu || "",
      catatan: field?.note_tgl_review_penugasan_st_satu || "",
      leadTime: field?.lead_time_aplication_form_to_review_penugasan || "",
    },
    {
      tahapan: "Tanggal Kontrak",
      tanggalStatus: field?.tgl_kontrak || "",
      catatan: field?.note_tgl_kontrak || "",
      leadTime: field?.lead_time_tgl_kontrak || "",
    },
    {
      tahapan: "Tanggal Pengiriman Notifikasi ST Satu",
      tanggalStatus: field?.tgl_pengiriman_notif_st_satu || "",
      catatan: field?.note_tgl_pengiriman_notif_st_satu || "",
      leadTime:
        field?.lead_time_review_penugasan_to_pengiriman_notifikasi_st_satu ||
        "",
    },
    {
      tahapan: "Tanggal Persetujuan Notifikasi ST Satu",
      tanggalStatus: field?.tgl_persetujuan_notif_st_satu || "",
      catatan: field?.note_tgl_persetujuan_notif_st_satu || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Audit Plan ST Satu",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_satu || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_satu || "",
      leadTime: field?.lead_time_tgl_pengiriman_audit_plan_st_satu || "",
    },
    {
      tahapan: "Tanggal Pelaksanaan Audit ST Satu",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_satu || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_satu || "",
      leadTime:
        field?.lead_time_pengiriman_audit_plan_st_satu_to_pelaksanaan_audit_st_satu ||
        "",
    },
    {
      tahapan: "Tanggal Penyelesaian CAPA ST Satu",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_satu || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_satu || "",
      leadTime:
        field?.lead_time_pelaksanaan_audit_st_satu_to_penyelesaian_capa_st_satu ||
        "",
    },
    {
      tahapan: "Tanggal Review Penugasan ST Dua",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Notifikasi ST Dua",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Persetujuan Notifikasi ST Dua",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Audit Plan ST Dua",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pelaksanaan Audit ST Dua",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Penyelesaian CAPA ST Dua",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Tanggal Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengajuan ke " + field?.nama_akreditasi,
      tanggalStatus: field?.tgl_pengajuan_ke_kan || "",
      catatan: field?.note_tgl_pengajuan_ke_kan || "",
      leadTime: field?.lead_time_tgl_pengajuan_ke_kan || "",
    },
    {
      tahapan: "Tanggal Persetujuan ke " + field?.nama_akreditasi,
      tanggalStatus: field?.tgl_persetujuan_kan || "",
      catatan: field?.note_tgl_persetujuan_kan || "",
      leadTime: field?.lead_time_tgl_persetujuan_kan || "",
    },
    {
      tahapan: "Tanggal Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

function getFieldISPO(field: AllProject) {
  return [
    {
      tahapan: "Tanggal Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Review Penugasan",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Notifikasi",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Persetujuan Notifikasi",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Audit Plan",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pelaksanaan Audit",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Penyelesaian CAPA",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Proses Review",
      tanggalStatus: field?.tgl_proses_review_tahap_dua || "",
      catatan: field?.note_tgl_proses_review_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengambilan Keputusan",
      tanggalStatus: field?.tgl_pengambilan_keputusan_tahap_dua || "",
      catatan: field?.note_tgl_pengambilan_keputusan_tahap_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Tanggal Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

function getFieldISO(field: AllProject) {
  return [
    {
      tahapan: "Tanggal Aplication Form or Request",
      tanggalStatus: field?.aplication_form || "",
      catatan: field?.note_aplication_form || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Review Penugasan",
      tanggalStatus: field?.tgl_review_penugasan_st_dua || "",
      catatan: field?.note_tgl_review_penugasan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Notifikasi",
      tanggalStatus: field?.tgl_pengiriman_notif_st_dua || "",
      catatan: field?.note_tgl_pengiriman_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Persetujuan Notifikasi",
      tanggalStatus: field?.tgl_persetujuan_notif_st_dua || "",
      catatan: field?.note_tgl_persetujuan_notif_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Audit Plan",
      tanggalStatus: field?.tgl_pengiriman_audit_plan_st_dua || "",
      catatan: field?.note_tgl_pengiriman_audit_plan_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pelaksanaan Audit",
      tanggalStatus: field?.tgl_pelaksanaan_audit_st_dua || "",
      catatan: field?.note_tgl_pelaksanaan_audit_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Penyelesaian CAPA",
      tanggalStatus: field?.tgl_penyelesaian_capa_st_dua || "",
      catatan: field?.note_tgl_penyelesaian_capa_st_dua || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengiriman Draft Sertifikat",
      tanggalStatus: field?.tgl_pengiriman_draft_sertifikat || "",
      catatan: field?.note_tgl_pengiriman_draft_sertifikat || "",
      leadTime:
        field?.lead_time_tanggal_pengajuan_to_pengiriman_draft_sertifikat || "",
    },
    {
      tahapan: "Tanggal Persetujuan Draft Sertifikat",
      tanggalStatus: field?.tgl_persetujuan_draft_sertifikat || "",
      catatan: field?.note_tgl_persetujuan_draft_sertifikat || "",
      leadTime: "",
    },
    {
      tahapan: "Tanggal Pengajuan ke " + field?.nama_akreditasi,
      tanggalStatus: field?.tgl_pengajuan_ke_kan || "",
      catatan: field?.note_tgl_pengajuan_ke_kan || "",
      leadTime: field?.lead_time_tgl_pengajuan_ke_kan || "",
    },
    {
      tahapan: "Tanggal Persetujuan ke " + field?.nama_akreditasi,
      tanggalStatus: field?.tgl_persetujuan_kan || "",
      catatan: field?.note_tgl_persetujuan_kan || "",
      leadTime: field?.lead_time_tgl_persetujuan_kan || "",
    },
    {
      tahapan: "Tanggal Kirim Sertifikat",
      tanggalStatus: field?.tgl_kirim_sertifikat || "",
      catatan: field?.note_tgl_kirim_sertifikat || "",
      leadTime: "",
    },
  ];
}

export function getlatestProgress(field: AllProject) {
  const normalizedField = normalizeFieldTahapan(field);

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

  if (location?.pathname === "/ispo") {
    if (
      latestProgressAuditISPO &&
      (normalizedField.tahapan === 1 || normalizedField.tahapan === 7)
    ) {
      return latestProgressAuditISPO.tahapan?.replace("Tanggal ", "") ?? "";
    }
    if (latestProgressISPO && normalizedField.tahapan > 1) {
      return latestProgressISPO.tahapan?.replace("Tanggal ", "") ?? "";
    }
  } else {
    if (latestProgressAuditISO && normalizedField.tahapan === 1) {
      return latestProgressAuditISO.tahapan?.replace("Tanggal ", "") ?? "";
    }
    if (latestProgressISO && normalizedField.tahapan > 1) {
      return latestProgressISO.tahapan?.replace("Tanggal ", "") ?? "";
    }
  }

  return "";
}

export function getDataTable(field: AllProject) {
  const normalizedField = normalizeFieldTahapan(field);

  if (location?.pathname === "/ispo") {
    if (normalizedField?.tahapan === 1 || normalizedField?.tahapan === 7) {
      return getFieldAuditISPO(field);
    }
    if (normalizedField?.tahapan > 1 && normalizedField?.tahapan <= 6) {
      return getFieldISPO(field);
    }
  } else {
    if (normalizedField?.tahapan === 1) {
      return getFieldAuditISO(field);
    }
    if (normalizedField?.tahapan > 1) {
      return getFieldISO(field);
    }
  }

  return null;
}

export function getNextStep(field: AllProject) {
  const normalizedField = normalizeFieldTahapan(field);

  const latest = `Tanggal ${getlatestProgress(field)}`;

  if (location?.pathname === "/ispo") {
    if (normalizedField?.tahapan === 1 || normalizedField?.tahapan === 7) {
      const indexInitialAudit =
        getFieldAuditISPO(field).findIndex((item) => item.tahapan === latest) +
        1;
      const isDone = indexInitialAudit > getFieldAuditISPO(field).length - 1;

      return isDone
        ? "DONE"
        : getFieldAuditISPO(field)[indexInitialAudit]?.tahapan?.replace(
            "Tanggal ",
            ""
          );
    }

    if (normalizedField?.tahapan > 1) {
      const indexSurveillance =
        getFieldISPO(field).findIndex((item) => item.tahapan === latest) + 1;
      const isDone =
        indexSurveillance > getFieldISPO(normalizedField).length - 1;

      return isDone
        ? "DONE"
        : getFieldISPO(field)[indexSurveillance]?.tahapan?.replace(
            "Tanggal ",
            ""
          );
    }
  } else {
    if (normalizedField?.tahapan === 1) {
      const indexInitialAudit =
        getFieldAuditISO(field).findIndex((item) => item.tahapan === latest) +
        1;
      const isDone = indexInitialAudit > getFieldAuditISO(field).length - 1;

      return isDone
        ? "DONE"
        : getFieldAuditISO(field)[indexInitialAudit]?.tahapan?.replace(
            "Tanggal ",
            ""
          );
    }
    if (normalizedField?.tahapan > 1) {
      const indexSurveillance =
        getFieldISO(field).findIndex((item) => item.tahapan === latest) + 1;
      const isDone = indexSurveillance > getFieldISO(field).length - 1;

      return isDone
        ? "DONE"
        : getFieldISO(field)[indexSurveillance]?.tahapan?.replace(
            "Tanggal ",
            ""
          );
    }
  }

  return "";
}
