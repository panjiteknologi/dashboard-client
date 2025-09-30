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
  isLoading?: boolean;
};

export const ScopeSelectorView = ({
  standard,
  setStandard,
  standards,
  labelMap,
  isLoading = false,
}: ScopeSelectorProps) => {
  const maxVisible = 8;

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 mb-4 items-center w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-28 rounded-full bg-slate-200 animate-pulse"
          />
        ))}
        <div className="h-9 w-[180px] rounded-md bg-slate-200 animate-pulse" />
      </div>
    );
  }

  const visibleStandards = standards.slice(0, maxVisible);
  const hiddenStandards = standards.slice(maxVisible);

  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
      {visibleStandards.map((std) => (
        <Badge
          key={std}
          onClick={() => setStandard(std)}
          variant={standard === std ? "default" : "outline"}
          className={`cursor-pointer px-4 py-2 text-sm rounded-full transition-colors ${
            standard === std ? "bg-sky-700 text-white" : ""
          }`}
        >
          {labelMap[std]}
        </Badge>
      ))}

      {hiddenStandards.length > 0 && (
        <Select
          value={standard}
          onValueChange={setStandard}
          disabled={isLoading}
        >
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
};
