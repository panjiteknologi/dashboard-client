"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard-layout";
import { LibraryMenu } from "@/utils/sidebar-menu/sidebar-tracking-certificate";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { RegulationType } from "@/types/projects";
import { ArrowLeft } from "lucide-react";
import { dataWebinars } from "@/constant/webinars";
import WebinarsDetailView from "@/views/apps/library/webinars/webinars-detail";

export default function page() {
  const router = useRouter();

  const { id } = useParams();
  const [data, setData] = useState<RegulationType | null>(null);

  const goBack = () => {
    router.push("/apps/library/webinars");
  };

  useEffect(() => {
    const reg = dataWebinars?.find((r) => r.id === Number(id));
    setData(reg || null);
  }, [id]);

  if (!data) return <div className="p-6">Webinars not found...</div>;

  return (
    <DashboardLayout
      href={`/apps/library/webinars/${id}`}
      titleHeader="Detail Webinars"
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
      <WebinarsDetailView data={data} />
    </DashboardLayout>
  );
}
