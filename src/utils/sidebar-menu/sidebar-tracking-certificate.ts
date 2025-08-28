import { BookOpen, Bot, GraduationCap, SquareTerminal } from "lucide-react";

export const CapaAndReportMenu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Label Maps",
      url: "/label-maps",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "TSI",
      url: "/tsi",
      icon: Bot,
    },
    {
      title: "Audit Status",
      url: "/audit-status",
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
