"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { SidebarAppsMenu } from "@/utils";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { AuditDocumentCheckView } from "@/views/apps/audit-process/audit-document-check-view";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/audit-process/audit-document-check"
      titleHeader="Audit Document Check"
      subTitleHeader="Document Upload"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <AuditDocumentCheckView />
    </DashboardLayout>
  );
}
