"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { mockApplicationFormData } from "@/constant/application-form";
import { useDataStandardQuery } from "@/hooks/use-standard";
import ApplicationFormView from "@/views/apps/application-form";
import { SidebarApplicationFormMenu } from "@/utils";
import { AppSidebarTypes } from "@/types/sidebar-types";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data: standards = [] } = useDataStandardQuery({
    staleTime: 5 * 60 * 1000,
  });

  const uniqueStandards = useMemo(() => {
    const allStandards = standards.flatMap(
      (item: { standard_name: string }) => item.standard_name || []
    );
    return Array.from(new Set(allStandards));
  }, [standards]);

  const filteredApplicationData = useMemo(() => {
    if (!session?.user?.partner_name) return [];
    return mockApplicationFormData.filter(
      (item) => item.partner_name === session.user.partner_name
    );
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/application-form"
      titleHeader="Application Form"
      subTitleHeader="Table"
      menuSidebar={SidebarApplicationFormMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">List Data Application Form</h1>
        <ApplicationFormView
          data={filteredApplicationData}
          uniqueStandards={uniqueStandards}
        />
      </div>
    </DashboardLayout>
  );
}
