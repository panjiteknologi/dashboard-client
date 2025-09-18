"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useISOListQuery } from "@/hooks/use-data-iso";
import ApplicationFormView from "@/views/apps/application-form/application-form-view";
import {
  AllApplicationFormType,
  RowApplicationFormType,
} from "@/types/projects";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  const { data: isoList } = useISOListQuery({ page: 1, limit: 50 });
  const dataISO = isoList?.data;

  const normalizedRows: RowApplicationFormType[] = useMemo(
    () =>
      (dataISO ?? []).map((item: AllApplicationFormType) => ({
        id: item?.id ?? "-",
        document_no: item?.name ?? "-",
        customer_name: item?.customer?.name ?? "-",
        issued_date: item?.issued_date ?? "",
        standards: (item?.iso_standard_ids ?? [])
          .map((s) => s.name)
          .filter(Boolean),
        created_by: item?.user_id?.name ?? "-",
        status_app_form: item?.state ?? "-",
        status_sales: item?.state_sales ?? "-",
        audit_status: item?.audit_status ?? "-",
      })),
    [dataISO]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/application-form"
      titleHeader="Application Form"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <ApplicationFormView data={normalizedRows} />
      </div>
    </DashboardLayout>
  );
}
