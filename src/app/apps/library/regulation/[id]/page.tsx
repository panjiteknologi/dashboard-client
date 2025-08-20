"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard-layout";
import { LibraryMenu } from "@/constant/menu-sidebar";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { RegulationType } from "@/types/projects";
import { dataRegulations } from "@/constant/regulation";
import RegulationDetailView from "@/views/apps/library/regulation/regulation-detail";
import { ArrowLeft } from "lucide-react";

export default function page() {
  const router = useRouter();

  const { id } = useParams();
  const [data, setData] = useState<RegulationType | null>(null);

  const goBack = () => {
    router.push("/apps/library/regulation");
  };

  useEffect(() => {
    const reg = dataRegulations?.find((r) => r.id === Number(id));
    setData(reg || null);
  }, [id]);

  if (!data) return <div className="p-6">Regulation not found...</div>;

  return (
    <DashboardLayout
      href={`/apps/library/regulation/${id}`}
      titleHeader="Detail Regulation"
      subTitleHeader={data.title}
      menuSidebar={LibraryMenu as AppSidebarTypes}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={goBack}
          className="cursor-pointer flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>
      </div>
      <RegulationDetailView data={data} />
    </DashboardLayout>
  );
}
