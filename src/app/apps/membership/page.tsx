"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { MembershipMenu } from "@/constant/menu-sidebar";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { useDataStandardQuery } from "@/hooks/use-standard";
import { useDateCustomerQuery } from "@/hooks/use-date-customer";
import MembershipView from "@/views/apps/membership";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  const { data: dateCustomer = [] } = useDateCustomerQuery({
    staleTime: 5 * 60 * 1000,
  });

  const { data: standards = [] } = useDataStandardQuery({
    staleTime: 5 * 60 * 1000,
  });

  const uniqueStandards = useMemo(() => {
    const allStandards = standards.flatMap(
      (item: { standard_name: string }) => item.standard_name || []
    );
    return Array.from(new Set(allStandards));
  }, [standards]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/membership"
      titleHeader="Membership"
      subTitleHeader="Customer Care"
      menuSidebar={MembershipMenu as AppSidebarTypes}
    >
      <MembershipView
        totalMembers={dateCustomer.length}
        totalStandards={uniqueStandards.length}
      />
    </DashboardLayout>
  );
}
