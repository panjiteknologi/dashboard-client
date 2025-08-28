"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type ScopeSelectorProps = {
  standard: string;
  setStandard: (value: string) => void;
  standards: string[];
  labelMap: Record<string, string>;
};

export default function ScopeSelectorView({
  standard,
  setStandard,
  standards,
  labelMap,
}: ScopeSelectorProps) {
  const maxVisible = 6;
  const visibleStandards = standards.slice(0, maxVisible);
  const hiddenStandards = standards.slice(maxVisible);

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      {/* Badge untuk 6 item pertama */}
      {visibleStandards.map((std) => (
        <Badge
          key={std}
          onClick={() => setStandard(std)}
          variant={standard === std ? "default" : "outline"}
          className={`cursor-pointer px-4 py-2 text-sm rounded-full transition-colors ${
            standard === std ? "bg-blue-600 text-white" : ""
          }`}
        >
          {labelMap[std]}
        </Badge>
      ))}

      {/* Dropdown untuk item sisanya */}
      {hiddenStandards.length > 0 && (
        <Select value={standard} onValueChange={setStandard}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {labelMap[standard] ?? "Pilih Standar Lainnya"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {hiddenStandards.map((std) => (
              <SelectItem key={std} value={std}>
                {labelMap[std]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
