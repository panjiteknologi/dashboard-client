"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import { ScopeLibraryView } from "@/views/apps";
import { ScopeLibraryProvider } from "@/context/scope-library-context";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/scope"
      titleHeader="Scope Library"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <ScopeLibraryProvider>
          <ScopeLibraryView />
        </ScopeLibraryProvider>
      </div>
    </DashboardLayout>
  );
}
