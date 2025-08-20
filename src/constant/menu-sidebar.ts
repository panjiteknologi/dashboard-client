import {
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  FileEdit,
  Folder,
  Gift,
  GraduationCap,
  LibraryIcon,
  NotebookIcon,
  Users,
  Video,
} from "lucide-react";

export const SidebarTrackingCertificateMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    // {
    //   title: "Label Maps",
    //   url: "/label-maps",
    //   icon: SquareTerminal,
    //   isActive: true,
    // },
    // {
    //   title: "TSI",
    //   url: "/tsi",
    //   icon: Bot,
    // },
    {
      title: "Audit Status",
      url: "/apps/tracking-certificate/audit-status",
      icon: BookOpen,
    },
    {
      title: "Certificate",
      url: "/certificate",
      icon: GraduationCap,
    },
  ],
  navSecondary: [],
  projects: [],
};

export const SidebarApplicationFormMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Application Form",
      url: "/apps/application-form",
      icon: NotebookIcon,
      isActive: true,
    },
  ],
  navSecondary: [],
  projects: [],
};

export const SidebarScopeMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Scope",
      url: "/apps/scope",
      icon: LibraryIcon,
      isActive: true,
    },
  ],
  navSecondary: [],
  projects: [],
};

export const CapaAndReportMenu = {
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

export const BenefitMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Benefit",
      url: "/apps/benefit",
      icon: Gift,
      isActive: true,
    },
  ],
  navSecondary: [],
  projects: [],
};

export const MembershipMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Membership",
      url: "/apps/membership",
      icon: BadgeCheck,
      isActive: true,
    },
  ],
  navSecondary: [],
  projects: [],
};

export const RewardsMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Rewards",
      url: "/apps/rewards",
      icon: Users,
      isActive: true,
    },
  ],
  navSecondary: [],
  projects: [],
};

export const LibraryMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Video K3",
      url: "/apps/library/video-k3",
      icon: Video,
      isActive: false,
    },
    {
      title: "Regulation",
      url: "/apps/library/regulation",
      icon: Folder,
      isActive: false,
    },
    {
      title: "Webinars",
      url: "/apps/library/webinars",
      icon: Users,
      isActive: false,
    },
    {
      title: "Standard ISO",
      url: "/apps/library/standard-iso",
      icon: GraduationCap,
      isActive: false,
    },
  ],
  navSecondary: [],
  projects: [],
};
