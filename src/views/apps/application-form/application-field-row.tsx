"use client";
import * as React from "react";

export const ApplicationFieldRow: React.FC<{
  label: string;
  value?: React.ReactNode;
  hidden?: boolean;
}> = ({ label, value, hidden }) =>
  hidden ? null : (
    <div className="py-2 md:py-2.5 border-b last:border-b-0 md:border-b-0">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-start">
        <dt className="sm:col-span-4 text-xs md:text-sm text-muted-foreground">
          {label}
        </dt>
        <dd className="sm:col-span-8 sm:border-l sm:pl-4 text-sm whitespace-pre-wrap break-words">
          {value ?? "-"}
        </dd>
      </div>
    </div>
  );
