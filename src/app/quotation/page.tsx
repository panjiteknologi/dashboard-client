"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useEffect } from "react";
import { useQuotationsQuery } from "@/hooks/use-quotations";
import { QuotationsView } from "@/views/apps";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const { data } = useQuotationsQuery({
    page: 1,
    limit: 50,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/quotation"
      titleHeader="Quotation"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <QuotationsView data={data} />
      </div>
    </DashboardLayout>
  );
}
