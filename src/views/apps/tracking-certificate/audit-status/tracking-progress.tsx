"use client";

import { CheckCircle, Clock, Calendar, FileCheck, Award, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AllProject } from "@/types/projects";

const auditSteps = [
  {
    name: "Aplication Form or Request",
    icon: FileCheck,
    category: "Application",
    color: "bg-blue-500"
  },
  {
    name: "Review Penugasan ST Satu",
    icon: Award,
    category: "Assignment",
    color: "bg-indigo-500"
  },
  {
    name: "Kontrak",
    icon: FileCheck,
    category: "Contract",
    color: "bg-purple-500"
  },
  {
    name: "Pengiriman Notifikasi ST Satu",
    icon: Calendar,
    category: "Notification",
    color: "bg-pink-500"
  },
  {
    name: "Pengiriman Audit Plan ST Satu",
    icon: Calendar,
    category: "Planning",
    color: "bg-rose-500"
  },
  {
    name: "Pelaksanaan Audit ST Satu",
    icon: CheckCircle,
    category: "Audit",
    color: "bg-orange-500"
  },
  {
    name: "Penyelesaian CAPA ST Satu",
    icon: AlertCircle,
    category: "Resolution",
    color: "bg-amber-500"
  },
  {
    name: "Pengiriman Draft Sertifikat",
    icon: FileCheck,
    category: "Draft",
    color: "bg-yellow-500"
  },
  {
    name: "Pengajuan ke KAN",
    icon: Award,
    category: "Submission",
    color: "bg-lime-500"
  },
  {
    name: "Persetujuan ke KAN",
    icon: CheckCircle,
    category: "Approval",
    color: "bg-green-500"
  },
  {
    name: "Kirim Sertifikat",
    icon: Award,
    category: "Issuance",
    color: "bg-emerald-500"
  },
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

const getStepDate = (data: AllProject, step: string): string => {
  const key = leadTimeStepMap[step];
  const dateValue = data[key];
  if (!dateValue || dateValue === "") return "";

  try {
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return "";
  }
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
        {/* Modern gradient line */}
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400" />

        <div className="flex flex-col space-y-4">
          {auditSteps.map((step, index) => {
            const completed = isStepCompleted(step.name);
            const stepDate = getStepDate(data, step.name);
            const Icon = step.icon;

            return (
              <div className="flex items-start space-x-4 relative" key={index}>
                <div className="relative z-10">
                  <div className={cn(
                    "p-2 rounded-full border-2 transition-all duration-300 hover:scale-110",
                    completed
                      ? `${step.color} border-white shadow-lg`
                      : "bg-gray-100 border-gray-300"
                  )}>
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-all duration-300",
                        completed ? "text-white" : "text-gray-400"
                      )}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "p-3 rounded-lg border transition-all duration-300 hover:shadow-md",
                    completed
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-sm font-medium transition-all duration-300",
                        completed ? "text-blue-900" : "text-gray-500"
                      )}>
                        {step.name}
                      </span>
                      {stepDate && (
                        <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                          {stepDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        completed
                          ? `${step.color} text-white`
                          : "bg-gray-200 text-gray-500"
                      )}>
                        {step.category}
                      </span>
                      {completed && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
