"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { RegulationType } from "@/types/projects";
import { dummyRegulationData as dataRegulations } from "@/constant/regulation-dummy";
import { ArrowLeft } from "lucide-react";
import { SidebarAppsMenu } from "@/utils";
import { RegulationDetailView as RegulationDetail } from "@/views/apps/library/regulation/regulation-detail";

export default function RegulationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<RegulationType | null>(null);

  const goBack = () => router.push("/library/regulation");

  useEffect(() => {
    if (!id) return;
    const numericId = Number(id);
    let foundRegulation: RegulationType | null = null;

    for (const category of dataRegulations) {
      for (const subCategory of category.subCategories) {
        const reg = subCategory.regulations.find((r) => r.id === numericId);
        if (reg) {
          foundRegulation = reg;
          break;
        }
      }
      if (foundRegulation) {
        break;
      }
    }

    setData(foundRegulation);
  }, [id]);

  if (!id) {
    return <div className="p-6">Parameter ID tidak valid.</div>;
  }

  if (!data) {
    return <div className="p-6">Regulasi tidak ditemukan…</div>;
  }

  return (
    <DashboardLayout
      href={`/library/regulation/${id}`}
      titleHeader="Detail Regulasi"
      subTitleHeader={data.title}
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
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

      <RegulationDetail regulation={data} />
    </DashboardLayout>
  );
}
