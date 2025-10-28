"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScopeListQuery } from "@/hooks/use-scope-list";

export const AuditDocumentCheckView = () => {
  const [selectedScope, setSelectedScope] = useState<string | null>(null);
  const { data: scopeListData, isLoading: isScopeListLoading, isError: isScopeListError } =
    useScopeListQuery();

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFiles((prev) => ({ ...prev, [key]: event.target.files![0] }));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, key: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setUploadedFiles((prev) => ({ ...prev, [key]: event.dataTransfer.files![0] }));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const sectionsByScope: Record<string, { title: string; docs: string[] }[]> = {
    "9001:2015": [
      { title: "Context of the Organization", docs: ["Scope", "Business Process"] },
      {
        title: "Leadership",
        docs: ["Quality Policy", "Role, Responsibility and Authority"],
      },
      { title: "Planning", docs: ["Risk & Opportunity", "Quality Objective"] },
      {
        title: "Performance Evaluation",
        docs: ["Internal Audit", "Management Review"],
      },
      {
        title: "Support",
        docs: [
          "Organizational knowledge",
          "Competence",
          "Controlled of Documented Information",
        ],
      },
      {
        title: "Operation",
        docs: ["Process Planning", "Control of Nonconformance output"],
      },
    ],
    "14001:2015": [
      { title: "Context of the Organization", docs: ["Scope", "Business Process"] },
      {
        title: "Leadership",
        docs: ["Quality Policy", "Role, Responsibility and Authority"],
      },
      { title: "Planning", docs: ["Risk & Opportunity", "Quality Objective"] },
      {
        title: "Performance Evaluation",
        docs: ["Internal Audit", "Management Review"],
      },
      {
        title: "Support",
        docs: [
          "Organizational knowledge",
          "Competence",
          "Controlled of Documented Information",
        ],
      },
      {
        title: "Operation",
        docs: ["Process Planning", "Control of Nonconformance output"],
      },
    ],
    "45001:2015": [
      { title: "Context of the Organization", docs: ["Scope", "Business Process"] },
      {
        title: "Leadership",
        docs: ["Quality Policy", "Role, Responsibility and Authority"],
      },
      { title: "Planning", docs: ["Risk & Opportunity", "Quality Objective"] },
      {
        title: "Performance Evaluation",
        docs: ["Internal Audit", "Management Review"],
      },
      {
        title: "Support",
        docs: [
          "Organizational knowledge",
          "Competence",
          "Controlled of Documented Information",
        ],
      },
      {
        title: "Operation",
        docs: ["Process Planning", "Control of Nonconformance output"],
      },
    ],
  };

  const currentSections = selectedScope ? sectionsByScope[selectedScope] : null;

  const UploadBox = ({ title, keyName }: { title: string; keyName: string }) => (
    <div
      className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, keyName)}
      onClick={() => document.getElementById(keyName)?.click()}
    >
      {uploadedFiles[keyName] ? (
        <p>{uploadedFiles[keyName]?.name}</p>
      ) : (
        <p>Drag & drop {title} here, or click to select file</p>
      )}
      <Input
        id={keyName}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileChange(e, keyName)}
        className="hidden"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-md font-bold">Audit Document Check</h1>
      <p>Select a scope to view and upload required documents.</p>

      <div className="w-full">
        <Select
          onValueChange={setSelectedScope}
          disabled={isScopeListLoading || isScopeListError}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a scope" />
          </SelectTrigger>
          <SelectContent>
            {isScopeListLoading ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : isScopeListError ? (
              <SelectItem value="error" disabled>
                Error loading scopes
              </SelectItem>
            ) : (
              scopeListData?.data.map((scope) => {
                const scopeKey = Object.keys(sectionsByScope).find((key) =>
                  scope.title.includes(key.split(":")[0])
                );
                return (
                  <SelectItem key={scope.id} value={scopeKey || scope.title}>
                    {scope.title}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </div>

      {currentSections && (
        <div className="space-y-6 mt-6">
          {currentSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.docs.map((doc, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle>{doc}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UploadBox
                        title={doc}
                        keyName={`${section.title}_${doc}`.replace(/\s+/g, "_")}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!currentSections && (
        <p className="text-gray-500 italic">Please select a scope to display sections.</p>
      )}
    </div>
  );
};
