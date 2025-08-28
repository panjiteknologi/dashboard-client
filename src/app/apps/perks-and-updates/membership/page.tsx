"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import MembershipView from "@/views/apps/perks-and-updates/membership";
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
      href="/apps/perks-and-updates/membership"
      titleHeader="Membership"
      subTitleHeader="Customer Care"
      menuSidebar={SidebarMenuPerksAndUpdatesMenu as AppSidebarTypes}
    >
      <MembershipView />
    </DashboardLayout>
  );
}
