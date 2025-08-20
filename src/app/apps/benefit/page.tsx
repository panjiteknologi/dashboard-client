"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { BenefitMenu } from "@/constant/menu-sidebar";
import { AppSidebarTypes } from "@/types/sidebar-types";
import BenefitView from "@/views/apps/benefit";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/benefit"
      titleHeader="Benefit"
      subTitleHeader="Table"
      menuSidebar={BenefitMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <BenefitView />
      </div>
    </DashboardLayout>
  );
}
