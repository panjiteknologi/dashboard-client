"use client";

import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AllProject } from "@/types/projects";

const auditSteps = [
  "Aplication Form or Request",
  "Review Penugasan ST Satu",
  "Kontrak",
  "Pengiriman Notifikasi ST Satu",
  "Pengiriman Audit Plan ST Satu",
  "Pelaksanaan Audit ST Satu",
  "Penyelesaian CAPA ST Satu",
  "Pengiriman Draft Sertifikat",
  "Pengajuan ke KAN",
  "Persetujuan ke KAN",
  "Kirim Sertifikat",
];

const leadTimeStepMap: Record<string, keyof AllProject> = {
  "Aplication Form or Request": "tgl_aplication_form",
  "Review Penugasan ST Satu": "tgl_review_penugasan_st_satu",
  "Kontrak": "tgl_kontrak",
  "Pengiriman Notifikasi ST Satu": "tgl_pengiriman_notif_st_satu",
  "Pengiriman Audit Plan ST Satu": "tgl_pengiriman_audit_plan_st_satu",
  "Pelaksanaan Audit ST Satu": "tgl_pelaksanaan_audit_st_satu",
  "Penyelesaian CAPA ST Satu": "tgl_penyelesaian_capa_st_satu",
  "Pengiriman Draft Sertifikat": "tgl_pengiriman_draft_sertifikat",
  "Pengajuan ke KAN": "tgl_pengajuan",
  "Persetujuan ke KAN": "tgl_persetujuan",
  "Kirim Sertifikat": "tgl_kirim_sertifikat",
};

interface TrackingProgressProps {
  data: AllProject;
}

export const TrackingProgressView = ({ data }: TrackingProgressProps) => {
  const isStepCompleted = (step: string): boolean => {
    const key = leadTimeStepMap[step];
    if (!key) return false;
    const value = data[key];
    return !!value && value !== "";
  };

  return (
    <div className="overflow-y-auto">
      <div className="relative">
        <div className="absolute top-0 left-2 w-0.5 h-full bg-gray-300" />

        <div className="flex flex-col space-y-6">
          {auditSteps.map((step, index) => {
            const completed = isStepCompleted(step);

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
};
