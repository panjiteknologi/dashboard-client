"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { RegulationType } from "@/types/projects";
import { dataRegulations } from "@/constant/regulation";
import { ArrowLeft } from "lucide-react";
import { SidebarLibraryMenu } from "@/utils";
import { RegulationDetailView } from "@/views/apps";

export default function RegulationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<RegulationType | null>(null);

  const goBack = () => router.push("/apps/library/regulation");

  useEffect(() => {
    if (!id) return;
    const numericId = Number(id);
    const reg = dataRegulations.find((r) => r.id === numericId) || null;
    setData(reg);
  }, [id]);

  if (!id) {
    return <div className="p-6">Parameter ID tidak valid.</div>;
  }

  if (!data) {
    return <div className="p-6">Regulasi tidak ditemukan…</div>;
  }

  return (
    <DashboardLayout
      href={`/apps/library/regulation/${id}`}
      titleHeader="Detail Regulasi"
      subTitleHeader={data.title}
      menuSidebar={SidebarLibraryMenu as AppSidebarTypes}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={goBack}
          className="cursor-pointer flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke daftar
        </button>
      </div>

      <RegulationDetailView data={data} />
    </DashboardLayout>
  );
}
