"use client";
import * as React from "react";

export const ApplicationSectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <section className={`rounded-lg border bg-white ${className ?? ""}`}>
    <div className="px-4 py-3 border-b bg-slate-50/70">
      <h3 className="text-xs md:text-sm font-semibold tracking-wide text-slate-700 uppercase">
        {title}
      </h3>
    </div>
    <div className="p-3 md:p-4">
      <dl className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-6">
        {children}
      </dl>
    </div>
  </section>
);
