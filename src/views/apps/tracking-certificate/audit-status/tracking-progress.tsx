"use client";

import { CheckCircle, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { AllProject } from "@/types/projects";
import { getDataTable, StepRow } from "@/utils";
interface TrackingProgressProps {
  data: AllProject;
}

const formatStepDate = (value?: string): string => {
  if (!value) return "";

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const TrackingProgressView = ({ data }: TrackingProgressProps) => {
  const steps: StepRow[] = getDataTable(data) ?? [];
  console.log("steps", steps);

  console.log("data", data);
  return (
    <div className="overflow-y-auto">
      <div className="relative">
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-linear-to-b from-blue-200 via-blue-300 to-blue-400" />

        <div className="flex flex-col space-y-4">
          {steps.map((step, index) => {
            const completed = !!step.tanggalStatus;
            const stepDate = formatStepDate(step.tanggalStatus);
            const Icon = step.icon ?? FileCheck;

            return (
              <div className="flex items-start space-x-4 relative" key={index}>
                <div className="relative z-10">
                  <div
                    className={cn(
                      "p-2 rounded-full border-2 transition-all duration-300 hover:scale-110",
                      completed
                        ? `${step.color} border-white shadow-lg`
                        : "bg-gray-100 border-gray-300"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-all duration-300",
                        completed ? "text-white" : "text-gray-400"
                      )}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-300 hover:shadow-md",
                      completed
                        ? "bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium transition-all duration-300",
                          completed ? "text-blue-900" : "text-gray-500"
                        )}
                      >
                        {step.tahapan}
                      </span>
                      {stepDate && (
                        <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                          {stepDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          completed
                            ? `${step.color} text-white`
                            : "bg-gray-200 text-gray-500"
                        )}
                      >
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
