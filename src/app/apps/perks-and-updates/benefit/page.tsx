"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarMenuPerksAndUpdatesMenu } from "@/utils";
import { BenefitISOView } from "@/views/apps";

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
        <BenefitISOView />
      </div>
    </DashboardLayout>
  );
}
