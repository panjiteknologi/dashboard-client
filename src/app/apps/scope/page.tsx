"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { SidebarScopeMenu } from "@/constant/menu-sidebar";
import { AppSidebarTypes } from "@/types/sidebar-types";
import ScopeLibraryView from "@/views/apps/scope";
import { useDateCustomerQuery } from "@/hooks/use-date-customer";
import { useDataStandardQuery } from "@/hooks/use-standard";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: dateCustomer = [], isLoading } = useDateCustomerQuery({
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
      href="/apps/scope"
      titleHeader="Scope Library"
      subTitleHeader="Table"
      menuSidebar={SidebarScopeMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">Scope Sertifikasi ISO</h1>
        <ScopeLibraryView />
      </div>
    </DashboardLayout>
  );
}
