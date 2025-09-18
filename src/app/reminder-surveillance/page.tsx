"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useEffect, useMemo, useState } from "react";
import { ReminderSurveillanceView } from "@/views/apps";
import { Certificate } from "@/types/surveillance";
import { useSurveillanceQuery } from "@/hooks/use-data-surveilance";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isFetching, refetch } = useSurveillanceQuery({
    page: 1,
    limit: 50,
    enabled: status === "authenticated",
  });

  const certificates: Certificate[] = useMemo(
    () => data?.data?.certificates ?? [],
    [data?.data?.certificates]
  );

  const pagination = useMemo(
    () =>
      data?.data?.pagination ?? {
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        limit,
      },
    [data?.data?.pagination, limit]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/reminder-surveillance"
      titleHeader="Reminder Surveillance"
      subTitleHeader="View"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <ReminderSurveillanceView
          data={certificates}
          pagination={pagination}
          page={page}
          limit={limit}
          onPageChange={setPage}
          isFetching={isFetching}
          refetch={refetch}
          onLimitChange={(v: number) => {
            setLimit(v);
            setPage(1);
          }}
          isLoading={isLoading || isFetching}
        />
      </div>
    </DashboardLayout>
  );
}
