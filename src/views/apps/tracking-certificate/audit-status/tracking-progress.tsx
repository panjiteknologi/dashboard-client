"use client";

import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AllProject } from "@/types/projects";

const auditSteps = [
  "Tanggal Aplication Form or Request",
  "Tanggal Review Penugasan ST Satu",
  "Tanggal Kontrak",
  "Tanggal Pengiriman Notifikasi ST Satu",
  "Tanggal Pengiriman Audit Plan ST Satu",
  "Tanggal Pelaksanaan Audit ST Satu",
  "Tanggal Penyelesaian CAPA ST Satu",
  "Tanggal Pengiriman Draft Sertifikat",
  "Tanggal Pengajuan ke KAN",
  "Tanggal Persetujuan ke KAN",
  "Tanggal Kirim Sertifikat",
];

const leadTimeStepMap: Record<string, keyof AllProject> = {
  "Tanggal Aplication Form or Request": "tgl_aplication_form",
  "Tanggal Review Penugasan ST Satu": "tgl_review_penugasan_st_satu",
  "Tanggal Kontrak": "tgl_kontrak",
  "Tanggal Pengiriman Notifikasi ST Satu": "tgl_pengiriman_notif_st_satu",
  "Tanggal Pengiriman Audit Plan ST Satu": "tgl_pengiriman_audit_plan_st_satu",
  "Tanggal Pelaksanaan Audit ST Satu": "tgl_pelaksanaan_audit_st_satu",
  "Tanggal Penyelesaian CAPA ST Satu": "tgl_penyelesaian_capa_st_satu",
  "Tanggal Pengiriman Draft Sertifikat": "tgl_pengiriman_draft_sertifikat",
  "Tanggal Pengajuan ke KAN": "tgl_pengajuan",
  "Tanggal Persetujuan ke KAN": "tgl_persetujuan",
  "Tanggal Kirim Sertifikat": "tgl_kirim_sertifikat",
};

interface TrackingProgressProps {
  data: AllProject;
}

export default function TrackingProgress({ data }: TrackingProgressProps) {
  const isStepCompleted = (step: string): boolean => {
    const key = leadTimeStepMap[step];
    if (!key) return false;
    const value = data[key];
    return !!value && value !== "";
  };

  return (
    <div className="overflow-y-auto px-4">
      <div className="relative ml-4">
        <div className="absolute top-0 left-2 w-0.5 h-full bg-gray-300" />

        <div className="flex flex-col space-y-6">
          {auditSteps.map((step, index) => {
            console.log("steppp", step);
            const completed = isStepCompleted(step);
            console.log("completed", completed);
            return (
              <div className="flex items-start space-x-3 relative" key={index}>
                <div className="relative z-10">
                  <CheckCircle
                    className={cn(
                      "w-5 h-5",
                      completed ? "text-sky-500" : "text-gray-300"
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "text-sm",
                    completed ? "text-black font-medium" : "text-gray-400"
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
