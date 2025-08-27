"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import BenefitView from "@/views/apps/benefit";
import { SidebarMenuPerksAndUpdatesMenu } from "@/utils";

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
      href="/apps/perks-and-updates/benefit"
      titleHeader="Benefit"
      subTitleHeader="Table"
      menuSidebar={SidebarMenuPerksAndUpdatesMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <BenefitView />
      </div>
    </DashboardLayout>
  );
}
