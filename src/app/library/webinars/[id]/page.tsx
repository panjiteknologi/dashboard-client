"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { WebinarsType } from "@/types/projects";
import { ArrowLeft } from "lucide-react";
import { dataWebinars } from "@/constant/webinars";
import { SidebarLibraryMenu } from "@/utils";
import { WebinarsDetailView } from "@/views/apps";

export default function WebinarsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<WebinarsType | null>(null);

  const goBack = () => router.push("/apps/library/webinars");

  useEffect(() => {
    if (!id) return;
    const numericId = Number(id);
    const webinar = dataWebinars.find((w) => w.id === numericId) || null;
    setData(webinar);
  }, [id]);

  if (!id) {
    return <div className="p-6">Parameter ID tidak valid.</div>;
  }

  if (!data) {
    return <div className="p-6">Webinar tidak ditemukan…</div>;
  }

  return (
    <DashboardLayout
      href={`/apps/library/webinars/${id}`}
      titleHeader="Detail Webinar"
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

      <WebinarsDetailView data={data} />
    </DashboardLayout>
  );
}
