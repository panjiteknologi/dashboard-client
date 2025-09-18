"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useEffect } from "react";
import { usePaymentsQuery } from "@/hooks/use-payments";
import { PaymentsView } from "@/views/apps";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const { data } = usePaymentsQuery({
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
      href="/payment"
      titleHeader="Payments"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <PaymentsView data={data} />
      </div>
    </DashboardLayout>
  );
}
