"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { useEffect, useRef } from "react";
import { useDataOurAuditorQuery } from "@/hooks/use-data-our-auditor";
import { OurAuditorView } from "@/views/apps";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  const hasMounted = useRef(false);

  // Always refetch on mount - like refresh halaman
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useDataOurAuditorQuery({
    staleTime: 0, // Always consider data stale
    refetchOnMount: false, // Manual refetch instead
    retry: 2,
  });

  // Force refetch on mount
  useEffect(() => {
    refetch();
  }, []);

  // Simple loading logic
  const isRefetching = isFetching;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/our-auditor"
      titleHeader="History Audit"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-md font-bold">History Audit</h1>
          {/* Refetching indicator */}
          {isRefetching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>
        <OurAuditorView
          data={data}
          loading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
