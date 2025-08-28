"use client";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layout/dashboard-layout";
import { useDateCustomerQuery } from "@/hooks/use-date-customer";
import { useDataStandardQuery } from "@/hooks/use-standard";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarTrackingMenu } from "@/utils";
import { AuditStatusView } from "@/views/apps";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
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

  // Filtered customer data based on logged-in user's partner_name
  const filteredDateCustomer = useMemo(() => {
    if (!session?.user?.partner_name) return [];
    return dateCustomer.filter(
      (item: { partner_name: string }) =>
        item.partner_name === session.user.partner_name
    );
  }, [dateCustomer, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/tracking-certificate/audit-status"
      titleHeader="Audit Status"
      subTitleHeader="Table"
      menuSidebar={SidebarTrackingMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">Tracking Project Consultant</h1>
        <AuditStatusView
          data={filteredDateCustomer}
          uniqueStandards={uniqueStandards}
        />
      </div>
    </DashboardLayout>
  );
}
