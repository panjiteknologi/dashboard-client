/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Award,
  BookOpen,
  CalendarCheck,
  FileCheck2,
  FileEdit,
  Folder,
  Gift,
  LayoutDashboard,
  LibraryIcon,
  ListChecks,
  LucideGitPullRequestCreate,
  Newspaper,
  NotebookTextIcon,
  Search,
  Settings,
  SquareTerminal,
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
        // {
        //   title: "Quotation",
        //   url: "/quotation",
        //   icon: LineChart,
        // },
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
            // {
            //   title: "Audit Plan",
            //   url: "/audit-process/audit-plan",
            //   icon: CalendarCheck,
            // },
            {
              title: "Sharing Document",
              url: "https://tsi-document.manajemensistem.com/",
              icon: FileCheck2,
            },
            {
              title: "Audit Document Check",
              url: "/audit-process/audit-document-check",
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
          title: "History Audit",
          url: "/our-auditor",
          icon: User2,
        },
        // {
        //   title: "Audit History",
        //   url: "/audit-history",
        //   icon: History,
        // },
      ],
    },
    // {
    //   title: "Finance & Administration",
    //   url: "/finance",
    //   icon: CreditCard,
    //   children: [
    //     {
    //       title: "Payments",
    //       url: "/payments",
    //       icon: CreditCard,
    //     },
    //   ],
    // },
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
          title: "Our Scope Determination",
          url: "/scope-determination",
          icon: Search,
        },
      ],
    },
    {
      title: "Auditors",
      url: "/tools",
      icon: Settings,
      children: [
        {
          title: "Our Auditor Schedule",
          url: "/auditor-schedule",
          icon: CalendarCheck,
        },
      ],
    },
    {
      title: "Library",
      url: "/library",
      icon: LibraryIcon,
      children: [
        {
          title: "Video",
          url: "/library/video-k3",
          icon: Video,
        },
        {
          title: "Regulation",
          url: "/library/regulation",
          icon: Folder,
        },
        // {
        //   title: "Webinars",
        //   url: "/library/webinars",
        //   icon: Users,
        // },
        // {
        //   title: "Standard ISO",
        //   url: "/library/standard-iso",
        //   icon: GraduationCap,
        // },
      ],
    },
    {
      title: "Utilities & Updates",
      url: "/perks-and-updates",
      icon: Gift,
      children: [
        // {
        //   title: "Benefit",
        //   url: "/perks-and-updates/benefit",
        //   icon: Gift,
        // },
        // {
        //   title: "Rewards Program",
        //   url: "/perks-and-updates/rewards",
        //   icon: BadgeCheck,
        // },
        {
          title: "Membership",
          url: "/perks-and-updates/membership",
          icon: Users,
        },
        {
          title: "TSI News",
          url: "/perks-and-updates/news",
          icon: Newspaper,
        },
        {
          title: "Reminder Surveillance",
          url: "/reminder-surveillance",
          icon: Settings,
        },
        {
          title: "Audit Request",
          url: "/audit-request",
          icon: LucideGitPullRequestCreate,
        },
        {
          title: "CRM Lanjut",
          url: "/crm",
          icon: SquareTerminal,
        },
      ],
    },
  ],

  navSecondary: [],
  projects: [],
};
