"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { RegulationType } from "@/types/projects";
import { ArrowLeft } from "lucide-react";
import { SidebarAppsMenu } from "@/utils";
import { RegulationDetailView as RegulationDetail } from "@/views/apps/library/regulation/regulation-detail";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function RegulationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const numericId = id ? Number(id) : null;
  const regulation = useQuery(
    api.regulations.getById,
    numericId !== null ? { id: numericId } : "skip"
  );

  // Get image URL if storageId exists
  const imageUrl = useQuery(
    api.regulations.getImageUrl,
    regulation?.imageStorageId
      ? { storageId: regulation.imageStorageId }
      : "skip"
  );

  const data: RegulationType | null = useMemo(() => {
    if (!regulation) return null;

    return {
      id: regulation.id,
      title: regulation.title,
      subtitle: regulation.subtitle,
      image: regulation.image || imageUrl || "",
      number: regulation.number,
      type: regulation.type,
      issuer: regulation.issuer,
      sector: regulation.sector,
      jurisdiction: regulation.jurisdiction,
      status: regulation.status,
      publishedAt: regulation.publishedAt,
      effectiveAt: regulation.effectiveAt,
      summary: regulation.summary,
      keywords: regulation.keywords,
      sourceUrl: regulation.sourceUrl,
      attachments: regulation.attachments,
      sections: regulation.sections,
      relatedRegulations: regulation.relatedRegulations,
    };
  }, [regulation, imageUrl]);

  const goBack = () => router.push("/library/regulation");

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
