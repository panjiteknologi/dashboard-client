/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/sidebar-apps-menu.ts
import {
  Award,
  BadgeCheck,
  BookOpen,
  // Bot,
  // Calendar,
  CalendarCheck,
  CreditCard,
  FileCheck2,
  FileEdit,
  Folder,
  Gift,
  GraduationCap,
  History,
  LayoutDashboard,
  LibraryIcon,
  LineChart,
  ListChecks,
  Newspaper,
  NotebookTextIcon,
  Search,
  Settings,
  // SquareTerminal,
  User2,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

type NavChild = {
  title: string;
  url: string;
  icon: LucideIcon;
  menu?: NavItem[];
};
type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  children?: NavChild[];
};

export const SidebarAppsMenu: {
  user: { name: string; email: string; avatar: string };
  navMain: NavItem[];
  navSecondary: NavItem[];
  projects: any[];
} = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },

  navMain: [
    {
      title: "Main Applications",
      url: "/dashboard",
      icon: LayoutDashboard,
      children: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Application Form",
          url: "/application-form",
          icon: NotebookTextIcon,
        },
        {
          title: "Our Auditor",
          url: "/our-auditor",
          icon: User2,
        },
          // {
          //   title: "Mandays Calculator",
          //   url: "/mandays",
          //   icon: Calendar,
          // },
          // {
          //   title: "Price Simulation",
          //   url: "/price-simulation",
          //   icon: LineChart,
          // },
        {
          title: "Quotation",
          url: "/quotation",
          icon: LineChart,
        },
      ],
    },
    {
      title: "TSI Scope",
      url: "/scope-determination",
      icon: Search,
      children: [
        {
          title: "Our Scope",
          url: "/scope",
          icon: LibraryIcon,
        },
        {
          title: "Scope Determination",
          url: "/scope-determination",
          icon: Search,
        },
      ],
    },
    {
      title: "Certification Services",
      url: "/tracking-certificate", // parent
      icon: Award,
      children: [
        {
          title: "Tracking Certificate",
          url: "/tracking-certificate",
          icon: Award,
          menu: [
            // {
            //   title: "Label Maps",
            //   url: "/tracking-certificate/label-maps",
            //   icon: SquareTerminal,
            //   isActive: true,
            // },
            // {
            //   title: "TSI",
            //   url: "/tracking-certificate/tsi",
            //   icon: Bot,
            // },
            {
              title: "Project Status",
              url: "/tracking-certificate/audit-status",
              icon: BookOpen,
            },
            // {
            //   title: "Certificate",
            //   url: "/tracking-certificate/certificate",
            //   icon: GraduationCap,
            // },
          ],
        },
        {
          title: "Audit Process",
          url: "/audit-process",
          icon: ListChecks,
          menu: [
            {
              title: "Audit Plan",
              url: "/audit-process/audit-plan",
              icon: CalendarCheck,
            },
            {
              title: "Sharing Document",
              url: "https://tsi-document.manajemensistem.com/",
              icon: FileCheck2,
            },
            {
              title: "Audit Report & Capa",
              url: "/audit-process/capa-and-report",
              icon: FileEdit,
            },
          ],
        },
        {
          title: "Audit History",
          url: "/audit-history",
          icon: History,
        },
      ],
    },
    {
      title: "Finance & Administration",
      url: "/finance",
      icon: CreditCard,
      children: [
        {
          title: "Payments",
          url: "/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Library",
      url: "/library",
      icon: LibraryIcon,
      children: [
        {
          title: "Video K3",
          url: "/library/video-k3",
          icon: Video,
        },
        {
          title: "Regulation",
          url: "/library/regulation",
          icon: Folder,
        },
        {
          title: "Webinars",
          url: "/library/webinars",
          icon: Users,
        },
        {
          title: "Standard ISO",
          url: "/library/standard-iso",
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Perks & Updates",
      url: "/perks-and-updates",
      icon: Gift,
      children: [
        {
          title: "Benefit",
          url: "/perks-and-updates/benefit",
          icon: Gift,
        },
        {
          title: "Rewards Program",
          url: "/perks-and-updates/rewards",
          icon: BadgeCheck,
        },
        {
          title: "Membership",
          url: "/perks-and-updates/membership",
          icon: Users,
        },
        {
          title: "News",
          url: "/perks-and-updates/news",
          icon: Newspaper,
        },
      ],
    },
    {
      title: "Tools & Utilities",
      url: "/tools",
      icon: Settings,
      children: [
        {
          title: "Reminder Surveillance",
          url: "/reminder-surveillance",
          icon: Settings,
        },
      ],
    },
  ],

  navSecondary: [],
  projects: [],
};
