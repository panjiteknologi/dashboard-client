import {
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  FileEdit,
} from "lucide-react";

export const SidebarCapaAndReportMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
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
    // {
    //   title: "Audit Stage 2",
    //   url: "/apps/audit-process/audit-stage-2/capa-and-report",
    //   icon: ClipboardList,
    //   isActive: false,
    //   children: [
    //     {
    //       title: "Audit Plan",
    //       url: "/apps/audit-process/audit-stage-2/audit-plan",
    //       icon: CalendarCheck,
    //     },
    //     {
    //       title: "Sharing Document",
    //       url: "/apps/audit-process/audit-stage-2/sharing",
    //       icon: FileCheck2,
    //     },
    //     {
    //       title: "Audit Report & Capa",
    //       url: "/apps/audit-process/audit-stage-2/capa-and-report",
    //       icon: FileEdit,
    //     },
    //   ],
    // },
  ],
  navSecondary: [],
  projects: [],
};
