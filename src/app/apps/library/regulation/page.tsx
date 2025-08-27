"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import RegulationView from "@/views/apps/library/regulation";
import { dataRegulations } from "@/constant/regulation";
import { SidebarLibraryMenu } from "@/utils";

export default function RegulationPage() {
  const router = useRouter();
  const { status } = useSession();
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/library/regulation"
      titleHeader="Regulation"
      subTitleHeader="Table"
      menuSidebar={SidebarLibraryMenu as AppSidebarTypes}
    >
      <RegulationView data={dataRegulations} view={view} setView={setView} />
    </DashboardLayout>
  );
}
