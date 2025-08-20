"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { SidebarScopeMenu } from "@/constant/menu-sidebar";
import { AppSidebarTypes } from "@/types/sidebar-types";
import ScopeLibraryView from "@/views/apps/scope";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

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
