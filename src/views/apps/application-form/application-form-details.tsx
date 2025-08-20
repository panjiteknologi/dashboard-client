// src/views/apps/application-form/application-form-details.tsx
import React from "react";

export default function ApplicationFormDetails({ data }: { data: any }) {
  const renderRow = (label: string, value: any) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-xs font-medium">{label}</span>
      <span className="text-gray-800">{value ?? "-"}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-sm space-y-8">
      <div>
        <h3 className="text-md font-semibold mb-4 text-blue-800">
          Scope and Boundaries
        </h3>
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          {renderRow("Scope", data.scope)}
          {renderRow("Boundaries", data.boundaries)}
          {renderRow("ISO Standard", data.iso_standard)}
          {renderRow("Certificate Type", data.certificate_type)}
          {renderRow("Audit Stage", data.audit_stage)}
          {renderRow("Number of Site", data.number_of_site)}
          {renderRow("Remarks", data.remarks)}
        </div>
      </div>

      {[1, 2, 3].map((num) => (
        <div key={num}>
          <h3 className="text-md font-semibold mb-4 text-blue-800">
            Personal Situation {num}
          </h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            {renderRow("Type", data[`type_${num}`])}
            {renderRow("Address", data[`address_${num}`])}
            {renderRow("Product / Process / Activity", data[`activity_${num}`])}
            {renderRow("Number of Employees", data[`employees_${num}`])}
          </div>
        </div>
      ))}
    </div>
  );
}
