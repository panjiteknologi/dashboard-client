"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layout/dashboard-layout";
import { SidebarAppsMenu } from "@/utils";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { ScopeDeterminationView } from "@/views/apps/scope-determination";
import { ScopeSearchProvider } from "@/context/scope-determination-context";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  return (
    <DashboardLayout
      href="/scope-determination"
      titleHeader="Scope Determination"
      subTitleHeader="Cari sektor sertifikasi"
      menuSidebar={SidebarAppsMenu as unknown as AppSidebarTypes}
    >
      <ScopeSearchProvider>
        <div className="space-y-4">
          <ScopeDeterminationView />
        </div>
      </ScopeSearchProvider>
    </DashboardLayout>
  );
}
