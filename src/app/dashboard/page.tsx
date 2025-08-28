import DashboardLayout from "@/layout/dashboard-layout";
import { auth } from "@/lib/auth";
import { AppSidebarTypes } from "@/types/sidebar-types";
import {
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  FileEdit,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const menuSidebar = {
    user: {
      ...session.user,
      name: session.user?.name ?? "",
      email: "",
      avatar: "",
    },
    navMain: [
      {
        title: "Progress Audit",
        url: "/apps/audit-process/audit-stage-1/capa-and-report",
        icon: ClipboardList,
        isActive: false,
        children: [
          {
            title: "Audit Plan",
            url: "/apps/audit-process/audit-stage-1/audit-plan",
            icon: CalendarCheck,
          },
          {
            title: "Sharing Document",
            url: "https://tsi-document.manajemensistem.com/",
            icon: FileCheck2,
          },
          {
            title: "Audit Report & Capa",
            url: "/apps/audit-process/audit-stage-1/capa-and-report",
            icon: FileEdit,
          },
        ],
      },
    ],
    navSecondary: [],
    projects: [],
  };

  return (
    <DashboardLayout menuSidebar={menuSidebar as AppSidebarTypes}>
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </DashboardLayout>
  );
}
