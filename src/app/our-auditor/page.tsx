"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useEffect } from "react";
import { useDataOurAuditorQuery } from "@/hooks/use-data-our-auditor";
import { OurAuditorView } from "@/views/apps";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const { data, isLoading } = useDataOurAuditorQuery({
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/our-auditor"
      titleHeader="History Audit"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <OurAuditorView data={data} loading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
