"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useEffect, useMemo, useState } from "react";
import { CRMView } from "@/views/apps/crm";
import { useCRMQuery } from "@/hooks/use-crm";
import { DataCRMType } from "@/types/crm";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isFetching, refetch } = useCRMQuery({
    page,
    limit,
    enabled: status === "authenticated",
  });

  const crmData: DataCRMType[] = useMemo(() => data?.data ?? [], [data?.data]);

  // console.log("crmData", crmData);
  const pagination = useMemo(() => {
    const totalCountFromApi = data?.count;
    const apiLimit = data?.limit ?? limit;
    const apiOffset = data?.offset;

    const totalCount = totalCountFromApi ?? crmData.length;
    const safeLimit = Math.max(1, apiLimit);

    const totalPages = Math.max(1, Math.ceil(totalCount / safeLimit));

    const currentPageFromApi =
      typeof apiOffset === "number"
        ? Math.floor(apiOffset / safeLimit) + 1
        : page;

    const currentPage = currentPageFromApi;

    return {
      current_page: currentPage,
      total_pages: totalPages,
      total_count: totalCount,
      limit: safeLimit,
      has_next: currentPage < totalPages,
      has_previous: currentPage > 1,
    };
  }, [data?.count, data?.limit, data?.offset, page, limit, crmData.length]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/crm"
      titleHeader="CRM Lanjut"
      subTitleHeader="View"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <CRMView
          data={crmData}
          pagination={pagination}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(v: number) => {
            setLimit(v);
            setPage(1);
          }}
          isFetching={isFetching}
          refetch={refetch}
          isLoading={isLoading || isFetching}
        />
      </div>
    </DashboardLayout>
  );
}
