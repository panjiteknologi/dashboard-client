"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useEffect, useMemo, useState } from "react";
import { usePaymentsQuery } from "@/hooks/use-payments";
import { PaymentsView } from "@/views/apps";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isFetching } = usePaymentsQuery({
    page: 1,
    limit: 50,
    enabled: status === "authenticated",
  });

  const totalPages = useMemo(() => {
    const p1 = data?.pagination?.total_pages;
    const p2 = data?.meta?.pagination?.total_pages;
    return Number(p1 ?? p2 ?? 1);
  }, [data]);

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
        <PaymentsView
          data={data}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          pageSize={limit}
          onPageSizeChange={(n) => {
            setLimit(n);
            setPage(1);
          }}
          isFetching={isFetching}
        />
      </div>
    </DashboardLayout>
  );
}
